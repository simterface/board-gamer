Template.bgAccountsSocialsSignIn.events({
  'click .bgaccounts-btn-vk': function(event, template) {
    loginSocial('vk');
  },
  'click .bgaccounts-btn-facebook': function(event, template) {
    loginSocial('facebook');
  },
  'click .bgaccounts-btn-google': function(event, template) {
    loginSocial('google');
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
    SignInPanel.displayAlert(composeErrorMsg(err), true /* HasError */);
    return;
  }
  loginMethod(function(err) {
    if (err) {
      SignInPanel.displayAlert(composeErrorMsg(err), true /* HasError */);
    } else {
      bgAccountsRouter.goHome();
    }
  });
}

function composeErrorMsg(error) {
  if (error) {
    return 'Ошибка авторизации: ' + error.reason;
  }
  return 'Ошибка авторизации: сервис не доступен.';
}
