import { CTypography, CodeBlockSection } from "../../../../components";

interface IEmbedSection {
  botId: string;
}

const EmbedSection: React.FC<IEmbedSection> = ({ botId }) => {
  return (
    <div>
      <CTypography.Paragraph>
        To incorporate the chatbot into any where on your website, add this
        iframe within your HTML code
      </CTypography.Paragraph>
      <CodeBlockSection
        code={`<iframe
        src="${window.location.origin}/bot-iframe/${botId}"
        width="100%"
        style="height: 100%; min-height: 700px"
        frameborder="0"
        ></iframe>`}
        language="html"
        showLineNumbers={false}
      />

      <CTypography.Paragraph>
        To integrate a chat bubble at the lower right corner of your website,
        add this script tag in your HTML code
      </CTypography.Paragraph>
      <CodeBlockSection
        code={`<script>
        window.ChatbotConfig = {
          chatbotId: ${botId},
        }
      </script>
      <script
        src='${process.env.REACT_APP_CHAT_BUBBLE_SCRIPT_URL}'
        defer>
      </script>`}
        language="html"
        showLineNumbers={false}
      />
    </div>
  );
};

export default EmbedSection;
