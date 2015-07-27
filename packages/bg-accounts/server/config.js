/*
  configuring accounts and login services
  all services ids and secrets stored in private/services_settings.json
*/

var configs = JSON.parse(Assets.getText("private/services_settings.json"));

//accounts

//vk
ServiceConfiguration.configurations.upsert({service: 'vk'}, {
  $set: configs.vk
});

//facebook
ServiceConfiguration.configurations.upsert({service: 'facebook'}, {
  $set: configs.facebook
});

//google
ServiceConfiguration.configurations.upsert({service: 'google'},{
  $set: configs.google
});
