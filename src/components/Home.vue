<template>
  <div class="homepage">
  	<div class="left">
  		<h1 class="homepage--welcome homepage--welcome__left logo-font">Share</h1>
	  	<div class="text-container">
	  		<h2 class="homepage--heading">Add songs to Your Wave</h2>
  			<h2 class="homepage--heading">Follow your friends to hear what they are listening to</h2>
  		</div>
  		<h3 class="homepage--heading">Create a free ShareWave Account, or, </h3>
  		<h3 class="homepage--heading">Login with Spotify</h3>
  	</div>
  	<div class="right">
	  	<h1 class="homepage--welcome homepage--welcome__right logo-font">Wave</h1>
	  	<div class="text-container">
	  		<h2 class="homepage--heading__right">Upload Playlists to ShareWave</h2>
	  		<h2 class="homepage--heading__right">Or search for and discover new ones</h2>
	  		<small>(Must login with Spotify)</small>
	  	</div>
  		<h3 class="homepage--heading__right">Create a free ShareWave Account, or, </h3>
  		<h3 class="homepage--heading__right">Login with Spotify</h3>

  	</div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.text-container {
	height: 200px;
	padding-top: 50px;
}

.homepage--welcome {
	// position: absolute;
	font-size: 60px;
	padding-top: 10px;
}

.homepage--welcome__right {
	color: $logo-color;
	text-align: left;
	@media screen and (max-width: $break-tablet) {
		text-align: right;
	}
}

.homepage--welcome__left {
	color: white;
	text-align: right;
	@media screen and (max-width: $break-tablet) {
		text-align: left;
	}
}

.blank-space {
	width: 100%;
	@media screen and (max-width: $break-tablet) {
		width: 100%;
		height: 10px;
	}
	height: 60px;

}
.homepage--heading {
	color: white;
}

.homepage--heading__right {
	color: $logo-color;
}


.left, .right {
	display: inline-block;
	@media screen and (max-width: $break-tablet) {
		width: 100%;
		height: 40vh;
	}
	width: 50%;
	height: 90vh;
	position: relative;
}

.left {
	float: left;
	background-color: $logo-color;
}

.right {
	// background-color: $play-color;
}

</style>
