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
      let vm = this;
      let accessToken = vm.$cookie.get('access_token');
      vm.spotifyApi.setAccessToken(accessToken);
      vm.spotifyApi.getMe()
      .then(function(res) {
        vm.$cookie.set('user', res.id);
        return callback(res);
      })
      .catch(function(err) {
        return callback(err);
      })
    },
    getPlaylists: function(callback) {
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
    },
    getSinglePlaylist: function(options, callback) {
      let vm = this;
      let accessToken = vm.$cookie.get('access_token') || vm.$cookie.get('client_access_token');
      vm.spotifyApi.setAccessToken(accessToken);
      vm.spotifyApi.getPlaylist(options.user, options.playlist, options.fields)
      .then(function(data) {
        return callback(data);
      }, function(err) {
        return callback(err);
      });
    },
    updatePlaylistName: function(userId, playlistId, newName, callback) {
      let data = {name: newName};
      this.spotifyApi.changePlaylistDetails(userId, playlistId, data)
      .then(function(data) {
        return callback(data);
      }, function(err) {
        return callback(err);
      });
    },
    checkAccessToken: function(check) {
      let vm = this;
      if (vm.$cookie.get('access_token') === null) {
        let refreshToken = vm.$cookie.get('refresh_token')
        vm.axios.get(`http://localhost:8888/refreshToken?refreshToken=${refreshToken}`)
        .then(function (response) {
          vm.$cookie.set('access_token', response.data);
          return check();
        })
        .catch(function (error) {
          return check(error);
        })
      } else {
        return check();
      }
    }
  }
}
