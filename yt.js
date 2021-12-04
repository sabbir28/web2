// Some variables to remember state.

var playlistId, nextPageToken, prevPageToken;

// Once the api loads call a function to get the uploads playlist id.

function handleAPILoaded() {

  requestUserUploadsPlaylistId();

}

//Retrieve the uploads playlist id.

function requestUserUploadsPlaylistId() {

  // https://developers.google.com/youtube/v3/docs/channels/list

  var request = gapi.client.youtube.channels.list({

    mine: true,

    part: 'contentDetails'

  });

  request.execute(function(response) {

    playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;

    requestVideoPlaylist(playlistId);

  });

}

// Retrieve a playist of videos.

function requestVideoPlaylist(playlistId, pageToken) {

  $('#video-container').html('');

  var requestOptions = {

    playlistId: playlistId,

    part: 'snippet',

    maxResults: 10

  };

  if (pageToken) {

    requestOptions.pageToken = pageToken;

  }

  var request = gapi.client.youtube.playlistItems.list(requestOptions);

  request.execute(function(response) {

    // Only show the page buttons if there's a next or previous page.

    nextPageToken = response.result.nextPageToken;

    var nextVis = nextPageToken ? 'visible' : 'hidden';

    $('#next-button').css('visibility', nextVis);

    prevPageToken = response.result.prevPageToken

    var prevVis = prevPageToken ? 'visible' : 'hidden';

    $('#prev-button').css('visibility', prevVis);

    var playlistItems = response.result.items;

    if (playlistItems) {

      $.each(playlistItems, function(index, item) {

        displayResult(item.snippet);

      });

    } else {

      $('#video-container').html('Sorry you have no uploaded videos');

    }

  });

}

// Create a thumbnail for a video snippet.

function displayResult(videoSnippet) {

  var title = videoSnippet.title;

  var videoId = videoSnippet.resourceId.videoId;

  $('#video-container').append('<p>' + title + ' - ' + videoId + '</p>');

}

// Retrieve the next page of videos.

function nextPage() {

  requestVideoPlaylist(playlistId, nextPageToken);

}

// Retrieve the previous page of videos.

function previousPage() {

  requestVideoPlaylist(playlistId, prevPageToken);

}

HTML Markup for the Page:

<!doctype html>

<html>

  <head>

    <title>My Uploads</title>

    <link rel="stylesheet" type="text/css" href="my_uploads.css">

  </head>

  <body>

    <div id="login-container" class="pre-auth">

      This application requires access to your YouTube account.

      Please <a href="#" id="login-link">authorize</a> to continue.

    </div>

    <div id="video-container"></div>

    <div class="button-container">

      <button id="prev-button" class="paging-button" onclick="previousPage();">Previous Page</button>

      <button id="next-button" class="paging-button" onclick="nextPage();">Next Page</button>

    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>

    <script type="text/javascript" src="auth.js"></script>

    <script type="text/javascript" src="my_uploads.js"></script>

    <script src="https://apis.google.com/js/client.js?onload=googleApiClientReady"></script>

  </body>

</html>

CSS:

.paging-button {

  visibility: hidden;

}
