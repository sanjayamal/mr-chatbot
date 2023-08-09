import { useEffect, useState } from "react";
import { CurrentUserDetail } from "../interfaces";
import { currentAuthenticatedUser } from "../helpers/cognitoServices";

export const useCurrentUser = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<CurrentUserDetail | null>(
    null
  );
  useEffect(() => {
    setIsFetching(true);
    currentAuthenticatedUser().then((result) => {
      setCurrentUser(result);
      setIsFetching(false);
    });
  }, []);

  return { currentUser, isFetching };
};
