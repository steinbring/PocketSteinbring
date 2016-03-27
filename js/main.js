// This app depends of the fact that wp-json is installed on the server
var websiteLocation = 'http://steinbring.net';
var data = {mainDetails:'',pages:{projects:'',resume:'',about:''},selected:'home',posts:'',currentPost:''};

var getMainDetails = function(){
  var request = new XMLHttpRequest();
  request.open('GET', websiteLocation+'/wp-json', false);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      // Set mainDetails to equal the query results
      data.mainDetails = JSON.parse(request.responseText);
      // Now that we have a value from the server, cache the value for later
      localStorage.setItem("mainDetails", JSON.stringify(data.mainDetails));
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
};

var getPages = function(){
  var request = new XMLHttpRequest();
  request.open('GET', websiteLocation+'/wp-json/pages', false);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      // Set pages to equal the query results
      var tempPages = JSON.parse(request.responseText);
      for (var i = tempPages.length - 1; i >= 0; i--) {
        if(tempPages[i].slug == 'projects')
          data.pages.projects = tempPages[i];
        if(tempPages[i].slug == 'resume')
          data.pages.resume = tempPages[i];
        if(tempPages[i].slug == 'about')
          data.pages.about = tempPages[i];
      };
      // Now that we have a value from the server, cache the value for later
      localStorage.setItem("pages", JSON.stringify(data.pages));
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}

var getPosts = function(){
  var request = new XMLHttpRequest();
  request.open('GET', websiteLocation+'/wp-json/posts', false);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      // Set pages to equal the query results
      data.posts = JSON.parse(request.responseText);
    } else {
      // We reached our target server, but it returned an error
    }
    // Now that we have a value from the server, cache the value for later
    localStorage.setItem("posts", JSON.stringify(data.posts));
    // Close the "loading" screen
    $('#loadingDialog').modal('hide');
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}

var getOldValues = function(){
  // Only set the values if there is something there to set
  if(localStorage.getItem("pages") != null)
    data.pages = JSON.parse(localStorage.getItem("pages"));
  if(localStorage.getItem("posts") != null)
    data.posts = JSON.parse(localStorage.getItem("posts"));
  if(localStorage.getItem("mainDetails") != null)
    data.mainDetails = JSON.parse(localStorage.getItem("mainDetails"));
}

// Out of the box, Rivets.js can't do comparisons. This gives you a way.
rivets.formatters.eq = function (value, args) {
  return value === args;
};
// This is needed for the navigation links
var toggle = function(tab){
  data.selected = tab;
  if(tab != 'blog')
    data.currentPost = '';
};
// This is needed for blog navigation
var toggleBlog = function(postSlug){
  for (var i = data.posts.length - 1; i >= 0; i--) {
    if(data.posts[i].slug == postSlug)
      data.currentPost = data.posts[i];
  }
}
// Prepopulate the values with anything previously downloaded
getOldValues();
// Is the user online? If they are, refresh the data.
if (navigator.onLine) {
  // Open the "Loading" screen
  $('#loadingDialog').modal('show');
  getMainDetails();
  getPages();
  getPosts();
}
// If the user is offline, don't bother offering them the twitter link
else{
  document.getElementById('twitterLink').style.display = 'none';
}

var longFormatDate = function(date){
  var monthNames = [
    "January", 
    "February", 
    "March",
    "April", 
    "May", 
    "June", 
    "July",
    "August", 
    "September", 
    "October",
    "November", 
    "December"
  ];

  var date = new Date(date);
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  return monthNames[monthIndex] + ' ' + day+ ', ' + year
}

rivets.formatters.longDate = function(value) {
  return longFormatDate(value);
};

// Bind the data to part of the DOM
var el = document.getElementById('data');
rivets.bind(el, {data: data});