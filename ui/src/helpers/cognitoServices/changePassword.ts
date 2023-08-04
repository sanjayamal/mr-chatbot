import { Auth } from "aws-amplify";

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const data = await Auth.changePassword(user, oldPassword, newPassword);
    if (data === "SUCCESS") {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
