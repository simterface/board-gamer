Router.configure({
  layoutTemplate: 'bgLayout',
  notFoundTemplate: 'bgNotFound',
  yieldRegions: {
    bgHeader: {to: 'header'},
    bgFooter: {to: 'footer'},
  },
});


Routes = {};
Routes.home = {
  name: 'bg.home',
  template: 'bgMain',
};

Router.route('/', Routes.home);
