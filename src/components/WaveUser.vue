<template>
  <div class='timer'>
    <div class="wave--profile-pic"
         v-bind:class="[ waveTrue ? 'wave-true pulse' : 'wave-false', userKey]"
         @click="playWave($event, userKey)"
         :style="cssObject(imgUrl || placeholderUrl)"/>
    <div class='timer--rect timer--left'>
      <div v-bind:class='"timer-" + userKey'></div>
    </div>
    <div class='timer--rect timer--right'>
      <div v-bind:class='"timer-" + userKey'></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WaveUser',
  data() {
    return {
      placeholderUrl: '../static/placeholder.png'
    }
  },
  props: ['userKey', 'imgUrl', 'waveTrue'],
  methods: {
    playWave(event, key) {
      this.$emit('playWave', event, key)
    },
    cssObject(img) {
      return {
        background: `url(${img}) top/cover no-repeat`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.wave--profile-pic {
  border-radius: 50%;
  left: 5px;
  position: absolute;
  top: 5px;
  width: 100px;
  height: 100px;
  z-index: 1;
  @media screen and (max-width: $break-tablet) {
    width: 78px;
    height: 78px;
  }
}

.wave-true {
  border: 5px solid $play-color;
  top: 0;
  left: 0;
  cursor: pointer;
  @media screen and (max-width: $break-tablet) {
    border: 3px solid $play-color;
  }
}

.wave-false {
  border: 5px solid grey;
  top: 0;
  left: 0;
  pointer-events: none;
  @media screen and (max-width: $break-tablet) {
    border: 3px solid grey;
  }
}

// Pulse START
.pulse {
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 rgba(41,157,207, 0.4);
}

@-webkit-keyframes pulse {
  0% { -webkit-box-shadow: 0 0 0 0 rgba(41,157,207, 0.4);}
  70% {-webkit-box-shadow: 0 0 0 10px rgba(41,157,207, 0);}
  100% { -webkit-box-shadow: 0 0 0 0 rgba(41,157,207, 0);}
}
@keyframes pulse {
  0% { -moz-box-shadow: 0 0 0 0 rgba(41,157,207, 0.4); box-shadow: 0 0 0 0 rgba(41,157,207, 0.4);}
  70% { -moz-box-shadow: 0 0 0 10px rgba(41,157,207, 0); box-shadow: 0 0 0 10px rgba(41,157,207, 0);}
  100% { -moz-box-shadow: 0 0 0 0 rgba(41,157,207, 0); box-shadow: 0 0 0 0 rgba(41,157,207, 0);}
}
// Pulse END

// Spin effect keyframes
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

.wave--playing {
  border: none;
  top: 5px;
  left: 5px;
  -webkit-animation:spin 2s linear infinite;
  -moz-animation:spin 2s linear infinite;
  animation:spin 2s linear infinite;
  @media screen and (max-width: $break-tablet) {
    top: 2.5px;
    left: 3px;
  }
}

// Timer START
.timer {
  background-size: 100px 100px;
  background-repeat: no-repeat;
  border-radius: 100%;
  width: 110px;
  height: 110px;
  position: relative;
  z-index: 1;
  margin: 0 5px;
  @media screen and (max-width: $break-tablet) {
    background-size: 78px 78px;
    width: 84px;
    height: 84px;
  }
}

.timer--rect {
  position: absolute;
  width: 110px;
  height: 110px;
  clip: rect(0px, 110px, 110px, 55px);
  border-radius: 100%;
  background-color: $play-color;
  @media screen and (max-width: $break-tablet) {
    clip: rect(0px, 84px, 84px, 42px);
    width: 84px;
    height: 84px;
  }
}

.fill {
  background-color: $logo-color;
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 100%;
  clip: rect(0px, 55px, 110px, 0px);
  @media screen and (max-width: $break-tablet) {
    clip: rect(0px, 42px, 84px, 0px);
    width: 84px;
    height: 84px;
  }
}

@keyframes left { 0%{-webkit-transform:rotate(0deg);} 100%{transform:rotate(180deg);} }
@-webkit-keyframes left { 0%{-webkit-transform:rotate(0deg);} 100%{-webkit-transform:rotate(180deg);}}

.timer--left .fill {
  -webkit-animation: left 15s linear ;
  -moz-animation: left 15s linear ;
  animation: left 15s linear both;
}

.timer--right {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  transform: rotate(180deg);
}

@keyframes right { 0%{-webkit-transform:rotate(0deg);} 100%{transform:rotate(180deg);} }
@-webkit-keyframes right { 0% {transform: rotate(0deg);} 100% {transform: rotate(180deg);} }

.timer--right .fill {
  -webkit-animation: right 15s linear ;
  -moz-animation: right 15s linear ;
  animation: right 15s linear both ;
  -webkit-animation-delay: 15s;
  -moz-animation-delay: 15s;
  animation-delay: 15s;
}
// Timer END
</style>
