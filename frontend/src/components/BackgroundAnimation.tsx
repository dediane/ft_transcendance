import dynamic from "next/dynamic";
import GradientCanvas from "../components/GradientCanvas";

export const BackgroundAnimation = () => {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, #e7c0ff, #c5edff)',
          zIndex: -1,
        }}
      ></div>
    );
  };
  //#efcdfe
  //#d1c8ff
  // up clair
  //#dad6ff
  //#8d2bd2