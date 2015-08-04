// TODO 9. Redirect user to appropriate page instead of home

Template.bgAccountsSignIn.helpers({
  showSocials: function() {
    return SignInState.get() !== 'RESET';
  },
  signInFormStyle: function() {
    return SignInState.get() === 'RESET' ?
      'col-sm-8 col-sm-offset-2 ' : 'col-sm-7';
  },
});
