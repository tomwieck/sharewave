if(!process.env.CLIENT_SECRET) {
  var env = require('./secret.js')
}
//State Key cookie 
var stateKey = 'spotify_auth_state';

//Spotify API Setup
var scopes = ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private', 'user-read-recently-played', 'playlist-read-collaborative'],
    clientSecret = process.env.CLIENT_SECRET,
    redirectUri = 'http://localhost:8888/callback';
    clientId = 'ff19960978a6466c965de4cabdb54929';
// clientSecret = process.env.clientSecret;


//Export
exports.stateKey = stateKey;
exports.scopes = scopes;
exports.clientSecret = clientSecret;
exports.redirectUri = redirectUri;
exports.clientId = clientId;