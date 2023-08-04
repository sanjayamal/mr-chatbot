import { Auth } from "aws-amplify";

// Send confirmation code to user's email
export async function forgotPassword(username: string): Promise<boolean> {
  try {
    const data = await Auth.forgotPassword(username);
    return true;
  } catch (err) {
    return false;
  }
}

// Collect confirmation code and new password
export async function forgotPasswordSubmit(
  username: string,
  code: string,
  newPassword: string
): Promise<boolean> {
  try {
    const data = await Auth.forgotPasswordSubmit(username, code, newPassword);
    if (data === "SUCCESS") {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
