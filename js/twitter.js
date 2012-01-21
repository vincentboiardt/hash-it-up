var Twitter = {
	init: function() {
		Twitter.list = $('#list');
		Twitter.request();
		Twitter.interval = setInterval( Twitter.request, 5000 );
	},
	request: function(){
		$.getJSON( 'http://search.twitter.com/search.json', { q: 'protothon+open.spotify.com', include_entities: 1, callback: '?' }, function(response){
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