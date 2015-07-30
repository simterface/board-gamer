// TODO 6. Handle reset password transactions
// TODO 9. Redirect user to appropriate page instead of home

Template.bgAccountsSignIn.helpers({});

Template.bgAccountsSignIn.events({
  'click .bgaccounts-btn-vk': function(event, template) {
    loginSocial('vk');
  },
  'click .bgaccounts-btn-facebook': function(event, template) {
    loginSocial('facebook');
  },
  'click .bgaccounts-btn-google': function(event, template) {
    loginSocial('google');
  },
  'click #bgAccountsCreateNewLnk': function(event, template) {
    event.preventDefault();
    var form = template.find('#bgAccountsLoginForm');
    if (!validateFormFields(form)) {
      return;
    }

    var userObject = {
      email: form.elements['email'].value,
      password: form.elements['password'].value,
    };

    Accounts.createUser(userObject, function(err) {
      if (err) {
        displayError(composeErrorMsg(err));
      } else {
        goToHomePage();
      }
    });
  },
  'submit #bgAccountsLoginForm': function(event) {
    event.preventDefault();
    var form = event.target;
    var email = form.elements['email'].value;
    var password = form.elements['password'].value;
    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        displayError(composeErrorMsg(err));
      } else {
        goToHomePage();
      }
    });
  },
});

// Common method to login with social networks
function loginSocial(network) {
  var methodsMap = {
    vk: 'loginWithVk',
    google: 'loginWithGoogle',
    facebook: 'loginWithFacebook',
  };
  if (!methodsMap[network]) {
    console.error('Error! Trying to authenticate with unknown social network');
    return;
  }
  var loginMethod = Meteor[methodsMap[network]];
  if (!loginMethod) {
    displayError('Ошибка авторизации: сервис не настроен.');
    return;
  }
  loginMethod(function(err) {
    if (err) {
      displayError(composeErrorMsg(err));
    } else {
      goToHomePage();
    }
  });
}

// Parse error object and return localized msg
function composeErrorMsg(err) {
  console.log(err);
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

// Shows error msg block at the top of the panel body
function displayError(msg) {
  var errorBlock = buildErrorBlock(msg);
  $('#bgAccountsLoginPanel').find('.panel-body').prepend(errorBlock);
}

function buildErrorBlock(msg) {
  return $('<div></div>')
  .addClass('alert alert-danger fade in text-center')
  .append('<a href="#" class="close" data-dismiss="alert">&times;</a>')
  .append(msg);
}

function goToHomePage() {
  // TODO: place default route to some config
  Router.go('/');
}

function validateFormFields(form) {
  var hasError = false;
  var email = form.elements['email'].value;
  if (email.length < 1) {
    displayError('Введите адрес электронной почты');
    hasError = true;
  }

  var password = form.elements['password'].value;
  if (password.length < 6) {
    displayError('Пароль должен содержать не менее 6 символов');
    hasError = true;
  }
  return !hasError;
}