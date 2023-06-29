import { UploadFile, UploadText } from "./components";
import { CCol, CRow, CTypography, CTabs } from "../common";

const tabs = [
  {
    key: "1",
    label: `Documents`,
    children: <UploadFile />,
  },
  {
    key: "2",
    label: `Text`,
    children: <UploadText />,
  },
];

const DataSource = () => {
  return (
    <>
      <CTypography.Title level={5} style={{ textAlign: "center" }}>
        Data Sources
      </CTypography.Title>
      <CRow className="margin-bottom-1rem">
        <CCol span={24}>
          <CTabs defaultActiveKey="1" centered items={tabs as any} />
        </CCol>
      </CRow>
    </>
  );
};

export default DataSource;
