var axios = require('axios');
var cookieParser = require('cookie-parser');
var cors = require('cors')
var path = require('path')
var Promise = require('promise');
var querystring = require('querystring');
var admin = require("firebase-admin");
var YouTube = require('youtube-node');

const handleLogin = require('./handleLogin');
const spotify = require('./spotifyFunctions');
const setupVar = require('./setupVariables');
// Google Setup (Move to secret.js)
var youTube = new YouTube();
youTube.setKey(setupVar.googleKey);
youTube.addParam('videoCategoryId', '10');
youTube.addParam('type', 'video');

//Spotify Setup
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
      redirectUri : setupVar.redirectUri,
      clientId : setupVar.clientId,
      clientSecret : setupVar.clientSecret
    });

//Firebase Setup
//Server
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
	    spotifyApi.setRefreshToken(callback.refresh_token);
	  	spotify.getMe(spotifyApi, function(me) {
	  		const safeId = me.id.replace(/\./g, '%2E');
			createFirebaseToken(safeId)
			.then(function(firebaseToken) {
				res.redirect(`http://localhost:8080/#/loggedin/${callback.access_token}/${callback.refresh_token}/${firebaseToken}`);
			});
		});
	});
});

app.get('/getMe', function(req, res) {
	//currently not being used
	spotifyApi.setAccessToken(req.query.access_token);
	spotify.getMe(spotifyApi, function(callback) {
		res.send(callback);
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

function extractData(response) {
	if (response.data) { return extractItunesData(response.data.results) }
	if (response.body) { return extractSpotifyData(response.body.tracks.items) }
	if (response.items) { return extractYoutubeData(response.items) }
}

function makeAllCalls(services, searchTerm) {
  return Promise.all(services.map(function(s) {return makeCalls(s, searchTerm)}));  
}

function makeCalls(s, searchTerm) {
	if (s === 'Spotify') {
		return spotifyApi.searchTracks(searchTerm); 
	}
	else if (s === 'iTunes') {
		return axios.get(`http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsSearch?country=GB&limit=20&entity=musicTrack&term=${searchTerm}`)
	}
	else if (s === 'YouTube') {
		return new Promise(function (resolve, reject) {
			youTube.search(searchTerm, 20, function(err, res) {
				if (err) reject(err);
				else resolve(res);
			})
		});
	}
}

function extractSpotifyData(data) {
	var spotifyData = {spotify: {}}
	for (i = 0; i < data.length; i++) {
		spotifyData.spotify[i] = {
			album: data[i].album.name,
			artist: data[i].artists[0].name,
			artwork: data[i].album.images[2].url,
			id: data[i].id,
			previewUrl: data[i].preview_url,
			service: 'spotify',
			track: data[i].name,
			url: data[i].uri
		}
	}
	return spotifyData;
}

function extractItunesData(data) {
	var itunesData = {itunes: {}}
	for (i = 0; i < data.length; i++) {
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
	return itunesData;
}

function extractYoutubeData(data) {
	var youtubeData = {youtube: {}}
	for (i = 0; i < data.length; i++) {
		youtubeData.youtube[i] = {
			artwork: data[i].snippet.thumbnails.default.url,
			id: data[i].id.videoId,
			previewUrl: data[i].preview_url,
			service: 'youtube',
			title: data[i].snippet.title,
			url: `https://www.youtube.com/watch?${data[i].id.videoId}`
		}
	}
	return youtubeData;
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
  // The uid we'll assign to the user.
  const uid = `${id}`;
  // const uid = `spotify:${id}`;
  // Create the custom token.
  return admin.auth().createCustomToken(uid);
}

console.log('Listening on 8888');
server.listen(8888);
