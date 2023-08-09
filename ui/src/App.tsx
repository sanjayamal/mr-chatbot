import { Router, RouterProvider, useLocation } from "react-router-dom";
import { routers } from "./routes";
import { Suspense, useEffect } from "react";
import { Loader } from "./components";
import { Provider } from "react-redux";
import { store } from "./store";
import "./App.scss";
import { listenToAutoSignInEvent } from "./helpers/cognitoServices";
import { Amplify } from "aws-amplify";
import awsConfigs from "./aws-exports";
import { useAuth } from "./hooks";

Amplify.configure(awsConfigs);

listenToAutoSignInEvent();
const App = () => {
  const auth = useAuth();
  const { checkAuthState } = auth;

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <RouterProvider router={routers} />
      </Provider>
    </Suspense>
  );
};

export default App;
