var axios = require('axios');
var cookieParser = require('cookie-parser');
var cors = require('cors')
var path = require('path')
var Promise = require('promise');
var querystring = require('querystring');
var admin = require("firebase-admin");

const handleLogin = require('./handleLogin');
const spotify = require('./spotifyFunctions');
const setupVar = require('./setupVariables');

//Spotify Setup
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
      redirectUri : setupVar.redirectUri,
      clientId : setupVar.clientId,
      clientSecret : setupVar.clientSecret
    });

//Firebase Setup
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sharewave-d0ea7.firebaseio.com"
});

// Express Setup
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.use(express.static(path.join(__dirname, '../dist')))
   .use(cookieParser())
   .use(cors());

app.get('/login', (req, res) => {
	let urlObj = handleLogin.generateUrl(spotifyApi, setupVar.scopes);
	// res.cookie(setupVar.stateKey, urlObj.state);
	res.cookie(setupVar.stateKey, urlObj.state, { maxAge: 900000, httpOnly: false, domain: 'localhost' });
	res.send(urlObj.authUrl);
});

app.get('/callback', function(req, res) {
  	handleLogin.generateAccess(spotifyApi, req, function(callback){
	  	res.clearCookie(setupVar.stateKey);
	    spotifyApi.setAccessToken(callback.access_token);
	  	spotify.getMe(spotifyApi, function(me) {
	  		const safeId = me.id.replace(/\./g, '%2E');
			createFirebaseToken(safeId)
			.then(function(firebaseToken) {
				res.redirect(`http://localhost:8080/#/loggedin/${callback.access_token}/${callback.refresh_token}/${firebaseToken}`);
			});
		});
	});
});

app.get('/clientCredential', function(req, res) {
	// stringify required when using Content-Type header
	let base64string = new Buffer(`${spotifyApi.getClientId()}:${spotifyApi.getClientSecret()}`).toString('base64');
	let clientUrl = 'https://accounts.spotify.com/api/token'
	let grantType = querystring.stringify({
	    grant_type: 'client_credentials'
	  });
	let headers = {
	    headers: {
	    	'Authorization': 'Basic ' + base64string,
	    	'Content-Type': 'application/x-www-form-urlencoded'
	    }
	};
	axios.post(clientUrl, grantType, headers)
		.then(function(response) {
			res.send(response.data);
		})
		.catch(function(err) {
			res.send(err);
		})
});

app.get('/refreshToken', function(req, res) {
	spotifyApi.setRefreshToken(req.query.refreshToken);
	spotifyApi.refreshAccessToken()
	.then(function(data) {
	  res.send(data.body['access_token']);
	},
	function(err) {
	  res.status(err.statusCode).send(err);
	});
});

app.get('/trackArtwork', function(req, res) {
	spotifyApi.getTrack(req.query.trackId)
	.then(function(data) {
	  let images = data.body.album.images;
	  res.send(images[1] ? images[1].url : images[0].url);
	},
	function(err) {
	  res.status(err.statusCode).send(err);
	});
});

app.get('/search', function(req, res) {
	let searchTerm = req.query.searchTerm;
	let servicesArr = req.query.services.split(' ');
	spotifyApi.setAccessToken(req.query.access_token);

	makeAllCalls(servicesArr, searchTerm).done(function (results) {
	  let data = results.map(extractData);
	  let objectData = removeOuterArray(data);

	  res.send(objectData);
	}, function (err) {
	  	res.status(err.statusCode).send(err);
		console.log(err);
	  // If any of the files fails to be read, err is the first error
	});
});


function makeAllCalls(services, searchTerm) {
  return Promise.all(services.map(function(s) {return makeCall(s, searchTerm)}));
}

function makeCall(s, searchTerm) {
	if (s === 'Spotify') {
		return spotifyApi.searchTracks(searchTerm);
	}
	else if (s === 'iTunes') {
		return axios.get(`http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsSearch?country=GB&limit=20&media=music&entity=song&term=${searchTerm}`)
	}
}

function extractData(response) {
	if (response.data) { return extractItunesData(response.data.results) }
	if (response.body) { return extractSpotifyData(response.body.tracks.items) }
}

function extractSpotifyData(data) {
	var spotifyData = {spotify: {}}
	for (i = 0; i < data.length; i++) {
		if(data[i].preview_url) {
			spotifyData.spotify[i] = {
				album: data[i].album.name,
				artist: data[i].artists[0].name,
				artwork: data[i].album.images[1].url,
				id: data[i].id,
				previewUrl: data[i].preview_url,
				service: 'spotify',
				track: data[i].name,
				url: data[i].uri
			}
		}
	}
	return spotifyData;
}

function extractItunesData(data) {
	var itunesData = {itunes: {}}
	for (i = 0; i < data.length; i++) {
		if (data[i].previewUrl) {
			itunesData.itunes[i] = {
				album: data[i].collectionName,
				artist: data[i].artistName,
				artwork: data[i].artworkUrl100,
				id: data[i].trackId,
				previewUrl: data[i].previewUrl,
				service: 'itunes',
				track: data[i].trackName,
				url: data[i].trackViewUrl
			}
		}
	}
	return itunesData;
}

function removeOuterArray(array) {
	let objectData = {};
	for (i = 0; i < array.length; i++) {
		keyName = Object.keys(array[i]);
		objectData[keyName] = array[i][keyName];
	}
	return objectData;
}

function createFirebaseToken(id) {
  // Create the custom token.
  return admin.auth().createCustomToken(`${id}`);
}

let port = process.env.PORT || 8888
console.log('Listening on ' + port);
server.listen(port);
