// TODO 4. Handle clicks to email verification links.
// TODO 5. Notify user if email is not verified. Add resend verification email.
// TODO 7. Add profile management page: name/nickname/emails/password

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
