// TODO 5. Notify user if email is not verified. Add resend verification email.
// TODO 7. Add profile management page: name/nickname/emails/password

Template.bgAccountsUI.onRendered(function() {
  var instance = this;
  if (Accounts._verifyEmailToken) {
    console.log('Trying to verify email with token');
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
});

Template.bgAccountsUI.helpers({});

Template.bgAccountsUI.events({
  'click .bgAccounts-logout': function(event, template) {
    Meteor.logout(function(err) {
      if (err) {
        console.error('Failed to log out: %s', err.reason);
      }
    });
  },
});

// Accounts.onEmailVerificationLink(function(token, done) {
//   Accounts.verifyEmail(token, function(err) {
//     if (err) {
//       console.error(err.reason);
//     } else {
//       console.log('Email verified');
//       done();
//     }
//   });
// });
