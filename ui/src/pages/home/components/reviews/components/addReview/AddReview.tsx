import React, { useState } from "react";
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CModal,
  CRate,
  CRow,
} from "../../../../../../components";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "../../../../../../hooks";
import { addReview } from "../../../../../../store/chatbot";
import { IReview } from "../../../../../../interfaces";

type FormInput = Omit<IReview, "rate">;

interface IAddReview {
  isOpen: boolean;
  handleModal: (isOpen: boolean) => void;
}
const AddReview: React.FC<IAddReview> = ({ isOpen, handleModal }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(3);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    defaultValues: {
      name: "",
      content: "",
    },
  });
  const dispatch = useAppDispatch();
  const handleCancel = () => {
    handleModal(false);
    reset();
  };

  const onSubmit: SubmitHandler<FormInput> = ({ name, content }) => {
    const request = {
      name,
      content,
      rate,
    };
    setIsSubmitting(true);
    dispatch(addReview(request))
      .then((response) => {
        setIsSubmitting(false);
        console.log("@@@  then");
        handleCancel();
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <CModal
      title="Add Review"
      open={isOpen}
      onCancel={handleCancel}
      destroyOnClose
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <CForm onFinish={handleSubmit(onSubmit)} layout="vertical">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <CForm.Item label="Name">
              <CInput {...field} />
            </CForm.Item>
          )}
        />
        <Controller
          name="content"
          control={control}
          rules={{
            required: "Please Enter a Content",
          }}
          render={({ field }) => (
            <CForm.Item
              label="Content"
              validateStatus={errors.content ? "error" : ""}
              help={errors.content && errors.content.message}
              required
            >
              <CInput.TextArea {...field} rows={4} />
            </CForm.Item>
          )}
        />
        <CRate
          allowHalf
          value={rate}
          onChange={(value: number) => {
            setRate(value);
          }}
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
              Save
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </CModal>
  );
};

export default AddReview;
