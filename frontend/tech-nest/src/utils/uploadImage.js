import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (ImageFile) => {
    const formData = new FormData();
    // Append the image file to the form data
    formData.append("image", ImageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;// Rethrow the error to handle it in the calling function
    }
};

export default uploadImage;
