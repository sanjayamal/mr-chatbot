import React, { useState } from "react";
import {
  CButton,
  CForm,
  CInput,
  CModal,
  CTypography,
  errorNotification,
  successNotification,
} from "../../../../components";
import {
  confirmSignUp,
  resendConfirmationCode,
} from "../../../../helpers/cognitoServices";
import { NotificationType } from "../../../../constants";
import { useNavigate } from "react-router-dom";

interface IConfirmCode {
  isOpen: boolean;
  userEmail: string;
  handleModal: (isOpen: boolean) => void;
}
const ConfirmCode: React.FC<IConfirmCode> = ({
  isOpen,
  userEmail,
  handleModal,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  const navigate = useNavigate();

  const handleCancel = () => {
    handleModal(false);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await confirmSignUp({ username: userEmail, code });
      if (result) {
        successNotification({
          type: NotificationType.SUCCESS,
          title: "Sign-up Successful!",
          description: "You are now registered as a new user",
        });
        handleCancel();
        navigate("/login");
      } else {
        errorNotification({
          type: NotificationType.ERROR,
          title: "Something went wrong.",
          description: "Please, Re-enter Confirmation code.",
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      errorNotification({
        type: NotificationType.ERROR,
        title: "Something went wrong.",
        description: "Please, Re-enter Confirmation code.",
      });
      setIsSubmitting(false);
    }
  };

  const resendCode = () => {
    resendConfirmationCode({ username: userEmail });
  };
  const handleCodeInput = (code: string): void => {
    setCode(code);
  };
  return (
    <CModal
      title="Confirm sign up"
      open={isOpen}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <CButton key="back" onClick={() => resendCode()}>
          Resend
        </CButton>,
        <CButton
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={onSubmit}
        >
          Confirm
        </CButton>,
      ]}
    >
      <CTypography.Paragraph style={{ marginBottom: "0" }}>
        Your confirmation code has been sent.
      </CTypography.Paragraph>
      <CTypography.Paragraph>
        Please use it to confirm sign up.
      </CTypography.Paragraph>
      <CForm layout="vertical" onFinish={onSubmit}>
        <CForm.Item name="code">
          <CInput
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleCodeInput(e.target.value)
            }
          />
        </CForm.Item>
      </CForm>
    </CModal>
  );
};

export default ConfirmCode;
