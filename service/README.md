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

### Pipenv info

- To use a different environment (change .env file), You can set the `PIPENV_DOTENV_LOCATION` variable to the .env filename or path you want to use. Following is an example how you set an environment variable on Windows Powershell.

```sh
$env:PIPENV_DOTENV_LOCATION=".env.development"
```

You can then check if you have set it correctly by running.

```sh
$env:PIPENV_DOTENV_LOCATION
```
