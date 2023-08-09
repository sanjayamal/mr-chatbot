import { Hub } from "aws-amplify";

export function listenToAutoSignInEvent() {
  Hub.listen("auth", ({ payload }: any) => {
    const { event } = payload;
    if (event === "autoSignIn") {
      const user = payload.data;
      // assign user
    } else if (event === "autoSignIn_failure") {
      // redirect to sign in page
    }
  });
}
