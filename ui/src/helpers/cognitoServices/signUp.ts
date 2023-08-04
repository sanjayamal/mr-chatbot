import { Auth } from "aws-amplify";

type SignUpParameters = {
  name: string;
  password: string;
  email: string;
};

export async function signUp({ name, email, password }: SignUpParameters) {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        name,
      },
      autoSignIn: {
        enabled: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}
