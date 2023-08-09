import { CButton, CResult } from "../common";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const onClick = (e: any) => {
    navigate("/");
  };
  return (
    <CResult
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <CButton type="primary" onClick={onClick}>
          Back Home
        </CButton>
      }
    />
  );
};

export default ErrorPage;
