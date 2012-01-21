var Twitter = {
	loaded: 0,
	failed: 0,
	autoStart: false,
	init: function() {
		Twitter.list = $('#list');
		Twitter.term = 'protothon';
		Twitter.tracks = [];
		Twitter.request();
		
		
		//Twitter.interval = setInterval( Twitter.request, 5000 );
		
		$('#form').submit(function(e){
			e.preventDefault();
			
			Twitter.autoStart = true;
			Twitter.term = $('#term').val().replace('#', '');
			
			if ( Twitter.term.length > 0 )
				Twitter.request();
		});
	},
	request: function(){
		Twitter.loaded = 0;
		Twitter.failed = 0;
		Twitter.tracks = [];
		
		//if ( ! Twitter.playlist || ( Twitter.playlist || Twitter.playlist.name != '#' + Twitter.term ) )
			Twitter.playlist = new m.Playlist();
		
		$.getJSON( 'http://search.twitter.com/search.json', { q: Twitter.term + '+open.spotify.com', include_entities: 1, callback: '?' }, function(response){
			if ( response.results.length ) {
				Twitter.tweets = response.results;
				Twitter.render();
			} else {
				$('#no-results').slideDown(200, function(){
					setTimeout(function(){
						$('#no-results').slideUp(1000);
					}, 5000)
				});
			}
		});
	},
	render: function(){
		Twitter.list.empty();
		
		if ( Twitter.playlist ) {
			$(Twitter.playlist.tracks).each(function(){
				Twitter.playlist.remove(this);
			});
		}
		
		$(Twitter.tweets).each(function(i, obj){
			var tweet = new Tweet(this);
			tweet.appendTo(Twitter.list);
			Twitter.tracks.push(tweet);
		});
	},
	play: function() {
		m.player.play(Twitter.playlist.tracks[0], Twitter.playlist);
	}
}