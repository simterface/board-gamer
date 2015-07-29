/*
  Verification email resend statuses:
  NOT_SENT - email not resend
  SENDING - trying to resent email
  SEND_ERROR - error when trying to resend
  SENT - email was sent successfully
*/
Template.bgAccountsEmailUnverifiedNotification.onCreated(function() {
  this.resendStatus = new ReactiveVar('NOT_SENT');
  this.resendErrorReason =  new ReactiveVar('');
});

Template.bgAccountsEmailUnverifiedNotification.helpers({
  alertClass: function() {
    return Template.instance().resendStatus.get() === 'SENT' ?
      'alert-success' : 'alert-danger';
  },
  resendStateEquals: function(state) {
    return Template.instance().resendStatus.get() === state;
  },
  resendErrorMsg: function() {
    return Template.instance().resendErrorReason.get();
  },
});

Template.bgAccountsEmailUnverifiedNotification.events({
  'click .bgAccountsResendVerificationEmail': function(event, template) {
    event.preventDefault();
    var resendStatus = Template.instance().resendStatus;
    var resendErrorReason = Template.instance().resendErrorReason;
    resendStatus.set('SENDING');
    Meteor.call('resendVerificationEmail', function(error, result) {
      if (error) {
        resendErrorReason.set(error.reason);
        resendStatus.set('SEND_ERROR');
      }
      if (result) {
        resendStatus.set('SENT');
      }
    });
  },
});
