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

// Utility Function for formatting tweets into html
var formatTweet = function(tweet){
  var user = userInfo[tweet.user];

  var $tweet = $('<li>', {class: 'tweet'});
    var $tweetHeader = $('<div>', {class: 'tweet-header'});
      var $profileLink = $('<a>', {class: 'profile-link', href: '#'});
        var $profilePic = $('<img>', {class: 'profile-pic', src: user.picture, alt: user.fullname});
        var $fullname = $('<span>', {class: 'fullname'}).text(user.fullname);
        var $username = $('<span>', {class: 'username'}).text('@'+user.username);
      $profileLink.append($profilePic);
      $profileLink.append($fullname);
      $profileLink.append($username);
      $profileLink.click(function(){
        filter.type = 'user';
        filter.value = user.username;
        populateStream(streams.users[filter.value]);
      })
      var $time = $('<time>', {class: 'time', datetime: tweet.created_at}).text(moment(tweet.created_at).fromNow());
    $tweetHeader.append($profileLink);
    $tweetHeader.append($time);
    var $tweetText = $('<div>', {class: 'tweet-text'}).text(tweet.message);
  $tweet.append($tweetHeader);
  $tweet.append($tweetText);

  return $tweet;
}

// function to update timestamps on tweets in stream
var updateStreamTime = function(){
  $('.tweet-stream .time').each(function(){
    $(this).text(moment($(this).attr('datetime')).fromNow());
  })
}
// Update timestamps every minute
setInterval(updateStreamTime, 60000);

// Function to populate the stream with an array of tweets
var populateStream = function (tweets, maxTweets){
  maxTweets = maxTweets || tweets.length;
  maxTweets = maxTweets < tweets.length ? maxTweets : tweets.length;
  var $stream = $('.tweet-stream');
  $stream.text('');
  _.chain(tweets).last(maxTweets).reverse().each(function(tweet){
    $stream.append(formatTweet(tweet));
  })
};

// Filter stream based on username or hashtag
var filter = {
  type: undefined,
  value: undefined
};
setInterval(function(){
  if(filter.type === 'user'){
    populateStream(streams.users[filter.value]);
  } else if (filter.type === 'tag'){
    populateStream(_.filter(streams.home,function(tweet){
      return tweet.message.indexOf(filter.value) >= 0;
    }))
  } else {
    populateStream(streams.home);
  }
}, 1000);

$(document).ready(function(){
  populateStream(streams.home);
});