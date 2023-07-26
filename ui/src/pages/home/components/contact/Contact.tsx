import React, { useRef, useState } from "react";

import { useForm, Controller } from "react-hook-form";
// import emailjs from "@emailjs/browser";

import "./Contact.scss";
import { socialMedia } from "./SocialMedia";
import {
  CButton,
  CCard,
  CCol,
  CCollapse,
  CForm,
  CInput,
  CRow,
  CSpace,
  CTypography,
} from "../../../../components";
import Lottie from "lottie-react";
import { CMailOutlined } from "../../../../components/common/icons";

interface IFormInput {
  name: string;
  subject: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const ref = useRef(null);

  const onSubmit = (data: any) => {
    // ref.current &&
    // emailjs
    //   .sendForm(
    //     "service_kfv8r4f",
    //     "template_jpia5wk",
    //     ref.current,
    //     "1ztIM4zFvVTqgBwW0"
    //   )
    //   .then(
    //     (result: any) => {
    //       reset();
    //     },
    //     (error: any) => {}
    //   );
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      name: "",
      message: "",
      subject: "",
    },
  });

  const handleClose = () => {};

  const FormCard = (
    <CCard bordered={false}>
      <CForm onFinish={handleSubmit(onSubmit)} layout="vertical" ref={ref}>
        <CRow gutter={[8, 8]}>
          <CCol span={12}>
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
          </CCol>
          <CCol span={12}>
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
          </CCol>
        </CRow>

        <Controller
          name="subject"
          control={control}
          rules={{
            required: "Please Enter a Subject",
          }}
          render={({ field }) => (
            <CForm.Item
              label="subject"
              validateStatus={errors.subject ? "error" : ""}
              help={errors.subject && errors.subject.message}
              required
            >
              <CInput {...field} />
            </CForm.Item>
          )}
        />
        <Controller
          name="message"
          control={control}
          rules={{
            required: "Please Enter a Subject",
          }}
          render={({ field }) => (
            <CForm.Item
              label="Message"
              validateStatus={errors.message ? "error" : ""}
              help={errors.message && errors.message.message}
              required
            >
              <CInput.TextArea {...field} rows={4} />
            </CForm.Item>
          )}
        />
        <CRow>
          <CCol span={12}>
            <CButton
              type="primary"
              htmlType="submit"
              className="margin-top-1rem"
              style={{ width: "100%" }}
            >
              Send
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </CCard>
  );

  return (
    <CRow style={{ marginTop: "2rem" }}>
      <CCol
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 12, offset: 2 }}
        md={{ span: 12, offset: 2 }}
      >
        <CCollapse
          items={[
            {
              key: "1",
              label: <span style={{ fontWeight: "bold" }}>Contact Us</span>,
              children: FormCard,
            },
          ]}
        />
      </CCol>
      <CCol
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 6, offset: 2 }}
        md={{ span: 6, offset: 2 }}
      >
        <CSpace.Compact direction="vertical">
          <CButton type="link" style={{ marginLeft: "-1rem", paddingLeft: 0 }}>
            Privacy Policy
          </CButton>
          <CButton type="link" style={{ marginLeft: "-1rem" }}>
            Terms of Service
          </CButton>
        </CSpace.Compact>

        <CTypography.Paragraph>
          <CMailOutlined /> chatbot@support.com
        </CTypography.Paragraph>

        <CSpace>
          {socialMedia.map(
            ({ icon, link }: { icon: any; link: string }, index: number) => (
              <a key={index} href={link}>
                {icon}
              </a>
            )
          )}
        </CSpace>
      </CCol>
    </CRow>
  );
};

export default Contact;
