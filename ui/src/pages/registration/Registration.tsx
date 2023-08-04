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
  SocialLogin,
  errorNotification,
} from "../../components";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../helpers/cognitoServices";
import { ConfirmCode } from "./components";
import { NotificationType } from "../../constants";

interface IFormInput {
  name: string;
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [modalDetail, setModelDetail] = useState<{
    isOpen: boolean;
    userEmail: string;
  }>({ isOpen: false, userEmail: "" });
  const password = useRef({});
  password.current = watch("password", "");

  const onClick = (path: string) => {
    navigate(path);
  };

  const onSubmit: SubmitHandler<IFormInput> = async ({
    email,
    name,
    password,
  }) => {
    try {
      setIsSubmitting(true);
      const user = await signUp({ name, email, password });
      if (user) {
        setModelDetail({ isOpen: true, userEmail: email });
      } else {
        errorNotification({
          type: NotificationType.ERROR,
          title: "Sign-up Failed",
          description: "An error occurred during sign-up",
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      errorNotification({
        type: NotificationType.ERROR,
        title: "Sign-up Failed",
        description: "An error occurred during sign-up",
      });
    }
  };

  const handleModal = (isOpen: boolean) => {
    setModelDetail({ isOpen, userEmail: "" });
  };
  return (
    <>
      <CRow style={{ marginTop: "1rem" }}>
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
                name="name"
                control={control}
                rules={{
                  required: "Please Enter a Name",
                }}
                render={({ field }) => (
                  <CForm.Item
                    label="Name"
                    validateStatus={errors.name ? "error" : ""}
                    help={errors.name && errors.name.message}
                    required
                  >
                    <CInput {...field} />
                  </CForm.Item>
                )}
              />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Please Enter a  Email",
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
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g,
                    message: "Please Enter a Valid Password",
                  },
                }}
                render={({ field }) => (
                  <CForm.Item
                    label="Password"
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password && errors.password.message}
                    required
                    extra="Minimum length is 8, should contains at least 1 number, 1 special character,  1 uppercase and 1 lowercase letter."
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
            </CForm>
          </CCard>
        </CCol>
      </CRow>
      <ConfirmCode {...modalDetail} handleModal={handleModal} />
    </>
  );
};

export default Registration;
