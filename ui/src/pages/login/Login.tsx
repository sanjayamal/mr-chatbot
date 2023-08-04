import { useContext, useState } from "react";
import {
  CAvatar,
  CButton,
  CCard,
  CCol,
  CDivider,
  CForm,
  CInput,
  CRow,
  SocialLogin,
  errorNotification,
} from "../../components";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/auth/AuthContext";
import { NotificationType } from "../../constants";

interface IFormInput {
  email: string;
  password: string;
}

const Login = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onClick = (path: string) => {
    navigate(path);
  };

  const onSubmit: SubmitHandler<IFormInput> = async ({ email, password }) => {
    try {
      setIsSubmitting(true);
      const result = await auth.login(email, password);
      if (result?.username) {
        navigate("/");
      } else {
        errorNotification({
          type: NotificationType.ERROR,
          title: "Sign-in Failed",
          description: (result as Error).message,
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      errorNotification({
        type: NotificationType.ERROR,
        title: "Sign-in Failed",
        description: (error as Error).message,
      });
    }
  };
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
            <SocialLogin />
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
              <CCol span={12}>
                <CButton type="link" onClick={() => onClick("/sign-up")}>
                  Create an account
                </CButton>
              </CCol>
              <CCol span={12}>
                <CButton
                  type="link"
                  onClick={() => onClick("/forget-password")}
                >
                  Forget password
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
