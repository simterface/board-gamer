
Template.bgAccountsUI.helpers({});

Template.bgAccountsUI.events({
  "click .bgAccounts-logout": function(event, template){
      Meteor.logout(function(err){
         if(err) console.error('Failed to log out: %s',err.reason);
      });
  }
});
