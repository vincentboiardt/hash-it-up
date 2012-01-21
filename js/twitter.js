var Twitter = {
	init: function() {
		Twitter.list = $('#list');
		Twitter.term = 'protothon';
		
		Twitter.request();
		
		
		//Twitter.interval = setInterval( Twitter.request, 5000 );
		
		$('#form').submit(function(e){
			e.preventDefault();
			
			Twitter.term = $('#term').val().replace('#', '');
			Twitter.request();
		});
	},
	request: function(){
		Twitter.playlist = new m.Playlist('#' + Twitter.term);
		
		$.getJSON( 'http://search.twitter.com/search.json', { q: Twitter.term + '+open.spotify.com', include_entities: 1, callback: '?' }, function(response){
			if ( response.results.length ) {
				Twitter.tweets = response.results;
				Twitter.render();
			}
		});
	},
	render: function(){
		Twitter.list.empty();
		console.log(Twitter.tweets);
		
		$(Twitter.tweets).each(function(){
			var tweet = new Tweet(this);
			tweet.appendTo(Twitter.list);
		});
	}
}