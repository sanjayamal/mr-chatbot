import React from "react";
import { CCol, CRow, CTypography } from "../../components";
import "./Documentation.scss";

const docs_1: Array<IDocItem> = [
  {
    title: "Introduction",
    instructions: [
      "Welcome to Mr. Chatbot, the platform that allows you to build your custom chatbot and engage your website visitors seamlessly. This documentation will guide you through the process of creating,configuring, and embedding your chatbot on your website.",
    ],
  },
  {
    title: "Chatbot Creation",
    instructions: [
      `
      Click on the 'Chatbots' in navigation section,you'll be taken to the chatbots dashboard. Click on the "Create Chatbot" button to begin building your custom chatbot.`,
      "Give your chatbot a name, data sources (which are you need to the chatbot learn form it) and description.",
      "Currently we accept PDFs and text data sources. Please make sure the file contains text that can be copied.",
      "It'll take sometime to create chatbot.",
    ],
  },
  {
    title: "Testing Your Chatbot",
    instructions: [
      "In order to test your chatbot, click on name or description area of the chatbot.",
      "Enter test messages as if you were a website visitor to evaluate the chatbot's responses",
      "Please, test your chatbot before deploying it on your website.",
    ],
  },
];

const docs_2: Array<IDocItem> = [
  {
    title: "Chatbot Editing",
    instructions: [
      `To edit the chatbot interface, go to the "Edit"section.`,
      "Here, you can add name, profile picture for chatbot and change user message color, chat bubble color of chatbot.",
    ],
  },
  {
    title: "Chatbot Retraining",
    instructions: [
      `
      If you want to improve your chatbot's performance, you can use the "Retrain" feature.`,
      "The retrain option allows you to feed new data to the chatbot and enhance its natural language understanding.",
    ],
  },
  {
    title: "Embed Chatbot in Website",
    instructions: [
      `Once you've created and configured your chatbot, go to the "Embed" section.`,
      "To add the chatbot into any where on your website, add iframe code of this section within your HTML code.",
      "To add a chat bubble at the bottom right corner of your website, add script tag of this section in your HTML code.",
    ],
  },
  {
    title: "Conclusion",
    instructions: [
      `Congratulations! You've successfully created and embedded your custom chatbot using Mr. Chatbot. Enjoy engaging your website visitors with your intelligent virtual assistant!`,
      <>
        For any further assistance or inquiries, please don't hesitate to
        contact our support team at{" "}
        <a href="mailto:someone@example.com">support@mrbchatbot.com.</a>
      </>,
    ],
  },
];
interface IDocItem {
  title: string;
  instructions: Array<string | React.ReactNode>;
}

const DocItem: React.FC<IDocItem> = ({ title, instructions }) => {
  return (
    <>
      <CCol xs={{ span: 20, offset: 2 }} sm={{ span: 16, offset: 4 }}>
        <CTypography.Title level={4}>{title}</CTypography.Title>
        {instructions.map((instruction: string | React.ReactNode, index) => (
          <CTypography.Paragraph key={index}>
            {instruction}
          </CTypography.Paragraph>
        ))}
      </CCol>
    </>
  );
};

const Documentation = () => {
  return (
    <CRow>
      <CCol
        xs={{ span: 20, offset: 1 }}
        sm={{ span: 16, offset: 4 }}
        className="doc-title"
      >
        <CTypography.Title level={2}>Documentation</CTypography.Title>
      </CCol>
      {docs_1.map((doc: IDocItem, index) => (
        <DocItem {...doc} key={index} />
      ))}

      <CCol xs={{ span: 20, offset: 2 }} sm={{ span: 16, offset: 4 }}>
        <CTypography.Title level={4}>Chatbot Settings</CTypography.Title>
        <CTypography.Paragraph >
          In the settings section, you can configure various aspects of your
          chatbot
        </CTypography.Paragraph>
        <CRow className="doc-setting">
          <CCol offset={1}>
            <CTypography.Title level={5}>Prompt Message</CTypography.Title>
            <CTypography.Paragraph>
              A prompt message refers to the initial input or instruction given
              to the model to generate a response. It is the starting point that
              sets the context for the AI model's understanding and influences
              the nature of the output it generates.
            </CTypography.Paragraph>
            <CTypography.Title level={5}>Model</CTypography.Title>
            <CTypography.Paragraph>
              Chatbot model is a powerful AI brain trained on vast amounts of
              data, constantly learning and improving to provide accurate and
              helpful responses to user queries. Choose suitable modal for your
              chatbot.
            </CTypography.Paragraph>
            <CTypography.Title level={5}>Temperature</CTypography.Title>
            <CTypography.Paragraph>
              Temperature is a parameter that controls the randomness of the
              model's output. When generating text, a lower temperature value
              (e.g., 0.2) makes the chatbot more focused and deterministic,
              resulting in more predictable responses. On the other hand, a
              higher temperature value (e.g., 0.8) introduces more randomness,
              making the chatbot's output more creative and diverse
            </CTypography.Paragraph>
          </CCol>
        </CRow>
      </CCol>

      {docs_2.map((doc: IDocItem, index) => (
        <DocItem {...doc} key={index} />
      ))}
    </CRow>
  );
};

export default Documentation;
