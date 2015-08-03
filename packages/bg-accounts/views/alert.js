Template.bgAccountsAlert.onCreated(function() {
  this.alertMsg = new ReactiveVar(this.data.alertMsg);
  this.hasError = new ReactiveVar(this.data.hasError);
  this.showResendLink = new ReactiveVar(this.data.showResendLink);
  /*
    Verification email resend statuses:
    NOT_SENT - email not resend
    SENDING - trying to resent email
    SEND_ERROR - error when trying to resend
    SENT - email was sent successfully
  */
  this.resendStatus = new ReactiveVar('NOT_SENT');
});

Template.bgAccountsAlert.helpers({
  alertClass: function() {
    return Template.instance().hasError.get() ?
      'alert-danger' : 'alert-success';
  },
  alertMsg: function() {
    return Template.instance().alertMsg.get();
  },
  showResendLink: function() {
    return Template.instance().showResendLink.get() && Meteor.user();
  },
  resendStateEquals: function(state) {
    return Template.instance().resendStatus.get() === state;
  },
});

Template.bgAccountsAlert.events({
  'click .bgAccountsResendVerificationEmail': function(event, template) {
    event.preventDefault();
    var instance = Template.instance();
    instance.resendStatus.set('SENDING');
    Meteor.call('resendVerificationEmail', function(error, result) {
      if (error) {
        instance.alertMsg.set(error.reason);
        instance.hasError.set(true);

        instance.resendStatus.set('SEND_ERROR');
      } else {
        instance.alertMsg.set('Письмо с подтверждением успешно отправлено');
        instance.hasError.set(false);
        instance.resendStatus.set('SENT');
      }
      instance.showResendLink.set(false);
    });
  },
});
