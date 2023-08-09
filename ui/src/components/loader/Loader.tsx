import { ClimbingBoxLoader } from "react-spinners";
import "./Loader.scss";

const Loader = () => {
  return (
    <div className="loader">
      <ClimbingBoxLoader color="#36d7b7" />
    </div>
  );
};

export default Loader;
