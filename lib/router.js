Router.configure({
  layoutTemplate:"bgLayout",
  notFoundTemplate:"bgNotFound",
  // loadingTemplate:"bgLoading",
  yieldRegions:{
    "bgHeader": {to: "header"},
    "bgFooter": {to: "footer"}
  }
});


Routes = {};
Routes.home = {
  name: 'bg.home',
  template: 'bgMain'
}

Router.route('/', Routes.home);
