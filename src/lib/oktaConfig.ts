export const oktaConfig={
    //copy client Id from your okta account
    clientId:'0oa8avho11Q6KyNMZ5d7',
    //dev environment url
    issuer:'https://dev-65756343.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    //Proof Key for Code Exchange
    pkce:true,
    disableHttpsCheck: true,
}