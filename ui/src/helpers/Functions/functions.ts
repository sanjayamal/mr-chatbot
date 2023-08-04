export const getAccessTokenFormLocalStorage = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const setAccessTokenToLocalStorage = (accessToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
};

export const setRefreshTokenToLocalStorage = (refreshToken: string): void => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const removeTokenFormLocalStorage = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
