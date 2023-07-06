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

const Registration = () => {
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
  const password = useRef({});
  password.current = watch("password", "");

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
            <div onClick={() => onClick("/")} style={{ cursor:"context-menu"}}>
              <CAvatar style={{ marginRight: "15px" }} /> Mr.Chatbot
            </div>
          }
          bordered={false}
        >
          <CForm onFinish={handleSubmit(onSubmit)} layout="vertical">
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
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please Enter a Confirm Password",
                validate: (value) =>
                  value === password.current || "Passwords do not match",
              }}
              render={({ field }) => (
                <CForm.Item
                  label="Confirm Password"
                  validateStatus={errors.confirmPassword ? "error" : ""}
                  help={
                    errors.confirmPassword && errors.confirmPassword.message
                  }
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
                  className="margin-top-1rem"
                  style={{ width: "100%" }}
                  loading={isSubmitting}
                >
                  Sign up
                </CButton>
                <CButton type="link" onClick={() => onClick("/login")}>
                  Already have an account? Log in
                </CButton>
              </CCol>
            </CRow>
            <CDivider plain>Or</CDivider>
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
                  icon={<CFaFacebook />}
                  className="margin-top-1rem "
                >
                  Sign in with Facebook
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Registration;
