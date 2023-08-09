import { useState } from "react";
import { CMessage, CUploadProps, CUpload, File, RcFile } from "../../../common";
import { CInboxOutlined } from "../../../common/icons";
import { useAppDispatch } from "../../../../hooks";
import {
  getBotDataSourceDetail,
  setBotDataSource,
  setBotDataSourceProcessingStatus,
} from "../../../../store/chatbot";
import { TypeOfDataSource } from "../../../../constants";

const { Dragger } = CUpload;

const UploadFile = () => {
  const dispatch = useAppDispatch();
  const [fileList, setFileList] = useState<Array<File>>([]);

  const handleFileUpload = (droppedFile: File) => {
    const updatedFileList: Array<any> = [...fileList, droppedFile];
    setFileList(updatedFileList);
    updateFileDetail(updatedFileList);
  };

  const handleFileRemove = (file: File) => {
    const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(updatedFileList);
    updateFileDetail(updatedFileList);
  };

  const updateFileDetail = (files: Array<any>) => {
    dispatch(
      setBotDataSource({ source: files, typeOfData: TypeOfDataSource.FILE })
    );
    dispatch(setBotDataSourceProcessingStatus(true));

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file as RcFile);
    });

    dispatch(getBotDataSourceDetail(formData))
      .unwrap()
      .then(() => {
        dispatch(setBotDataSourceProcessingStatus(false));
      })
      .catch(() => {
        dispatch(setBotDataSourceProcessingStatus(false));
      });
  };

  const props: CUploadProps = {
    name: "file",
    multiple: true,
    maxCount: 5,
    accept: "application/pdf",
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        CMessage.error(`${file.name} is not a PDF file`);
      } else {
        if (fileList.length >= 5) {
          CMessage.error(`Character limit reached
          You may remove a file and upload another`);
        } else {
          handleFileUpload(file);
        }
      }
      return isPDF || CUpload.LIST_IGNORE;
    },
    fileList,
    onRemove: handleFileRemove,
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <CInboxOutlined />
      </p>
      <p className="ant-upload-text">Drag and drop your PDF here</p>
      <p className="ant-upload-hint">
        Attach a PDF file to see how many characters are in it.{" "}
        <span style={{ fontWeight: "bold" }}>
          Make sure the file contains text that can be copied
        </span>
      </p>
    </Dragger>
  );
};

export default UploadFile;
