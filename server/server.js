var axios = require('axios');
var cookieParser = require('cookie-parser');
var cors = require('cors')
var path = require('path')
var Promise = require('promise');
var querystring = require('querystring');

// from tutorial, will need to npm i --save express-jwt jsonwebtoken
//var expressJWT = require ('express-jwt')
//var jwt = require ('jsonwebtoken')

const handleLogin = require('./handleLogin');
const spotify = require('./spotifyFunctions');

//Spotify Setup
var SpotifyWebApi = require('spotify-web-api-node');
var setupVar = require('./setupVariables');
var spotifyApi = new SpotifyWebApi({
      redirectUri : setupVar.redirectUri,
      clientId : setupVar.clientId,
      clientSecret : setupVar.clientSecret
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
  	// console.log(querystring.stringify(callback));
	res.redirect(`http://localhost:8080/#/loggedin/${callback.access_token}/${callback.refresh_token}`);
  });
});

app.get('/getMe', function(req, res) {
	//currently not being used
	console.log(req.query.access_token);
	spotifyApi.setAccessToken(req.query.access_token);
	spotify.getMe(spotifyApi, function(callback) {
		res.send(callback);
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
		console.log(err);
	  // If any of the files fails to be read, err is the first error
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
			console.log(response.data);
			res.send(response.data);
		})
		.catch(function(err) {
			console.log(err);
			res.send(err);
		})
});

function extractData(response) {
	if (response.data) { return extractItunesData(response.data.results) }
	if (response.body) { return extractSpotifyData(response.body.tracks.items) }
}

function makeAllCalls(services, searchTerm) {
  return Promise.all(services.map(function(s) {return makeCalls(s, searchTerm)}));  
}

function makeCalls(s, searchTerm) {
	if (s === 'Spotify') {
		return spotifyApi.searchTracks(searchTerm); 
	}
	else if (s === 'iTunes') {
		return axios.get(
			`http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsSearch?country=GB&limit=20&entity=musicTrack&term=${searchTerm}`)
	}
}

function extractSpotifyData(data) {
	var spotifyData = {spotify: {}}

	for (i = 0; i < data.length; i++) {
		spotifyData.spotify[i] = {
			album: data[i].album.name,
			artist: data[i].artists[0].name,
			artwork: data[i].album.images[2].url,
			previewUrl: data[i].preview_url,
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
			previewUrl: data[i].previewUrl,
			track: data[i].trackName,
			url: data[i].trackViewUrl
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

console.log('Listening on 8888');
server.listen(8888);
