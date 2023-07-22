import { useRef, useState } from "react";
import {
  CAvatar,
  CButton,
  CCard,
  CCol,
  CDivider,
  CForm,
  CInput,
  CRow,
} from "../../components";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CFaFacebook, CFcGoogle } from "../../components/common/icons";

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Login = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onClick = (path: string) => {
    navigate(path);
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {};
  return (
    <CRow style={{ marginTop: "2rem" }}>
      <CCol
        xs={{ span: 20, offset: 2 }}
        sm={{ span: 16, offset: 4 }}
        md={{ span: 12, offset: 6 }}
        lg={{ span: 8, offset: 8 }}
      >
        <CCard
          title={
            <div
              onClick={() => onClick("/")}
              style={{ cursor: "context-menu" }}
            >
              <CAvatar style={{ marginRight: "15px" }} /> Mr.Chatbot
            </div>
          }
          bordered={false}
        >
          <CForm onFinish={handleSubmit(onSubmit)} layout="vertical">
            <CRow>
              <CCol span={24}>
                <CButton
                  style={{ width: "100%", backgroundColor: "#f5f7f7" }}
                  icon={<CFcGoogle />}
                >
                  Sign in with Google
                </CButton>
              </CCol>
              <CCol span={24}>
                <CButton
                  style={{ width: "100%", backgroundColor: "#f5f7f7" }}
                  className="margin-top-1rem "
                  icon={<CFaFacebook />}
                >
                  Sign in with Facebook
                </CButton>
              </CCol>
            </CRow>
            <CDivider plain>Or</CDivider>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Please Enter a Valid Email",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please Enter a Valid Email",
                },
              }}
              render={({ field }) => (
                <CForm.Item
                  label="Email"
                  validateStatus={errors.email ? "error" : ""}
                  help={errors.email && errors.email.message}
                  required
                >
                  <CInput {...field} />
                </CForm.Item>
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Please Enter a Password",
              }}
              render={({ field }) => (
                <CForm.Item
                  label="Password"
                  validateStatus={errors.password ? "error" : ""}
                  help={errors.password && errors.password.message}
                  required
                >
                  <CInput.Password {...field} />
                </CForm.Item>
              )}
            />
            <CRow>
              <CCol span={24}>
                <CButton
                  type="primary"
                  htmlType="submit"
                  className="margin-top-1rem "
                  style={{ width: "100%" }}
                  loading={isSubmitting}
                >
                  Sign in
                </CButton>
              </CCol>
              <CCol span={24}>
                <CButton type="link" onClick={() => onClick("/sign-up")}>
                  Create an account
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Login;
