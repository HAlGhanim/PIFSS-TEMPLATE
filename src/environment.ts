export const environment = {
  production: false,
  baseurl: '', // this can be your backend localhost or a deployed backend up to you
  msal: {
    // 4200 is the default localhost for angular
    redirectUri: 'http://localhost:4200',
    entraId: {
      // You should get the clientId from the infrastructure team specifically Nidheesh Nattiala
      clientId: 'ADD-YOUR-OWN',
      // tenantId is fixed. DO NOT CHANGE THIS
      tenantId: '31819927-6989-4bd0-b5e5-81740d4154c3',
      // Also Contact Nidheesh Nattiala from infrastructure team to set up a scope ad call it User.Read
      apiScopes: ['api://CHANGE-THIS-TO-YOUR-CLIENTID/User.Read'],
      authority:
        'https://login.microsoftonline.com/31819927-6989-4bd0-b5e5-81740d4154c3',
    },
  },
};
