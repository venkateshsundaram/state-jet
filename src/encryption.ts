export const encrypt = (data: any) => btoa(JSON.stringify(data));
export const decrypt = (data: any) => JSON.parse(atob(data));

export const saveEncryptedState = (key: string, value: any) => {
  localStorage.setItem(key, encrypt(value));
};

export const loadEncryptedState = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? decrypt(data) : null;
};
