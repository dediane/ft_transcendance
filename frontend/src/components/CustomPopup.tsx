import React, { useState, useEffect } from "react";
import styled from "styled-components";

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
`;

type Props = {
  message: string;
};

const CustomPopup: React.FC<Props> = ({ message }) => {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return showPopup ? (
    <PopupContainer>
      <p>{message}</p>
    </PopupContainer>
  ) : null;
};

export default CustomPopup;
