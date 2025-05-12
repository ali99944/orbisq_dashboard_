import { storageUrl } from "../constants/app_constants"
import axios from "axios";

export const getImageLink = (endpoint: string | null | undefined) => {
    if(!endpoint) return ''
    return `${storageUrl}/${endpoint}`
}

/**
 * Downloads an image from a given URL using Axios and Blob.
 *
 * @param {string} imageUrl The URL of the image to download.
 * @param {string} filename The desired filename for the downloaded file.
 */
export const downloadImage = async (imageUrl: string, filename: string): Promise<void> => {
    if (!imageUrl) {
        console.error("Image URL is empty or invalid.");
        alert("تعذر تحميل الصورة: رابط الصورة غير صالح.");
        return;
    }

    try {
        // 1. Fetch the image data as a Blob using Axios
        const response = await axios.get(imageUrl, {
            responseType: "blob",
            // Add other headers if needed (e.g., authorization)
            // headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
        });

        if (!response.data) {
            throw new Error("فشل تحميل الصورة: لم يتم العثور على بيانات الصورة.");
        }

        const blob = response.data;

        // 2. Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // 3. Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // Set the desired filename

        // 4. Append to the document, click, and remove
        document.body.appendChild(link);
        link.click();

        // 5. Clean up: Remove the link and revoke the Blob URL
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error downloading the image:", error);
        alert(`حدث خطأ أثناء تحميل الصورة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
};

