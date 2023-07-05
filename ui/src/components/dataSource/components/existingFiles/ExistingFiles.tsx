import React, { useEffect } from "react";
import { CList, CTypography } from "../../../../components";
import { CDeleteOutlined } from "../../../../components/common/icons";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { useParams } from "react-router-dom";
import { selectBotDataSource } from "../../../../store/chatbot";

const ExistingFiles = () => {
  const data: any = [];
  const { botId } = useParams();
  const botDataSource = useAppSelector(selectBotDataSource);
  const { existingFiles } = botDataSource;

  useEffect(() => {
    // TODO call get existing files endpoints
  }, [botId]);

  const handleDelete = () => {
    console.log("delete");
  };
  return (
    <>
      {existingFiles.length > 0 && (
        <CList
          dataSource={data}
          renderItem={(item: any) => (
            <CList.Item actions={[<CDeleteOutlined onClick={handleDelete} />]}>
              {item}
            </CList.Item>
          )}
          className="margin-bottom-1rem"
        />
      ) }
    </>
  );
};

export default ExistingFiles;
