import { useEffect, useState } from "react";
import { CurrentUserDetail } from "../interfaces";
import { currentAuthenticatedUser } from "../helpers/cognitoServices";

export const useCurrentUser = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<CurrentUserDetail>({
    email: "",
    name: "",
    email_verified: false,
  });

  useEffect(() => {
    setIsFetching(true);
    currentAuthenticatedUser()
      .then((result) => {
        setCurrentUser(result);
        setIsFetching(false);
      })
      .catch(() => {
        setCurrentUser({ email: "", name: "", email_verified: false });
        setIsFetching(false);
      });
  }, []);

  return { currentUser, isFetching };
};
