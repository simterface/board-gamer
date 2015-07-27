// TODO 10. Add user roles

// Basic accounts config
Accounts.config({
  sendVerificationEmail: true,
  loginExpirationInDays: 30,
});

// TODO 1. Add basic email templates configurations


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

// TODO 3. Check if user email is verified

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
      if (userObj.services[service].email && typeof userObj.services[service].email === 'string') {
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
