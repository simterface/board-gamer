var signInRoute = {
  name: 'bgAccounts.signIn',
  template: 'bgAccountsSignIn',
};

var emailVerified = {
  name: 'bgAccounts.emailVerified',
  template: 'bgAccountsEmailVerified',
};

Router.route('/sign-in', signInRoute);
Router.route('/email-verified', emailVerified);
