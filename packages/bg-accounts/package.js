Package.describe({
  summary: 'Accounting package for board-gamer',
  version: '0.0.1',
  name: 'simterface:bg-accounts',
});

Package.onUse(function(api) {
  var client = 'client';
  var server = 'server';
  var both = [client, server];
  // Packages
  api.use([
      'accounts-base',
      'accounts-password',
      'mrt:accounts-vk',
      'accounts-facebook',
      'accounts-google',
      'service-configuration',
      'iron:router',
  ], both);

  api.use([
      'templating',
      'reactive-var',
      'yogiben:spinkit',
    ], client);

  api.use([
    'email',
  ], server);

  // Files
  // Shared
  api.addFiles([
    'router.js',
  ], both);

  // Assets
  api.addFiles([
    'private/services_settings.json',
    'private/email_templates.json',
  ], server, {isAsset: true});

  // Server only
  api.addFiles([
      'server/config.js',
      'server/email_tmp.js', // TODO remove tmp file
      'server/bg_accounts.js',
    ], server);

  // Client only
  api.addFiles([
      'client_helpers.js',
      'views/spinner.html',
      'views/alert.html',
      'views/alert.js',
      'views/bg_accounts_ui.html',
      'views/bg_accounts_ui.js',
      'views/socials.html',
      'views/socials.js',
      'views/password_form.html',
      'views/password_form.js',
      'views/sign_in.html',
      'views/sign_in.css',
      'views/sign_in.js',
      'views/profile.html',
    ], client);
});
