import { CList } from "../../../../components";
import { CDeleteOutlined } from "../../../../components/common/icons";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { selectBotDataSource } from "../../../../store/chatbot";

const ExistingFiles = () => {
  const dispatch = useAppDispatch();
  const botDataSource = useAppSelector(selectBotDataSource);
  const { existingFiles } = botDataSource;

  const handleDelete = () => {
    console.log("delete");
  };
  return (
    <>
      {existingFiles.length > 0 && (
        <CList
          dataSource={existingFiles}
          renderItem={(item: any) => (
            <CList.Item actions={[<CDeleteOutlined onClick={handleDelete} />]}>
              {item}
            </CList.Item>
          )}
          className="margin-bottom-1rem"
        />
      )}
    </>
  );
};

export default ExistingFiles;
