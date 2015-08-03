Template.bgAccountsPasswordForm.helpers({
  headingMsg: function() {
    var msg = {
      SIGN_IN: 'С помощью учетной записи',
      SIGN_UP: 'Создание учетной записи',
      FORGOT:  'Восстановление пароля',
      RESET:   'Сброс пароля учетной записи',
    };
    return msg[SignInState.get()];
  },
  signInStateIs: function(state) {
    return SignInState.get() === state;
  },
  newPassword: {newPassword: true},
});

var submitMethods = {};

submitMethods.SIGN_IN = function(form) {
  var email = form.elements['email'].value;
  var password = form.elements['password'].value;
  Meteor.loginWithPassword(email, password, function(err) {
    if (err) {
      SignInPanel.displayAlert(composeErrorMsg(err),
        true /* Has error*/);
    } else {
      bgAccountsRouter.goHome();
    }
  });
};

submitMethods.SIGN_UP = function(form) {
  if (!validateFormFields(form)) {
    return;
  }

  var userObject = {
    email: form.elements['email'].value,
    password: form.elements['password'].value,
  };

  Accounts.createUser(userObject, function(err) {
    if (err) {
      SignInPanel.displayAlert(composeErrorMsg(err), true /* Has error*/);
    } else {
      var msg = 'Учетная запись создана успешно. ' +
        'Письмо с подтверждением было отправлено ' +
        'на ваш адрес электронной почты.';
      Header.displayAlert(msg);
      bgAccountsRouter.goHome();
    }
  });
};

submitMethods.FORGOT = function(form) {
  var email = form.elements['email'].value;
  if (!validateEmail(email)) {
    return;
  }

  Accounts.forgotPassword({email: email}, function(err) {
    if (err) {
      SignInPanel.displayAlert(err.reason, true /* Has error*/);
    } else {
      var msg = 'Письмо с информацией для сброса пароля было отправлено ' +
      'на ваш адрес электронной почты.';
      Header.displayAlert(msg);
      bgAccountsRouter.goHome();
    }
  });
};

submitMethods.RESET = function(form, data) {
  var token = data.token;
  var newPwd = form.elements['newPassword'].value;
  var confirmPwd = form.elements['confirmPassword'].value;
  if (!validatePassword(newPwd)) {
    return;
  }

  if (newPwd !== confirmPwd) {
    SignInPanel.displayAlert('Пароли не совпадают',
      true /* Has Error*/);
    return;
  }

  Accounts.resetPassword(token, newPwd, function(err) {
    if (err) {
      SignInPanel.displayAlert('Ошибка сброса пароля: ' + err.reason,
        true /* Has error*/);
    } else {
      var msg = 'Пароль успешно обновлен';
      Header.displayAlert(msg);
      bgAccountsRouter.goHome();
    }
  });

};


Template.bgAccountsPasswordForm.events({
  'submit #bgAccountsLoginForm': function(event, template) {
    // TODO add spinner when in progress
    event.preventDefault();
    SignInPanel.clearAlerts();
    var form = event.target;
    if (submitMethods[SignInState.get()]) {
      submitMethods[SignInState.get()](form, this);
    } else {
      SignInPanel.displayAlert('Ошибка авторизации на сайте',
        true /* Has Error*/);
    }
  },
});

/* Email */

/* Password */
Template.bgAccountsPasswordFormPassword.helpers({
  placeholder: function() {
    return SignInState.get() !== 'RESET' ?
      'Пароль' :
      (this.newPassword ? 'Новый пароль' : 'Подтверждение пароля');
  },
  inputName: function() {
    return SignInState.get() !== 'RESET' ?
      'password' :
      (this.newPassword ? 'newPassword' : 'confirmPassword');
  },
});

/* Submit */
Template.bgAccountsPasswordFormSubmit.helpers({
  style: function() {
    return SignInState.get() === 'FORGOT' ||
      SignInState.get() === 'RESET' ?
      'btn-block' : 'col-xs-12 col-sm-5 pull-right';
  },
  text: function() {
    var text = {
      SIGN_IN: 'Вход',
      SIGN_UP: 'Создать',
      FORGOT:  'Отправить ссылку',
      RESET:   'Сбросить пароль',
    };
    return text[SignInState.get()];
  },
});

/* Navigation */
var navs = [
  {
    text: 'Вход с учетной записью',
    nextState: 'SIGN_IN',
  },
  {
    text: 'Создать учетную запись',
    nextState: 'SIGN_UP',
  },
  {
    text: 'Восстановление пароля',
    nextState: 'FORGOT',
  },
];

Template.bgAccountsPasswordFormNav.helpers({
  navLinks: navs,
  showLink: function() {
    return this.nextState !== SignInState.get();
  },
});

Template.bgAccountsPasswordFormNav.events({
  'click .bgaccounts-pwdform .nav-link': function(event, template) {
    event.preventDefault();
    var next = this.nextState || 'SIGN_IN';
    SignInState.set(next);
  },
});

// Parse error object and return localized msg
function composeErrorMsg(err) {
  var msg;
  switch (err.reason.toLowerCase()) {
    case 'user not found': {
      msg = 'Пользователь не найден';
      break;
    }
    case 'incorrect password': {
      msg = 'Неверный пароль';
      break;
    }
    default: {
      msg = 'Ошибка авторизации: ' + err.reason;
    }
  }
  return msg;
}

function validateFormFields(form) {
  var hasError = false;
  var email = form.elements['email'].value;
  var password = form.elements['password'].value;

  hasError = !validatePassword(password) || hasError;
  hasError = !validateEmail(email) || hasError;

  return !hasError;
}

function validateEmail(email) {
  if (email.length < 1) {
    SignInPanel.displayAlert('Введите адрес электронной почты',
      true /* Has error*/);
    return false;
  }
  return true;
}

function validatePassword(password) {
  if (password.length < 6) {
    SignInPanel.displayAlert('Пароль должен содержать не менее 6 символов',
      true /* Has error*/);
    return false;
  }
  return true;
}
