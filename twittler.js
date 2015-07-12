var User = function(name, handle, picture){
  this.name = name;
  this.handle = handle;
  this.picture = picture;
};

var userInfo = {};
userInfo.shawndrost = new User('Shawn Drost', 'shawndrost', 'https://pbs.twimg.com/profile_images/586651979348250624/3n3kd_5P_400x400.jpg');
userInfo.sharksforcheap = new User('Anthony Phillips', 'sharksforcheap', 'https://pbs.twimg.com/profile_images/3737419103/b81bf3e4ba350fec48493784880241c2_400x400.jpeg');
userInfo.mracus = new User('Marcus Phillips', 'mracus', 'https://pbs.twimg.com/profile_images/460312331923107840/m1Fip-Vt_400x400.jpeg');
userInfo.douglascalhoun = new User('Douglas Calhoun', 'douglascalhoun', 'https://pbs.twimg.com/profile_images/1831644430/DSC02750_400x400.JPG');

$(document).ready(function(){
  var $body = $('body');
  $body.html('');

  var index = streams.home.length - 1;
  while(index >= 0){
    var tweet = streams.home[index];
    var $tweet = $('<div></div>');
    $tweet.text('@' + tweet.user + ': ' + tweet.message);
    $tweet.appendTo($body);
    index -= 1;
  }

});