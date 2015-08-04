var signInRoute = {
  name: 'bgAccounts.signIn',
  template: 'bgAccountsSignIn',
  onBeforeAction: function() {
    if (Meteor.user()) {
      this.redirect('/');
    }
    if (SignInState) {
      SignInState.set('SIGN_IN');
    }
    this.next();
  },
};

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

var changePassword = {
  name: 'bgAccounts.changePassword',
  template: 'bgAccountsChangePassword',
  onBeforeAction: function() {
    if (!Meteor.user() ||
      !Meteor.user().profile ||
      Meteor.user().profile.type !== 'password'
  ) {
      this.redirect('/');
    }
    this.next();
  },
};

var profile = {
  name: 'bgAccounts.profile',
  template: 'bgAccountsProfile',
  onBeforeAction: function() {
    if (!Meteor.user()) {
      this.redirect('bgAccounts.signIn');
    }
    this.next();
  },
};

Router.route('/sign-in', signInRoute);
Router.route('accounts/reset-password/:token', resetPassword);
Router.route('accounts/profile', profile);
Router.route('accounts/change-password', changePassword);

bgAccountsRouter = {};
bgAccountsRouter.goHome = function(delay) {
  // TODO: Move default route to config
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
