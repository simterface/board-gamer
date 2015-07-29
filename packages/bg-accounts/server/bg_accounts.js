// TODO 10. Add user roles
// TODO 11. Restrict access if email not verified

// Basic accounts config
Accounts.config({
  sendVerificationEmail: true,
  loginExpirationInDays: 30,
});

Assets.getText('private/email_templates.json', function(err, result) {
  // TODO switch to using meteorhacks:ssr for rendering emails
  // http://themeteorchef.com/recipes/roll-your-own-authentication/
  if (err) {
    console.log(err.reason);
  } else {
    var config = JSON.parse(result);
    Accounts.emailTemplates.siteName = config.siteName;
    Accounts.emailTemplates.from = config.from;
    Accounts.emailTemplates.verifyEmail.subject = function() {
      return config.verifyEmail.subject;
    };
    Accounts.emailTemplates.verifyEmail.html = function(user, url) {
      var str = config.verifyEmail.htmlTemplate.join('\n');
      str = replaceAllHelper(str, 'user', user.profile.nickname);
      return replaceAllHelper(str, 'url', url);
    };
    Accounts.emailTemplates.resetPassword.subject = function() {
      return config.resetPassword.subject;
    };
    Accounts.emailTemplates.resetPassword.html = function(user, url) {
      var str = config.resetPassword.htmlTemplate.join('\n');
      str = replaceAllHelper(str, 'user', user.profile.nickname);
      return replaceAllHelper(str, 'url', url);
    };
  }
});

// Replaces {{field}} to val - like in templates
function replaceAllHelper(str, field, val) {
  var re = new RegExp('\{\{' + field + '\}\}', 'g');
  return str.replace(re, val);
}

// Ensure that profile displayName is set
Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
    user.profile = options.profile;
  } else {
    user.profile = {};
  }

  if (!user.profile.name) {
    user.profile.name = extractName(user);
  }
  // Set nickname to profile name by default.
  // Use nickname in games, name in emails.
  user.profile.nickname = user.profile.name;
  return user;
});

Meteor.methods({
  resendVerificationEmail: function() {
    var user = Meteor.user();
    if (!user || !user.emails || !user.emails[0].address) {
      throw new Meteor.Error(401,
        'Повторное сообщение не может быть отправлено.');
    } else {
      Accounts.sendVerificationEmail(user._id);
      return true;
    }
  },
});

function extractName(userObj) {
  var NONAME = 'Без имени';
  if (userObj.emails) {
    return getNameFromEmail(userObj.emails[0].address);
  }

  if (!userObj.services) {
    return NONAME;
  }
  // Find first service with email
  for (var service in userObj.services) {
    if (userObj.services.hasOwnProperty(service)) {
      if (userObj.services[service].email &&
        typeof userObj.services[service].email === 'string') {
        var name = getNameFromEmail(userObj.services[service].email);
        if (name) {
          return name;
        }
      }
      continue;
    }
  }
  return NONAME;
}

function getNameFromEmail(email) {
  return email.slice(0, email.indexOf('@'));
}
