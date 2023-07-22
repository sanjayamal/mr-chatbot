import { CCol, CTypography } from "../../../../components";
import { IDocItem } from "../IDocItem";

const DocItem: React.FC<IDocItem> = ({ title, instructions }) => {
    return (
        <CCol xs={{ span: 20, offset: 2 }} sm={{ span: 16, offset: 4 }}>
          <CTypography.Title level={4}>{title}</CTypography.Title>
          {instructions.map((instruction: string | React.ReactNode, index) => (
            <CTypography.Paragraph key={index}>
              {instruction}
            </CTypography.Paragraph>
          ))}
        </CCol>
    );
  };

  export default DocItem