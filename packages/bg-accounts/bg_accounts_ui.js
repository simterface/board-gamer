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
  var container = $('main').find('.container-fluid')[0];
  if (container) {
    Blaze.renderWithData(Template.bgAccountsEmailVerified, { error: error },
      container,
      container.firstElementChild);
  }
}

function displayUnverifiedEmailAlert() {
  var container = $('main').find('.container-fluid')[0];
  if (container) {
    Blaze.render(Template.bgAccountsEmailUnverifiedNotification,
      container,
      container.firstElementChild);
  }
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
