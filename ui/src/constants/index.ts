export const TextCharacterCountLimit: number = 100;

export enum AuthAction {
  LOG_IN = "LOG_IN",
  LOG_OUT = "LOG_OUT",
}

export enum ChatbotStatus {
  PENDING,
  CREATED,
  FAILED,
}

export enum NotificationType {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export enum TypeOfDataSource {
  TEXT = "TEXT",
  FILE = "FILE",
  EXISTING_DATA_SOURCE = "EXISTING_DATA_SOURCE",
  REMOVING_EXISTING_FILE = "REMOVING_EXISTING_FILE",
}

export enum SocialLoginProvider{
  FACEBOOK = "FACEBOOK",
  GOOGLE ="GOOGLE"
}