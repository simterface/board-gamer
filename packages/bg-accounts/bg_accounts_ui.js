// TODO 7. Add profile management page: name/nickname/emails/password

Template.bgAccountsUI.onRendered(function() {
  if (Accounts._verifyEmailToken) {
    // TODO use alert instead of routing
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
      if (err) {
        if (err.message == 'Verify email link expired [403]') {
          console.log('Sorry this verification link has expired.');
        }
      } else {
        console.log('Thank you! Your email address has been confirmed.');
        Router.go('bgAccounts.emailVerified');
      }
    });
  }
  Tracker.autorun(function() {
    var user = Meteor.user();
    if (user && user.emails && !user.emails[0].verified) {
      displayUnverifiedEmailAlert();
    }
  });
});

function displayUnverifiedEmailAlert() {
  console.log('Displaying uverified email alert');
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
