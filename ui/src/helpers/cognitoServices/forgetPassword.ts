import { Auth } from "aws-amplify";

// Send confirmation code to user's email
export async function forgotPassword(username: string): Promise<boolean> {
  try {
    await Auth.forgotPassword(username);
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
    return data === "SUCCESS";
  } catch (err) {
    return false;
  }
}
