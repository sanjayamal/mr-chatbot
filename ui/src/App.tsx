import { RouterProvider } from "react-router-dom";
import { routers } from "./routes";
import { Suspense } from "react";
import { Loader } from "./components";

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={routers} />
    </Suspense>
  );
};

export default App;
