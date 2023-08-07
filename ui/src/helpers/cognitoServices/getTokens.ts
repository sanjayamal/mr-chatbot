import { Auth } from "aws-amplify";

export async function getAccessToken() {
  try {
    const session = await Auth.currentSession();
    return session.getAccessToken().getJwtToken();
  } catch (error) {
    return null;
  }
}
