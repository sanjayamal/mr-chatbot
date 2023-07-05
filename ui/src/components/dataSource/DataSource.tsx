import { UploadFile, UploadText } from "./components";
import { CCol, CRow, CTypography, CTabs } from "../common";
import React, { useState } from "react";
import { ExistingFiles } from "./components/existingFiles";

interface IDataSource {
  isEdit: boolean;
}
const DataSource: React.FC<IDataSource> = ({ isEdit }) => {
  const [activeTab, setActiveTab] = useState<string>("1");
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
  const onChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <>
      <CTypography.Title level={5} style={{ textAlign: "center" }}>
        Data Sources
      </CTypography.Title>
      <CRow className="margin-bottom-1rem">
        <CCol span={24}>
          <CTabs
            centered
            items={tabs as any}
            onChange={onChange}
            activeKey={activeTab}
          />
        </CCol>
        <CCol span={24}>
          {isEdit && activeTab === "1" && <ExistingFiles />}
        </CCol>
      </CRow>
    </>
  );
};

export default DataSource;
