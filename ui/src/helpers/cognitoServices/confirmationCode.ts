import { Auth } from "aws-amplify";

type ResendConfCodeParameters = {
  username: string;
};

type ConfirmSignUpParameters = {
  username: string;
  code: string;
};

export async function resendConfirmationCode({
  username,
}: ResendConfCodeParameters) {
  try {
    await Auth.resendSignUp(username);
  } catch (err) {}
}

export async function confirmSignUp({
  username,
  code,
}: ConfirmSignUpParameters): Promise<any> {
  try {
    const result = await Auth.confirmSignUp(username, code, {
      forceAliasCreation: false,
    });
    return result === "SUCCESS";
  } catch (error) {
    throw error;
  }
}
