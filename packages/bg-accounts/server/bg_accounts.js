// TODO 11. Restrict access if email not verified

// Basic accounts config
Accounts.config({
  sendVerificationEmail: true,
  loginExpirationInDays: 30,
});

Accounts.urls.resetPassword = function(token) {
  return Meteor.absoluteUrl(bgAccountsRouter.resetPwdPath + '/' + token);
};

Assets.getText('private/email_templates.json', function(err, result) {
  // TODO Switch to using meteorhacks:ssr for rendering emails
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

  user.profile.type = getAccountType(user);
  user.profile.email = getEmailFromUser(user);

  if (!user.profile.name) {
    user.profile.name = getNameFromEmail(user.profile.email);
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
  bgAccountsUpdateProfile: function(changes) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(403, 'Unauthorized user');
    }

    var updates = {};
    if (changes.name) {
      updates['profile.name'] = changes.name;
    }
    if (changes.nickname) {
      updates['profile.nickname'] = changes.nickname;
    }
    var sendVerificationEmail = false;
    if (changes.email) {
      if (user.profile.type === 'password') {
        // Update emails as well
        var emails = [{
          address: changes.email,
          verified: false,
        },];
        updates['emails'] = emails;
        sendVerificationEmail = true;
      }
      updates['profile.email'] = changes.email;
    }

    console.log(updates);
    try {
      var res = Meteor.users.update(user._id, {$set: updates});
      if (sendVerificationEmail) {
        Accounts.sendVerificationEmail(user._id);
      }
      return res > 0;
    } catch (e) {
      /* E11000 - error code caught in console */
      if (e.message.indexOf('E11000') > -1) {
        throw new Meteor.Error(403, 'Такой email уже существует');
      } else {
        throw e;
      }
    }
  },
});

function getEmailFromUser(userObj) {
  var email = '';
  if (userObj.emails) {
    email = userObj.emails[0].address;
  } else {
    for (var service in userObj.services) {
      if (userObj.services.hasOwnProperty(service)) {
        if (userObj.services[service].email &&
          typeof userObj.services[service].email === 'string') {
          email = userObj.services[service].email;
          break;
        }
        continue;
      }
    }
  }
  return email;
}

function getNameFromEmail(email) {
  var NONAME = 'Без имени';
  var i = email.indexOf('@');
  if (i < 0) {
    return NONAME;
  } else {
    return email.slice(0, i);
  }
}

function getAccountType(userObj) {
  var type = 'Не известен';
  if (userObj.services) {
    // Find first service with email
    for (var service in userObj.services) {
      if (userObj.services.hasOwnProperty(service) &&
      KNOWN_SERVICES.indexOf(service) > -1) {
        type = service;
        break;
      }
    }
  }
  return type;
}
