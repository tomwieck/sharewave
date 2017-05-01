import Spotify from 'spotify-web-api-js'

export default {
  name: 'spotifyMixin',
  data() {
    return {
      spotifyApi: new Spotify()
    }
  },
  methods: {
    setAccessToken: function(check) {
      let vm = this;
      if (vm.$cookie.get('access_token') !== null) {
        vm.spotifyApi.setAccessToken(vm.$cookie.get('access_token'));
        return check();
      } else {
        let refreshToken = vm.$cookie.get('refresh_token')
        vm.axios.get(`http://localhost:8888/refreshToken?refreshToken=${refreshToken}`)
          .then(function (response) {
            vm.$cookie.set('access_token', response.data, { expires: '1h' });
            vm.spotifyApi.setAccessToken(response.data);
            return check();
          })
          .catch(function (error) {
            return check(error);
          })
      }
    },
    getMe: function(callback) {
      this.setAccessToken(check => {
        this.spotifyApi.getMe()
        .then(res => {
          return callback(res);
        })
        .catch(err => {
          return callback(err);
        });
      });
    },
    getPlaylists: function(callback) {
      this.setAccessToken(check => {
        this.spotifyApi.getUserPlaylists()
        .then(function(data) {
          return callback(data);
        }, function(err) {
          return callback(err);
        });
      });
    },
    getRecentlyPlayed: function(callback) {
      this.setAccessToken(check => {
        this.spotifyApi.getRecentlyPlayed()
        .then(function(data) {
          return callback(data);
        }, function(err) {
          return callback(err);
        });
      });
    },
    getSinglePlaylist: function(options, callback) {
      this.setAccessToken(check => {
        let accessToken = this.$cookie.get('access_token') || this.$cookie.get('client_access_token');
        this.spotifyApi.setAccessToken(accessToken);
        console.log(options.fields);
        this.spotifyApi.getPlaylist(options.user, options.playlist, options.fields)
        .then(function(data) {
          return callback(data);
        }, function(err) {
          return callback(err);
        });
      });
    },
    getUser: function(id, callback) {
      this.setAccessToken(check => {
        console.log(id);
        this.spotifyApi.getUser(id)
        .then(function(data) {
          return callback(data);
        }, function(err) {
          return callback(err);
        });
      })
    },
    updatePlaylistName: function(userId, playlistId, newName, callback) {
      this.setAccessToken(check => {
        let data = {name: newName};
        this.spotifyApi.changePlaylistDetails(userId, playlistId, data)
        .then(function(data) {
          return callback(data);
        }, function(err) {
          return callback(err);
        });
      })
    }
  }
}
