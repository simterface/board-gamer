var signInRoute = {
  name: 'bgAccounts.signIn',
  template: 'bgAccountsSignIn'
};

Meteor.startup(function(){
    Router.route('/sign-in', signInRoute);
});
