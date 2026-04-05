export const setToken = (token: string) =>
  localStorage.setItem("accessToken", token);

export const getToken = () =>
  localStorage.getItem("accessToken");

export const removeToken = () =>
  localStorage.removeItem("accessToken");

export const setUserId = (id: string) =>
  localStorage.setItem("userId", id);

export const getUserId = () =>
  localStorage.getItem("userId");

export const removeUserId = () =>
  localStorage.removeItem("userId");