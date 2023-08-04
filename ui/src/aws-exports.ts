const awsConfigs = {
  Auth: {
    region: process.env.REACT_APP_AWS_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_AWS_COGNITO_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
    oauth: {
      scope: process.env.REACT_APP_AWS_COGNITO_OAUTH_SCOPES?.split(","),
      redirectSignIn:
        process.env.REACT_APP_AWS_COGNITO_OAUTH_REDIRECT_URI_SIGNIN,
      redirectSignOut:
        process.env.REACT_APP_AWS_COGNITO_OAUTH_REDIRECT_URI_SIGNOUT,
      responseType: "code",
    },
  },
};

export default awsConfigs;
