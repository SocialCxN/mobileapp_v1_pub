// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  authBaseUrl : 'http://localhost:4200/api/',
  stripeKey: 'pk_live_nqdgOtIe4P9WJTwdvuv5bbmP',
  //stripeKey: 'pk_test_Zh9VC4susrPbQEhMvE52LKs7', // Sandbox
  // apiBaseUrl : 'http://165.227.214.86:3003/api/v1.1.0/',
  apiBaseUrl: 'http://45.55.32.190:3000/api/v1.1.0/',

  // apiBaseUrl : 'https://socialcxn.com/api/v1.1.0/',
  device:'mobile',
  stripe:{
   // client_id:'ca_8XpvVY2AForzjJsUhaq80IAnSi5XnEpo', //Sandbox
   client_id:'ca_8Xpvz6zKlUExN3u3tAOrBIB2SovBGhE1',  //Live
    authorizeUri : "https://connect.stripe.com/express/oauth/authorize"

  }
};

