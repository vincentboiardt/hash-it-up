var Twitter = {
	tweets: [],
	hashtag: "",
	completedHashQuery: false,
	completedFromHashUserQuery: false,
	// initialize twitter search object
	init: function() {
		Twitter.list = $("#list");

		Twitter.start();
		Twitter.doHashRequest("#protothon");

		$('#form').submit(function(e){
			e.preventDefault();
			hash = $('#term').val();
			if (hash.length > 0) {
				Twitter.doHashRequest(hash);
			}
		});
	},
	// reset object when starting a new search
	start: function() {
		Twitter.tweets = [];
		Twitter.tracks = [];
		Twitter.hashtag = "";
		Twitter.completedHashQuery = false;
		Twitter.completedFromHashUserQuery = false;
	},
	// request all tweets with hashtag
	doHashRequest: function(hashtag) {
		if (hashtag != Twitter.hashtag) {
			Twitter.start();
			Twitter.playlist = new m.Playlist();
			Twitter.hashtag = hashtag;
			Twitter.request(Twitter.hashtag, null, 20,
					true, Twitter.handleHashResponse);
		}
	},
	// handle all tweets with hashtag
	handleHashResponse: function(response) {
		if (response.results.length) {
			$.extend(Twitter.tweets, response.results);
			Twitter.completedHashQuery = true;
		}
		Twitter.finish();
	},
	// finish search if all conditions met, or continue
	finish: function() {
		if (Twitter.completedHashQuery) {
			Twitter.render();
		}
		if (Twitter.tracks.length > 0) {
			Twitter.play();
		}
		else if (Twitter.tracks.length == 0) {
			$('#no-results').slideDown(200, function(){
				setTimeout(function(){
					$('#no-results').slideUp(1000);
				}, 5000)
			});
		}
	},
	// render when search has finished
	render: function(){
		Twitter.list.empty();
		
		if (Twitter.playlist) {
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
	// play loaded playlist
	play: function() {
		m.player.play(Twitter.playlist.tracks[0], Twitter.playlist);
	},
	// do a general request with specified response handler
	request: function(term, fromUser, rpp, containingSong, responseHandler){
		query = {q:"",
			include_entities: 1,
			callback: '?'};
		if (term != false) {
			query["q"] += term;
		}
		if (containingSong) {
			if (query["q"] != "") query["q"] += "+";
			query["q"] += "open.spotify.com";
		}
		if (fromUser != null) {
			query["from_user"] = fromUser;
		}
		if (rpp != null) {
			query["rpp"] = rpp;
		}
		$.getJSON('http://search.twitter.com/search.json', query, responseHandler);
	}
}
