(function () {

    var getUserName, isUserSignedIn;
    var Message, displayMessage;
    Message = function (arg) {
      this.text = arg.text, this.message_side = arg.message_side;
      this.draw = function (_this) {
        return function () {
          var $message;
          $message = $($('.message_template').clone().html());
          $message.addClass(_this.message_side).find('.text').html(_this.text);
          $('.messages').append($message);
          return setTimeout(function () {
            return $message.addClass('appeared');
          }, 0);
        };
      }(this);
      return this;
    };

    getUserName = function () {
      if (isUserSignedIn()) {
        return firebase.auth().currentUser.displayName;
      }
      return '';
    }

    isUserSignedIn = function () {
      return !!firebase.auth().currentUser;
    }

    displayMessage = function(args) {
      var $messages, message;
      $messages = $('.messages');
      console.log(args.name);
      var message_side = args.name === getUserName() ? 'right' : 'left';
      message = new Message({
        text: args.text,
        message_side: 'right'
      });
      message.draw();
      return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    }

    $(function () {
        var saveMessage, getMessageText;
        // Saves a new message on the Firebase DB.
        saveMessage = function () {
          // Check if the message is empty
          var messageText = getMessageText();
          if (!messageText) {
            return;
          }
          $('.message_input').val('');
          // Push a new message to Firebase (new msg entry)
          return firebase.database().ref('/messages/').push({
            text: messageText
          }).catch(function(error) {
            console.error("Can't write new message to Firebase DB", error);
          });
        }
        getMessageText = function () {
          var $message_input;
          $message_input = $('.message_input');
          return $message_input.val();
        };
        $('.send_message').click(function (e) {
          return saveMessage();
        });
        $('.message_input').keyup(function (e) {
          if (e.which === 13) {
            return saveMessage();
          }
        });
    });

    // Checks that the Firebase SDK has been correctly setup and configured.
    $(function () {
        if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
            window.alert('You have not configured and imported the Firebase SDK. ' +
                'Make sure you go through the codelab setup instructions and make ' +
                'sure you are running the codelab using `firebase serve`');
        }
    });

    // Loads chat messages history and listens for upcoming ones.
    $(function () {
        var callback = function (snap) {
          var data = snap.val();
          var messages = new displayMessage({
              key: snap.key,
              name: data.name,
              text: data.text,
              profilePicUrl: data.profilePicUrl
          });
      }
      firebase.database().ref('/messages/').limitToLast(15).on('child_added', callback);
      firebase.database().ref('/messages/').limitToLast(15).on('child_changed', callback);
    });
}.call(this));
