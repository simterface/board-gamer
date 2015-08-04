Template.bgAccountsProfile.onCreated(function() {
  this.emailChanged = new ReactiveVar(false);
});

Template.bgAccountsProfile.helpers({
  emailChanged: function() {
    return Meteor.user() &&
      Meteor.user().profile &&
      Meteor.user().profile.type === 'password' &&
      Template.instance().emailChanged.get();
  },
});
Template.bgAccountsProfile.events({
  'keyup #profEmail': function(event, template) {
    var email = event.target.value;
    Template.instance().emailChanged.set(email !== this.profile.email);
  },
  'submit #bgAccountsProfileForm': function(event, template) {
    event.preventDefault();
    var form = event.target;
    var profile = this.profile;
    var changes = getChanges(profile, form);
    if (isEmpty(changes)) {
      return;
    }

    if (Template.instance().emailChanged.get() && profile.type === 'password') {
      var confirmEmail = form.elements['confirmEmail'].value;
      if (confirmEmail !== changes.email) {
        displayAlert('Адреса Email не совпадают',
          true /* Has error */);
        return;
      }
    }

    Meteor.call('bgAccountsUpdateProfile', changes, function(err, res) {
      if (err) {
        displayAlert('Ошибка изменения профиля: ' + err.reason,
          true /* Has error */);
      } else {
        displayAlert('Профиль успешно изменен', false /* Has error */);
      }
    });
  },
});

function getChanges(profile, form) {
  var changes = {};
  var fields = ['name', 'nickname', 'email'];
  fields.forEach(function(field) {
    if (form.elements[field] && form.elements[field].value !== profile[field]) {
      changes[field] = form.elements[field].value;
    }
  });
  return changes;
}

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

  // Null and undefined are "empty"
  if (obj == null) { return true; }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) {return false;}
  if (obj.length === 0)  {return true;}

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {return false;}
  }

  return true;
}

function displayAlert(msg, hasError) {
  var alertBlock = SignInPanel.buildAlertBlock(msg, hasError);
  $('#bgAccountsProfileForm').find('hr').after(alertBlock);
}
