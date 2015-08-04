/*
  Configuring accounts and login services
  all services ids and secrets stored in private/services_settings.json
*/

var configs = JSON.parse(Assets.getText('private/services_settings.json'));

// Accounts
KNOWN_SERVICES = ['password', 'vk', 'facebook', 'google',];

// VK

// There is an error in mrt:accounts-vk. Email not inserted into user record
ServiceConfiguration.configurations.upsert({service: 'vk'}, {
  $set: configs.vk,
});

// Facebook
ServiceConfiguration.configurations.upsert({service: 'facebook'}, {
  $set: configs.facebook,
});

// Google
ServiceConfiguration.configurations.upsert({service: 'google'},{
  $set: configs.google,
});
