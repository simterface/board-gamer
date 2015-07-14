
Template.bgAccountsSignIn.helpers({});

Template.bgAccountsSignIn.events({
  "click .bgaccounts-btn-vk": function (event, template) {
    Meteor.loginWithVk && Meteor.loginWithVk(function(err){
      if (err) console.error('Failed to loginWithVk: %',err.reason);

      else goToHomePage();

    });
  },
  "click .bgaccounts-btn-facebook": function(event, template){
    Meteor.loginWithFacebook && Meteor.loginWithFacebook(function(err){
      if (err) console.error('Failed to loginWithFacebook: %',err.reason);

      else goToHomePage();

    });
  },
  "click .bgaccounts-btn-google": function(event, template){
    Meteor.loginWithGoogle && Meteor.loginWithGoogle(function(err){
      if (err) console.error('Failed to loginWithGoogle: %',err.reason);

      else goToHomePage();
    });
  }
});

function goToHomePage() {
  //TODO: place default route to some config
  Router.go('/');
}
