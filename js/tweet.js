var Tweet = function(tweet){
	this.node = $('<li></li>');
	this.node.hide();
	this.tweet = tweet;
	this.spotifyObjects = [];
	this.parse();
}
Tweet.prototype = {
	parse: function() {
		var obj = this;
		var text = this.tweet.text;
		
		var tweetData = $('<div class="tweet-data clear"><div style="background-image: url(' + this.tweet.profile_image_url + ')" class="image"></div><div class="text"><h1>' + this.tweet.from_user_name + '</h1><p>' + twttr.txt.autoLink( text ) + '</p><p class="date">' + Helpers.formatDate( this.tweet.created_at ) + '</p></div></div>').appendTo(this.node);
		var spotifyData = $('<div class="spotify-data clear"></div>').appendTo(this.node);
		
		$( this.tweet.entities.urls ).each(function(){
			text = text.replace(this.url, this.expanded_url);
			
			var spotify = /(track)\/(.*)/.exec(this.expanded_url);
			if ( spotify && spotify.length === 3 ) {
				obj.spotifyObjects.push({
					type: spotify[1],
					uri: 'spotify:' + spotify[0].replace('/', ':')
				});
			}
		});
		
		if ( this.spotifyObjects.length ) {
			$(this.spotifyObjects).each(function(){
				var spotifyObj = this;
				var model = spotifyObj.type.toUpperCase().substr(0,1);
				model += spotifyObj.type.substr(1);
				
				if ( model != 'Track' )
					return; // Only tracks for now
				
				m[model].fromURI(spotifyObj.uri, function(modelData){
					spotifyObj.data = modelData.data;
					spotifyObj.model = modelData;
					
					var player = new v.Player(modelData);
					
					player.context = Twitter.playlist;
					//spotifyData.append(player.node);
					//console.log(player);
					Twitter.playlist.add(modelData);
					
					obj.albumCover =  new ui.SPImage( spotifyObj.data.album.cover ? spotifyObj.data.album.cover : "sp://import/img/placeholders/300-album.png");
					spotifyData.append(obj.albumCover.node);
					//$(player.image).replaceWith(obj.albumCover.node);
					
					var text = $('<div class="text"></div>');
					
					text.append('<h2><a href="' + spotifyObj.uri + '">' + spotifyObj.data.name + '</a></h2>');
					
					var artists = $('<h3></h3>')
					$(spotifyObj.data.artists).each(function(){
						artists.append('<a href="' + this.uri + '">' + this.name + '</a>');
					});
					
					text.append(artists);
					spotifyData.append(text);
					obj.show();
				});
			});
		}		
	},
	show: function(){
		this.node.show();
<<<<<<< HEAD
		
		//console.log(Twitter.loaded, Twitter.tweets.length, Twitter.failed)
		
		if ( Twitter.autoStart && Twitter.loaded == (Twitter.tweets.length - Twitter.failed) ) {
=======
		if (Twitter.tracks.length > 0) {
>>>>>>> origin/master
			Twitter.play();
		}

	},
	appendTo: function(parent){
		this.node.appendTo(parent);
	}
}
