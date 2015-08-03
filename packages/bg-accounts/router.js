// TODO make route available only for unauthorized users
var signInRoute = {
  name: 'bgAccounts.signIn',
  template: 'bgAccountsSignIn',
  onBeforeAction: function() {
    if (SignInState) {
      SignInState.set('SIGN_IN');
    }
    this.next();
  },
};

// TODO make route available only with token
var resetPassword = {
  name: 'bgAccounts.resetPassword',
  template: 'bgAccountsSignIn',
  onBeforeAction: function() {
    if (SignInState) {
      SignInState.set('RESET');
    }
    this.next();
  },
  data: function() {
    return {token: this.params.token};
  },
};

// TODO make route available only for authorized users
var profile = {
  name: 'bgAccounts.profile',
  template: 'bgAccountsProfile',
};

Router.route('/sign-in', signInRoute);
Router.route('accounts/reset-password/:token', resetPassword);
Router.route('accounts/profile', profile);

bgAccountsRouter = {};
bgAccountsRouter.goHome = function(delay) {
  // TODO: place default route to some config
  var route = '/';
  if (delay > 0) {
    Meteor.setTimeout(function() {
      Router.go(route);
    }, delay);
  } else {
    Router.go(route);
  }
};
bgAccountsRouter.resetPwdPath = 'accounts/reset-password';
