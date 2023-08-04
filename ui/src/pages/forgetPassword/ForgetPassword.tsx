import { useContext, useState } from "react";
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CInput,
  CRow,
  CTypography,
  TitleWithBackButton,
  errorNotification,
} from "../../components";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/auth/AuthContext";
import { NotificationType } from "../../constants";
import {
  forgotPassword,
  forgotPasswordSubmit,
} from "../../helpers/cognitoServices";

interface IFormInput {
  email: string;
  newPassword: string;
  code: string;
}

const ForgetPassword = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const { logout } = auth;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      newPassword: "",
      code: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDisplayConfirmation, setIsDisplayConfirmation] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleEmailSend = async () => {
    setIsSubmitting(true);
    const result = await forgotPassword(email);
    if (result) {
      setIsSubmitting(false);
      setIsDisplayConfirmation(result);
    } else {
      errorNotification({
        type: NotificationType.ERROR,
        title: "Something went wrong.",
        description: "Please try after some time.",
      });
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async ({ code, newPassword }) => {
    try {
      setIsSubmitting(true);
      const result = await forgotPasswordSubmit(email, code, newPassword);
      if (result) {
        navigate("/login");
        logout();
      } else {
        errorNotification({
          type: NotificationType.ERROR,
          title: "Something went wrong.",
          description: "Please try after some time.",
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      errorNotification({
        type: NotificationType.ERROR,
        title: "Something went wrong.",
        description: "Please, Re-enter Confirmation code.",
      });
    }
  };
  return (
    <>
      <CRow>
        <CCol
          xs={{ span: 20, offset: 2 }}
          sm={{ span: 16, offset: 4 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 8, offset: 4 }}
        >
          <TitleWithBackButton title="Forget Password" />
        </CCol>
      </CRow>
      <CRow style={{ marginTop: "2rem" }}>
        <CCol
          xs={{ span: 20, offset: 2 }}
          sm={{ span: 16, offset: 4 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 8, offset: 8 }}
        >
          <CCard bordered={false}>
            <CForm onFinish={handleSubmit(onSubmit)} layout="vertical">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CForm.Item label="Email">
                    <CInput
                      {...field}
                      value={email}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setEmail(event.target.value);
                      }}
                    />
                  </CForm.Item>
                )}
              />
              {!isDisplayConfirmation && (
                <CRow>
                  <CCol span={24}>
                    <CButton
                      type="primary"
                      className="margin-top-1rem "
                      style={{ width: "100%" }}
                      loading={isSubmitting}
                      onClick={() => handleEmailSend()}
                    >
                      Send
                    </CButton>
                  </CCol>
                </CRow>
              )}
              {isDisplayConfirmation && (
                <>
                  <CTypography.Paragraph style={{ marginBottom: "0" }}>
                    Your Verification code has been sent.
                  </CTypography.Paragraph>
                  <CTypography.Paragraph>
                    Please use it to reset password.
                  </CTypography.Paragraph>
                  <Controller
                    name="code"
                    control={control}
                    rules={{
                      required: "Please Enter a Code",
                    }}
                    render={({ field }) => (
                      <CForm.Item
                        label="Verification Code"
                        validateStatus={errors.code ? "error" : ""}
                        help={errors.code && errors.code.message}
                        required
                      >
                        <CInput {...field} />
                      </CForm.Item>
                    )}
                  />
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{
                      required: "Please Enter a Password",
                    }}
                    render={({ field }) => (
                      <CForm.Item
                        label="New Password"
                        validateStatus={errors.newPassword ? "error" : ""}
                        help={errors.newPassword && errors.newPassword.message}
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
                        Reset
                      </CButton>
                    </CCol>
                  </CRow>
                </>
              )}
            </CForm>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ForgetPassword;
