import { useEffect, useState } from 'react';
import userService from "@/services/user-service";
import _, { remove } from "lodash";
import styles from "../styles/Profile.module.css"

// Function to convert file to base64
const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// The logic part of the Avatar Uploader
const useAvatarLogic = (handleUpload: any) => {
  const [avatar, setAvatar]: any = useState(null);
  const [avatarb64, setAvatarb64]: any = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handles file selection
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file.size > 5000000) {
      setErrorMessage('Image must be smaller than 5MB.');
      return;
    }
    const b64: any = await getBase64(file);
    setAvatarb64(b64);
    setAvatar(file);
    setErrorMessage('');
  };

  // Handles file upload
  const handleSubmit = async () => {
    try {
      if (!avatar) {
        console.error('No avatar selected.');
        return;
      }
      if (avatar.size > 5000000) {
        console.error('Image must be smaller than 5MB.');
        return;
      }
      const response = await userService.avatar(avatarb64);
      if (response) handleUpload(avatarb64);
      setAvatar(null);
      setAvatarb64(null);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  };

  return { avatar, handleFileChange, handleSubmit, errorMessage };
};

// The component part of the Avatar Uploader
export const AvatarUploader = ({ handleUpload }: any) => {
  const { avatar, handleFileChange, handleSubmit, errorMessage } = useAvatarLogic(handleUpload);

  return (
    <div className={styles.subcard2}>
      <h2 className={styles.subtitle}>Choose an image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {avatar && (
        <div>
          <p>Selected Avatar:</p>
          <picture>
          <img src={URL.createObjectURL(avatar)} alt="Selected Avatar" className={styles.selectedImage} />
          </picture>
        </div>
      )}
      <button onClick={handleSubmit} className={styles.button}>Upload</button>
    </div>
  );
};