Template.bgAccountsChangePassword.events({
  'submit #bgAccountsChangePasswordForm': function(event, template) {
    event.preventDefault();
    var form = event.target;
    var oldPwd = form.elements['oldPwd'].value;
    var newPwd = form.elements['newPwd'].value;
    var confirmPwd = form.elements['confirmPwd'].value;

    if (!validatePasswords(newPwd, confirmPwd)) {
      return;
    }

    Accounts.changePassword(oldPwd, newPwd, function(err) {
      if (err) {
        displayAlert('Ошибка при смене пароля: ' + err.reason,
          true /* Has error */);
      } else {
        // TODO display confirm and clear form
        displayAlert('Пароль успешно изменен', false /* Has error */);
      }
    });
    clearForm(form);
  },
});

function clearForm(form) {
  form.elements['oldPwd'].value = '';
  form.elements['newPwd'].value = '';
  form.elements['confirmPwd'].value = '';
}

function displayAlert(msg, hasError) {
  var alertBlock = SignInPanel.buildAlertBlock(msg, hasError);
  $('#bgAccountsChangePasswordForm').find('hr').after(alertBlock);
}

function validatePasswords(newPwd, confirmPwd) {
  if (newPwd.length < 6) {
    displayAlert('Новый пароль должен содержать не менее 6 символов',
      true /* Has error*/);
    return false;
  } else if (newPwd !== confirmPwd) {
    displayAlert('Новый пароль и подтверждение не совпадают',
      true /* Has error*/);
    return false;
  }
  return true;
}
