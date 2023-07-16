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
