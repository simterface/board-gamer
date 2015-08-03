// TODO 7. Add profile management page: name/nickname/emails/password
Template.bgAccountsUI.onRendered(function() {
  if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
      displayVerificationLinkAlert(err);
    });
  } else {
    Tracker.autorun(function() {
      var user = Meteor.user();
      if (user && user.emails && !user.emails[0].verified) {
        displayUnverifiedEmailAlert();
      }
    });
  }
});

function displayVerificationLinkAlert(error) {
  var options = new Object(null);
  if (error) {
    options.alertMsg = 'Истек срок действия ссылки';
    options.hasError = true;
    options.showResendLink = true;
  } else {
    options.alertMsg = 'Ваш Email успешно подтвержден, спасибо!';
    options.hasError = false;
    options.showResendLink = false;
  }
  Header.displayAlert(options.alertMsg,
    options.hasError,
    options.showResendLink);
}

function displayUnverifiedEmailAlert() {
  var msg = 'Ваш адрес электронной почты не подтвержден.' +
    ' Некоторые возможности могут быть недоступны.';
  Header.displayAlert(msg,
    true /* Has error */,
    true /* Show resend link */);
}

Template.bgAccountsUI.helpers({
  emailVerified: function() {
    // Check if email verified only for password service
    var user = Meteor.user();
    return user &&
      user.emails &&
      user.emails[0].verified || !user.emails;
  },
});

Template.bgAccountsUI.events({
  'click .bgAccounts-logout': function(event, template) {
    Meteor.logout(function(err) {
      if (err) {
        console.error('Failed to log out: %s', err.reason);
      }
    });
  },
});
