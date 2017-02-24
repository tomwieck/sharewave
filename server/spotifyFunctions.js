module.exports = {
	getMe: (spotifyApi, callback) => {
	  spotifyApi.getMe()
		  .then(function(data) {
		    return callback(data.body);
		  }, function(err) {
		    return callback(err);
		  });
	}
};
