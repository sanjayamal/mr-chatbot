import { Auth } from "aws-amplify";

type SignInParameters = {
  username: string;
  password: string;
};

export async function signIn({ username, password }: SignInParameters) {
  try {
    const user = await Auth.signIn(username, password);
    return user;
  } catch (error) {
    throw error;
  }
}
