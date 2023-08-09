
import { CNotification } from "../common";

type NotificationType = "success" | "info" | "warning" | "error";
interface INotification {
  type: NotificationType;
  title: string;
  description: string;
}


export const successNotification = ({
  title,
  type,
  description,
}: INotification) => {
  CNotification.success({
    message: title,
    description,
    placement: "topRight",
  });
};

export const errorNotification = ({
  title,
  type,
  description,
}: INotification) => {
  CNotification.error({
    message: title,
    description,
    placement: "topRight",
  });
};
