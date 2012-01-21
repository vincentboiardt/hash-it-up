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
		
		this.tweetNode = $('<div class="tweet-data clear"><div style="background-image: url(' + this.tweet.profile_image_url + ')" class="image"></div><h1>' + this.tweet.from_user_name + '</h1>' + twttr.txt.autoLink( text ) + '</div>').appendTo(this.node);
		this.spotifyNode = $('<div class="spotify-data clear"></div>').appendTo(this.node);
		
		$( this.tweet.entities.urls ).each(function(){
			text = text.replace(this.url, this.expanded_url);
			
			var spotify = /(track|artist|playlist|album)\/(.*)/.exec(this.expanded_url);
			if ( spotify.length === 3 ) {
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
				m[model].fromURI(spotifyObj.uri, function(modelData){
					spotifyObj.data = modelData.data;
					
					obj.albumCover =  new ui.SPImage( spotifyObj.data.album.cover ? spotifyObj.data.album.cover : "sp://import/img/placeholders/300-album.png");
					
					obj.spotifyNode.append(obj.albumCover.node);
					obj.spotifyNode.append('<h2><a href="' + spotifyObj.uri + '">' + spotifyObj.data.name + '</a></h2>');
					
					var artists = $('<h3></h3>')
					$(spotifyObj.data.artists).each(function(){
						artists.append('<a href="' + this.uri + '">' + this.name + '</a>');
					});
					
					obj.spotifyNode.append(artists);
					
					obj.show();
					
				});
			});
		}
		
	},
	show: function(){
		this.node.show();
	},
	appendTo: function(parent){
		this.node.appendTo(parent);
	}
}