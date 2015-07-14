Package.describe({
  summary: "Accounting package for board-gamer",
  version: "0.0.1",
  name: "simterface:bg-accounts"
});

Package.onUse(function(api) {
  var client = 'client', server = 'server', both = [client, server];
  //packages
  api.use([
      'accounts-base',
      'accounts-password',
      'mrt:accounts-vk',
      'accounts-facebook',
      'accounts-google',
      'accounts-ui',
      'service-configuration',
      'iron:router'
  ], both);

  api.use([
      'templating'
    ], client);

  //files
  //shared
  api.addFiles([
    'router.js'
  ], both);

  //server only
  api.addFiles([
      'config.js'
    ], server);
  //Assets
  api.addFiles([
    'private/services_settings.json'
  ],server,{isAsset: true});

  //client only
  api.addFiles([
      'bg_accounts_ui.html',
      'bg_accounts_ui.js',
      'views/sign_in.html',
      'views/sign_in.css',
      'views/sign_in.js',
    ], client);
});
