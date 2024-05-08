// apiFunctions.ts
import axios from 'axios';

const decodeImage = (image_object: any) => {
    const base64_decoded_image = atob(image_object)
      const byteNumbers = new Array(base64_decoded_image.length);
      for (let i = 0; i < base64_decoded_image.length; i++) {
          byteNumbers[i] = base64_decoded_image.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      let decoded_jpeg_image = new Blob([byteArray], { type: 'image/jpeg' });
      return decoded_jpeg_image
};

const updateImageData = async (id: string, updateType: "download" | "purchase") => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/updateImageData?id=${id}&updateType=${updateType}`)
  } catch (err) {
    console.error("Update Image Data Error", err)
  }
}

const generateImage = async (thumbnailText: string, apiHost: string, engineId: string, apiKey: string, token: string, setImageUrl: (url: string) => void) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_APISERVER}/generateImage`, {
      message: thumbnailText,
      token: token
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });

    if (response.data.message == "Not Authorized") {
      return response.data;
    } else if (response.data.message == "Insufficient Credits") {
      return response.data;
    }

    setImageUrl(response.data.imageUrl);
    return response.data;
  } catch (error) {
    console.error("Generate Image Error:", error);
  }
};

const submitIPData = async (thumbnailText: string) => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/metadata`, {
      message: thumbnailText
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
  } catch (error) {
    console.error("metadata error")
  }
}

const submitThumbnailData = async (thumbnailText: string) => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/metadata`, {
      message: `Submission: ${thumbnailText}`
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
  } catch (err) {
    console.error("metadata error: ", err)
  }
}

const submitDownloadData = async (thumbnailText: string) => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/metadata`, {
      message: `Image Downloaded`
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
  } catch (err) {
    console.error("submitDownloadData Error", err)
  }
}

const submitBuyData = async (thumbnailText: string) => {
  try {
    await axios.post(`${import.meta.env.VITE_APISERVER}/metadata`, {
      message: `Image Buy Button Clicked`
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
  } catch (err) {
    console.error("submitBuyData Error: ", err)
  }
}

const downloadImage = async (imageUrl: string, setImageDownloadUrl: (url: string) => void) => {
  try {
    setImageDownloadUrl(`${import.meta.env.VITE_APISERVER}/download/?id=${imageUrl}`)
  } catch (err) {
    console.error("Download Error:", err)
  }
}

export const getImageCount = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APISERVER}/imageCount`);
    return response.data.count;
  } catch (error) {
    console.error('Get Image Count Error:', error);
    return 1000;
  }
};

export const updateIsEmailOk = async (token: string) => {
  try {
    const data = {token: token}
    const response = await axios.post(`${import.meta.env.VITE_APISERVER}/user/emailOK`, data);
    return response.data
  } catch (error) {
    console.error('Update isEmailOk Error', error);
    return 403;
  }
}

export const getCredits = async (token: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APISERVER}/user/get-credits?token=${token}`);
    return response.data
  } catch (error) {
    console.error('getCredits Error', error);
    return 403;
  }
}

export const deductCredits = async (token: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_APISERVER}/user/deduct-credits?token=${token}`);
    return {success: 'true'}
  } catch (error) {
    console.error('deductCredits Error', error);
    return 403;
  }
}

export const createCreditCheckoutSession = async (credits: number, token: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_APISERVER}/create-checkout-session?credits=${credits}&token=${token}`);
    return response
  } catch (error) {
    console.error('Update isEmailOk Error', error);
    return 403;
  }
}


export {
  generateImage,
  submitIPData,
  downloadImage,
  submitThumbnailData,
  submitDownloadData,
  submitBuyData,
  updateImageData
};
