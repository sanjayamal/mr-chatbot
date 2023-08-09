import { Auth } from "aws-amplify";

export async function signOut(): Promise<Boolean> {
  try {
    const result = await Auth.signOut();
    return !result;
  } catch (error) {
    return false;
  }
}
