import { RouterProvider } from "react-router-dom";
import { routers } from "./routes";
import { Suspense } from "react";
import { Loader } from "./components";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./contexts";
import "./App.scss";

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <AuthProvider>
          <RouterProvider router={routers} />
        </AuthProvider>
      </Provider>
    </Suspense>
  );
};

export default App;
