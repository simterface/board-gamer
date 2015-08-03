SignInPanel = {};

// Shows error msg block at the top of the panel body
SignInPanel.displayAlert = function(msg, hasError) {
  var alertBlock = buildAlertBlock(msg, hasError);
  $('#bgAccountsLoginPanel').find('.panel-body').prepend(alertBlock);
};

SignInPanel.clearAlerts = function() {
  $('#bgAccountsLoginPanel').find('.panel-body > .alert').alert('close');
};

function buildAlertBlock(msg, hasError) {
  var alertClass = hasError ? 'alert-danger' : 'alert-success';
  return $('<div></div>')
  .addClass('alert ' + alertClass + ' fade in text-center')
  .append('<a href="#" class="close" data-dismiss="alert">&times;</a>')
  .append(msg);
}

/*
  States:
  SIGN_IN - dafault state;
  SIGN_UP - creating new account
  FORGOT - forgot password
  RESET - reset password
*/
SignInState = new ReactiveVar('SIGN_IN');

Header = {};
Header.displayAlert = function(msg, hasError, showResendLink) {
  var options = {
    alertMsg: String(msg),
    hasError: !!hasError,
    showResendLink: !!showResendLink,
  };
  var container = $('header')[0];
  if (container) {
    Blaze.renderWithData(Template.bgAccountsAlert,
      options,
      container);
  }
};
