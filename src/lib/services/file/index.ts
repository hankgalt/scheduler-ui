import { BASE_URL } from '../../index';

export const uploadFile = async (data: FormData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: data,
    });
    return await res.json();
  } catch (error) {
    console.error('Error uploading files: ', error);
    return { error };
  }
};
