export interface IPublishSettingForm {
  chatbotChannelId: string;
  initialMessage: string;
  profilePictureUrl: string;
  displayName: string;
  userMessageColor: string;
  chatBubbleColor: string;
  handleFormChange?: (field: string, value: string | number) => void;
  handleReset?: (field: string) => void;
}
