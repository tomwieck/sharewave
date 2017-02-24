const reusable = require('./reusableFunctions');
const setupVar = require('./setupVariables');

module.exports = {
  generateUrl: function(spotifyApi) {
  //Create random state and store in cookie
  var state = reusable.generateRandomString(16);
  //Create url and add show dialog to check user
  let authorizeURL = spotifyApi.createAuthorizeURL(setupVar.scopes, state) 
  	+ '&show_dialog=true';
  return { 
	  	authUrl: authorizeURL,
	  	state: state 
  	};
	},
	generateAccess: function(spotifyApi, req, callback) {
		// Requests refresh and access tokens, check state parameter
		let code = req.query.code || null;
	  
	  // let state = req.query.state || null;
	  // let storedState = req.cookies ? req.cookies[setupVar.stateKey] : null;
	  // NEEDS FURTHER TESTING WHEN DEPLOYED
	  // if state returned doesnt match the stored cookie state or null
	  // if (state === null || state !== storedState) {
	  //   return { error: 'state_mismatch'};
	  // }

	  spotifyApi.authorizationCodeGrant(code)
      .then(function(data) {
        //Set the access token on the API object to use it in later calls
        console.log()
        return callback({ 
        	access_token: data.body['access_token'],
        	refresh_token: data.body['refresh_token'] 
        });
      }, function(err) {
        return callback({ error: 'invalid_token' });
      })
	}
};

