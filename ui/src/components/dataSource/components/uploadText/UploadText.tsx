import { TypeOfDataSource } from "../../../../constants";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  selectBotDataSource,
  setBotDataSource,
} from "../../../../store/chatbot";
import { CTextArea, CTypography } from "../../../common";

const UploadText = () => {
  const dispatch = useAppDispatch();
  const handleOnChange = (text: string) => {
    dispatch(setBotDataSource({ source: text, typeOfData: TypeOfDataSource.TEXT }));
  };

  const botDataSource = useAppSelector(selectBotDataSource);
  const { text } = botDataSource;

  return (
    <>
      <CTypography.Text type="secondary">
        Type or paste the information you want your chatbot to learn from
      </CTypography.Text>
      <CTextArea
        className="margin-top-1rem"
        showCount={{
          formatter: (info: {
            value: string;
            count: number;
            maxLength?: number;
          }) => `${info.count} Characters`,
        }}
        style={{ height: 120 }}
        onChange={(event: any) => handleOnChange(event.target.value)}
        rows={5}
        value={text}
      />
    </>
  );
};

export default UploadText;
