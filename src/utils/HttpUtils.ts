const getCommonHeaders = () => {
  const setHeaders: any = {
    "Content-Type": "application/json",
  };

  return setHeaders;
};

export const httpGet = async (url: string) => {
  const headers = getCommonHeaders();
  const response = await fetch(url, {
    headers,
  });

  return await response.json();
};

export const httpPost = async (url: string, data: any | undefined = {}) => {
  const headers = getCommonHeaders();
  const newData: any = JSON.stringify(data);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: newData,
  });

  return await response.json();
};
