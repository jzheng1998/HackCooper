(function () {

  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  $(window).scroll(function(e) {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });

  var signIn, signOut, initFirebaseAuth, getProfilePicUrl, getUserName, isUserSignedIn, authStateObserver;

  signIn = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  signOut = function () {
    firebase.auth().signOut();
  }

  initFirebaseAuth = function () {
    firebase.auth().onAuthStateChanged(authStateObserver);
  }

  getProfilePicUrl = function () {
    return firebase.auth().currentUser.photeURL || '../images/profile_placeholder.png';
  }

  getUserName = function () {
    return firebase.auth().currentUser.displayName;
  }

  isUserSignedIn = function () {
    return !!firebase.auth().currentUser;
  }

  var userPicElement = $('#user-pic');
  var userNameElement = $('#user-name');
  var signOutButtonElement = $('#sign-out');
  var signInButtonElement = $('#sign-in');

  authStateObserver = function (user) {
    if (user) { // User is signed in!
      console.log(user);
      // Get the signed-in user's profile pic and name.
      var profilePicUrl = getProfilePicUrl();
      var userName = getUserName();

      // Set the user's profile pic and name.
      userPicElement.css('backgroundImage', 'url(' + profilePicUrl + ')');
      userNameElement.text(userName);

      // Show user's profile and sign-out button.
      userNameElement.removeAttr('hidden');
      userPicElement.removeAttr('hidden');
      signOutButtonElement.removeAttr('hidden');

      // Hide sign-in button.
      signInButtonElement.attr('hidden', 'true');

      // // We save the Firebase Messaging Device token and enable notifications.
      // saveMessagingDeviceToken();
    } else { // User is signed out!
      // Hide user's profile and sign-out button.
      userNameElement.attr('hidden', 'true');
      userPicElement.attr('hidden', 'true');
      signOutButtonElement.attr('hidden', 'true');

      // Show sign-in button.
      signInButtonElement.removeAttr('hidden');
    }
  }

  signInButtonElement.click(function (e) { signIn(); });
  signOutButtonElement.click(function (e) { signOut(); });

  $(initFirebaseAuth);
}.call(this));
