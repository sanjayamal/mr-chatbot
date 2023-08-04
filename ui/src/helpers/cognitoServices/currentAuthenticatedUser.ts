import { Auth } from "aws-amplify";
import { CurrentUserDetail } from "../../interfaces";

export async function currentAuthenticatedUser(): Promise<CurrentUserDetail> {
  try {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: true, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });

    const { attributes } = user;
    const { email, name, email_verified } = attributes;

    return { email, name, email_verified };
  } catch (err) {
    return { email: "", name: "", email_verified: false };
  }
}
