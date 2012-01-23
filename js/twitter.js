var Twitter = {
	tweets: [],
	hashtag: "",
	requests: 0,
	responses: 0,
	completedHashQuery: false,
	startedFromHashUserQuery: false,
	completedFromHashUserQuery: false,
	satisfiedWithNumberOfTracks:10,
	maxRequestsPerHashtag: 100,
	// initialize twitter search object
	init: function() {
		Twitter.list = $("#list");

		Twitter.start();
		Twitter.doHashRequest("#protothon");

		$('#form').submit(function(e){
			e.preventDefault();
<<<<<<< HEAD
			
			Twitter.autoStart = true;
			Twitter.term = $('#term').val();//.replace('#', '');
			
			if ( Twitter.term.length > 0 )
				Twitter.request();
=======
			hash = $('#term').val();
			if (hash.length > 0) {
				Twitter.doHashRequest(hash);
			}
>>>>>>> origin/master
		});
	},
	// reset object when starting a new search
	start: function() {
		Twitter.tweets = [];
		Twitter.tracks = [];
		Twitter.hashtag = "";
		Twitter.requests = 0;
		Twitter.responses = 0;
		Twitter.completedHashQuery = false;
		Twitter.startedFromHashUserQuery= false;
		Twitter.completedFromHashUserQuery = false;
	},
	// request all tweets with hashtag
	doHashRequest: function(hashtag) {
		if (hashtag != Twitter.hashtag) {
			Twitter.start();
			Twitter.playlist = new m.Playlist();
<<<<<<< HEAD
		
		$.getJSON( 'http://search.twitter.com/search.json', { q: encodeURI(Twitter.term) + '+open.spotify.com/track', include_entities: 1, callback: '?' }, function(response){
			if ( response.results.length ) {
				Twitter.tweets = response.results;
				Twitter.render();
			} else {
				$('#no-results').slideDown(200, function(){
					setTimeout(function(){
						$('#no-results').slideUp(1000);
					}, 5000)
				});
=======
			Twitter.hashtag = hashtag;
			Twitter.request(Twitter.hashtag, null, 50,
					true, Twitter.handleHashResponse);
		}
	},
	// handle all tweets with hashtag
	handleHashResponse: function(response) {
		Twitter.responses++;
		if (response.results.length) {
			Twitter.tweets = Twitter.tweets.concat(response.results);
		}

		if (Twitter.requests == Twitter.responses) {
			Twitter.completedHashQuery = true;
		}

		Twitter.finish();
	},
	// handle first response for query from hashtag users
	handleFromHashUserResponse1: function(response) {
		Twitter.responses++;
		if (response.results.length) {
			for (i = 0; i < response.results.length; i++) {
				Twitter.request(null, response.results[i]['from_user'], 50,
						true, Twitter.handleFromHashUserResponse2);
>>>>>>> origin/master
			}
		}
		else if (Twitter.requests == Twitter.responses) {
			Twitter.completedFromHashUserQuery = true;
			Twitter.finish();
		}
	},
	// handle second response for query from hashtag users
	handleFromHashUserResponse2: function(response) {
		Twitter.responses++;
		if (response.results.length) {
			Twitter.tweets = Twitter.tweets.concat(response.results);
		}

		if (Twitter.requests == Twitter.responses) {
			Twitter.completedFromHashUserQuery = true;
		}

		Twitter.finish();
	},
	// finish search if all conditions met, or continue
	finish: function() {
		if (Twitter.tracks.length < Twitter.satisfiedWithNumberOfTracks &&
		    		Twitter.requests < Twitter.maxRequestsPerHashtag) {
			if (!Twitter.completedHashQuery) {
				return;
			}
			else if (!Twitter.startedFromHashUserQuery) {
				Twitter.startedFromHashUserQuery = true;
				Twitter.request(Twitter.hashtag, null, 20,
						false, Twitter.handleFromHashUserResponse1);
				return;
			}
			else if (!Twitter.completedFromHashUserQuery) {
				return;
			}
		}

		if (Twitter.tweets.length > 0) {
			Twitter.render();
		}

		if (Twitter.tracks.length == 0) {
			$('#no-results').slideDown(200, function(){
				setTimeout(function() {
					$('#no-results').slideUp(1000);
				}, 5000)
			});
		}
	},
	// render when search has finished
	render: function() {
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
	request: function(term, fromUser, rpp, containingSong, responseHandler) {
		query = {q:"",
			include_entities: 1,
			callback: '?'};
		if (term != null) {
			query["q"] += term;
		}
		if (containingSong) {
			if (query["q"] != "") query["q"] += "+";
			query["q"] += "open.spotify.com";
		}
		if (fromUser != null) {
			if (query["q"] != "") query["q"] += "&";
			query["q"] += fromUser;
		}
		if (rpp != null) {
			query["rpp"] = rpp;
		}
		$.getJSON('http://search.twitter.com/search.json', query, responseHandler);
		Twitter.requests++;
	}
}
