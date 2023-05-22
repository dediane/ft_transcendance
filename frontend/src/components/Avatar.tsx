import { useEffect, useState } from 'react';
import userService from "@/services/user-service";
import _, { remove } from "lodash";
import styles from "../styles/Profile.module.css"

const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


const useAvatarLogic = (handleUpload :any) => {
    // State to hold avatar
    const [avatar, setAvatar] = useState(null);
    const [avatarb64, setAvatarb64] : any = useState(null);

  
    // Handles file selection
    const handleFileChange = async (event: any) => {
      
      var file = event.target.files[0];
      const b64 : any = await getBase64(file);
      setAvatarb64(b64)
      setAvatar(file);
    };
  
    // Handles file upload
    const handleSubmit = async () => {
      try {
        if (!avatar) {
          console.error('No avatar selected.');
          return;
        }
        const response = await userService.avatar(avatarb64);
        if(response)
          handleUpload(avatarb64)
        setAvatar(null);
        setAvatarb64(null);
      } catch (error) {
        console.error('Failed to upload avatar:', error);
      }
    };

    // Returns the avatar, file change handler and submit handler
    return { avatar, handleFileChange, handleSubmit };
};


// The component part of the Avatar Uploader
export const AvatarUploader = ({handleUpload}: any) => {
    // Use avatar logic
    const { avatar, handleFileChange, handleSubmit } = useAvatarLogic(handleUpload);
    console.log()

    // Render the component
    return (
      <div className={styles.subcard2}>
        {/* <img src={img == false ? "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80": `${img}` } className={styles.profilepicture}></img> */}
        <h2 className={styles.subtitle}>Choose an image</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput}/>
        {avatar && (
          <div>
            <p>Selected Avatar:</p>
            <img src={URL.createObjectURL(avatar)} alt="Selected Avatar" className={styles.selectedImage} />
          </div>
        )}
        <button onClick={handleSubmit} className={styles.button}>Upload</button>
      </div>
    );
  };
