# MrChatbot

## Development

Cognito related shell commands

- To create a cognito user replace the values inside `<>` and run it in powershell.

  ```sh
  aws cognito-idp sign-up --client-id <client-id> --username <email> --password <password> --user-attributes Name=name,Value=<name string> --profile <your aws credential profile>
  ```

- Then to confirm the user

  ```sh
  aws cognito-idp confirm-sign-up --client-id <client-id> --username <email> --confirmation-code <code received to your email> --profile <your aws credential profile>
  ```

- For the purpose of generating a token to test the API, `ALLOW_USER_PASSWORD_AUTH` has been enabled in client `web-dev`.

  ```sh
  aws cognito-idp initiate-auth --client-id <client-id> --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=<email>,PASSWORD=<password>
  ```
