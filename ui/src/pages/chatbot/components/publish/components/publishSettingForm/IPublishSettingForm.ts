export interface IPublishSettingForm {
  initialMessage: string;
  profilePictureUrl: string;
  displayName: string;
  userMessageColor: string;
  chatBubbleColor: string;
  handleFormChange?: (field: string, value: string | number) => void;
  handleReset?: (field: string) => void;
}
