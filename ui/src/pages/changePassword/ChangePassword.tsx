import { useRef, useState } from "react";
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CInput,
  CRow,
  TitleWithBackButton,
  errorNotification,
} from "../../components";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../helpers/cognitoServices";
import { useAuth } from "../../hooks";
import { NotificationType } from "../../constants";

interface IFormInput {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { logout } = auth;

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<IFormInput>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const password = useRef({});
  password.current = watch("newPassword", "");

  const onSubmit: SubmitHandler<IFormInput> = async ({
    oldPassword,
    newPassword,
  }) => {
    try {
      setIsSubmitting(true);
      const result = await changePassword(oldPassword, newPassword);
      setIsSubmitting(false);
      if (result) {
        logout();
        navigate("/login");
      }
    } catch (error) {
      setIsSubmitting(false);
      errorNotification({
        type: NotificationType.ERROR,
        title: "Change Password Failed",
        description: "Please Check your current password",
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
          <TitleWithBackButton title="Change Password" />
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
                name="oldPassword"
                control={control}
                rules={{
                  required: "Please Enter a Old Password",
                }}
                render={({ field }) => (
                  <CForm.Item
                    label="Old Password"
                    validateStatus={errors.oldPassword ? "error" : ""}
                    help={errors.oldPassword && errors.oldPassword.message}
                    required
                  >
                    <CInput.Password {...field} />
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
                    Change Password
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ChangePassword;
