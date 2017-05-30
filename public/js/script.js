var channelId = 'UCfhr-95kSAejI58boC7j7FA'; //新北市政府都更小百科
var myKey = 'AIzaSyAWvTTP8g5puqKLdeu5JqhUDDVrYGOWX4w';
var vidWidth = 196;
var vidHeight = 110;
var vidResults = 50;

$(document).ready(function (){
	$.get(
		"https://www.googleapis.com/youtube/v3/channels", {
			part: 'contentDetails',
			id: channelId,
			key: myKey},
			function(data) {
				$.each(data.items, function(i, item) {
					console.log(item);
					pid = item.contentDetails.relatedPlaylists.uploads;
					getVids(pid);
				})
			}
	);
	
	function getVids(pid) {
		$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems", {
			part: 'snippet',
			maxResults: vidResults,
			playlistId: pid,
			key: myKey},
			function(data) {
				var output;
				$.each(data.items, function(i, item) {
					console.log(item);
					videoTitle = item.snippet.title;
					videoId = item.snippet.resourceId.videoId;
					
					output = '<li><iframe height="'+vidHeight+'" width="'+vidWidth+'" src=\"//www.youtube.com/embed/'+videoId+'"></iframe></li>';
					//append to results
					$('#results').append(output);
				})
			}
	);
	}
});