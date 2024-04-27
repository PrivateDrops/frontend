import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const processError = (error: any) => {
  const errorMessage = error.message || 'Unexpected error occurred';
  const responseData = error.response ? error.response.data : errorMessage;

  return responseData;
};

export const sendGetRequest = async (
  endpoint: string,
  accessToken: string = '',
) => {
  try {
    const response = await axios.get(`${BACKEND}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { response: response.data, success: true };
  } catch (error: any) {
    return { response: processError(error), success: false };
  }
};

export const sendPostRequest = async (
  endpoint: string,
  body: any,
  accessToken: string = '',
) => {
  try {
    const response = await axios.post(`${BACKEND}/${endpoint}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { response: response.data, success: true };
  } catch (error: any) {
    return { response: processError(error), success: false };
  }
};

export const sendPostRequestWithFile = async (
  endpoint: string,
  file: File,
  fileFieldName: string,
  additionalData: any,
  accessToken: string,
) => {
  try {
    const formData = new FormData();
    formData.append(fileFieldName, file);
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    const response = await axios.post(`${BACKEND}/${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { response: response.data, success: true };
  } catch (error: any) {
    return { response: processError(error), success: false };
  }
};

export const sendDeleteRequest = async (
  endpoint: string,
  accessToken: string,
) => {
  try {
    const response = await axios.delete(`${BACKEND}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { response: response.data, success: true };
  } catch (error: any) {
    return { response: processError(error), success: false };
  }
};
