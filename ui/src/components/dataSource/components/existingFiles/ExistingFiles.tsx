import { useParams } from "react-router-dom";
import { CList, CPopconfirm, CTypography } from "../../../../components";
import { CDeleteOutlined } from "../../../../components/common/icons";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  removeDataSource,
  selectBotDataSource,
  setBotDataSourceProcessingStatus,
} from "../../../../store/chatbot";

const ExistingFiles = () => {
  const { botId } = useParams();
  const dispatch = useAppDispatch();
  const botDataSource = useAppSelector(selectBotDataSource);
  const { existingFiles } = botDataSource;

  const handleDelete = (fileName: string) => {
    const requestBody = {
      filesToRemove: [fileName],
    };
    dispatch(setBotDataSourceProcessingStatus(true));
    dispatch(removeDataSource({ requestBody, chatbotId: botId, existingFiles }))
      .then(() => {
        dispatch(setBotDataSourceProcessingStatus(false));
      })
      .catch(() => {
        dispatch(setBotDataSourceProcessingStatus(false));
      });
  };
  return (
    <>
      {existingFiles.length > 0 && (
        <CList
          dataSource={existingFiles}
          renderItem={(fileName: any) => (
            <CList.Item
              actions={[
                <CPopconfirm
                  title="Delete the file"
                  description="Are you sure to delete this file?"
                  onConfirm={() => handleDelete(fileName)}
                  okText="Yes"
                  cancelText="No"
                >
                  <CDeleteOutlined />
                </CPopconfirm>,
              ]}
            >
              <CTypography.Text
                ellipsis={fileName?.length > 25 ? { tooltip: fileName } : false}
              >
                {fileName}
              </CTypography.Text>
            </CList.Item>
          )}
          className="margin-bottom-1rem"
        />
      )}
    </>
  );
};

export default ExistingFiles;
