import Spotify from 'spotify-web-api-js'
export default {
  name: 'spotifyMixin',
  data() {
    return {
      spotifyApi: new Spotify()
    }
  },
  methods: {
    getMe: function(callback) {
      let accessToken = this.$cookie.get('access_token');
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.getMe()
      .then(function(res) {
        console.log(res);
        return callback(res);
      })
      .catch(function(err) {
        return callback(err);
      })
    },
    getPlaylists: function(callback, usr) {
      this.spotifyApi.getUserPlaylists()
      .then(function(data) {
        return callback(data);
      }, function(err) {
        return callback(err);
      });
    },
    getRecentlyPlayed: function(callback) {
      this.spotifyApi.getRecentlyPlayed()
      .then(function(data) {
        return callback(data);
      }, function(err) {
        return callback(err);
      });
    }
  }
}
