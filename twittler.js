// User Constructor
var User = function(fullname, username, picture){
  this.fullname = fullname;
  this.username = username;
  this.picture = picture;
};

var userInfo = {};
userInfo.shawndrost = new User('Shawn Drost', 'shawndrost', 'https://pbs.twimg.com/profile_images/586651979348250624/3n3kd_5P_400x400.jpg');
userInfo.sharksforcheap = new User('Anthony Phillips', 'sharksforcheap', 'https://pbs.twimg.com/profile_images/3737419103/b81bf3e4ba350fec48493784880241c2_400x400.jpeg');
userInfo.mracus = new User('Marcus Phillips', 'mracus', 'https://pbs.twimg.com/profile_images/460312331923107840/m1Fip-Vt_400x400.jpeg');
userInfo.douglascalhoun = new User('Douglas Calhoun', 'douglascalhoun', 'https://pbs.twimg.com/profile_images/1831644430/DSC02750_400x400.JPG');

var visitor = 'test';
streams.users[visitor]= [];
userInfo[visitor] = new User('John Doe', visitor, 'https://si0.twimg.com/sticky/default_profile_images/default_profile_4_reasonably_small.png');

// Utility Function for formatting tweets into html
var formatTweet = function(tweet){
  var user = userInfo[tweet.user];

  var $tweet = $('<li>', {class: 'tweet group'});
    var $tweetHeader = $('<div>', {class: 'tweet-header'});
      var $profileLink = $('<a>', {class: 'profile-link', href: '#'});
        var $profilePic = $('<img>', {class: 'profile-pic', src: user.picture, alt: user.fullname});
        var $fullname = $('<span>', {class: 'fullname'}).text(user.fullname);
        var $username = $('<span>', {class: 'username'}).text('@'+user.username);
      $profileLink.append($profilePic);
      $profileLink.append($fullname);
      $profileLink.append($username);
      $profileLink.click(function(){
        setFilter('@'+user.username);
      })
      var $time = $('<time>', {class: 'time', datetime: tweet.created_at}).text(moment(tweet.created_at).fromNow());
    $tweetHeader.append($profileLink);
    $tweetHeader.append($time);
    var $tweetText = formatMessage(tweet.message);
  $tweet.append($tweetHeader);
  $tweet.append($tweetText);

  return $tweet;
};

// Utility functions to check if a string is a hashtag or username
var isHashTag = function(word){
  return /^#\w+$/.test(word);
}
var isUsername = function(word){
  return /^@\w+$/.test(word);
}

// Format tweet messages to include links to tags and users
var formatMessage = function(message){
  $tweet = $('<div>', {class: 'tweet-text'});
  _.each(message.split(' '), function(word, index){
    if(index){
      $tweet.append(' ');
    }
    if(isHashTag(word)){
      var $hashLink = $('<a>', {class: 'hashtag', href: '#'}).text(word);
      $hashLink.click(function(){
        setFilter(word);
      });
      if(word === filter.value){
        $tweet.append($('<strong>').append($hashLink));
      } else {
        $tweet.append($hashLink);
      }
    } else {
      if(word === filter.value){
        $tweet.append($('<strong>').append(word));
      } else {
        $tweet.append(word);
      }
    }
  });
  return $tweet;
};

// function to update timestamps on tweets in stream
var updateStreamTime = function(){
  $('.tweet-stream .time').each(function(){
    $(this).text(moment($(this).attr('datetime')).fromNow());
  });
};
// Update timestamps every minute
setInterval(updateStreamTime, 60000);

// Function to populate the stream with an array of tweets
var defaultTweetNum = 20;
var tweetNum = defaultTweetNum;
var populateStream = function (tweets, maxTweets){
  maxTweets = maxTweets || tweets.length;
  maxTweets = maxTweets < tweets.length ? maxTweets : tweets.length;
  var $stream = $('.tweet-stream');
  $stream.text('');
  _.chain(tweets).last(maxTweets).reverse().each(function(tweet){
    $stream.append(formatTweet(tweet));
  });
};

// Filter stream based on username or hashtag
var filter = {
  type: undefined,
  value: undefined
};
var setFilter = function(value){
  if(typeof value === 'undefined'){
    filter.type = undefined;
    filter.value = undefined;
  }else if(isUsername(value)){
    filter.type = 'user';
    filter.value = value.slice(1);
  } else {
    filter.type = 'tag';
    filter.value = value;
  }
  tweetNum = defaultTweetNum;
  populateStream(getCurrentStream(), tweetNum);
}
// Function to get current stream based on filter
var getCurrentStream = function(){
  if(filter.type === 'user'){
    return streams.users[filter.value];
  } else if (filter.type === 'tag'){
    return _.filter(streams.home,function(tweet){
      return tweet.message.indexOf(filter.value) >= 0;
    });
  } else {
    return streams.home;
  }
}
setInterval(function() {
  populateStream(getCurrentStream(), tweetNum);
}, 1000);

$(document).ready(function() {
  populateStream(streams.home);
  $('#my-feed').click(function(){
    setFilter();
  });
  $('#my-tweets').click(function(){
    if(visitor){
      setFilter('@'+visitor);
    }
  })
  $('#tweet').click(function(){
    $('.tweet-composer').slideDown();
    $('.tweet-composer textarea').focus();
  })

  //Let users write and submit tweets
  $('.tweet-composer textarea').on('keyup', function(e){
    var tweetText = $('.tweet-composer textarea').val();
    if(e.which == 13) {
      e.preventDefault();
      $('.tweet-composer textarea').val(tweetText.slice(0, -1)); // Remove trailing carriage return
      $('.tweet-composer button').click();
    } else {
      if(tweetText.length >= 140){
        e.preventDefault();
        $('.tweet-composer textarea').val(tweetText.substr(0,140));
        $('#char-count').text(0);
      } else {
        $('#char-count').text(140 - tweetText.length);
      }
    }
  })
  $('.tweet-composer button').click(function(){
    writeTweet(tweetText = $('.tweet-composer textarea').val());
    $('.tweet-composer textarea').val('');
    $('#char-count').text(140);
  });

  // Show more tweets if user scrolls to the bottom of the page
  $(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
      console.log(getCurrentStream().length);
      if(getCurrentStream().length > tweetNum){
        tweetNum += 5;
      }
   }
  });

  // Allow searching for users or words from search bar
  $('.search input').keypress(function(e) {
    if(e.which == 13) {
      $('.search button').click();
    }
  });
  $('.search button').click(function() {
    var searchTerm = $('.search input').val();
    if(searchTerm.trim() !== ''){
      setFilter(searchTerm);
      $('.search input').val('');
      window.scrollTo(0,0);
    }
  });
});