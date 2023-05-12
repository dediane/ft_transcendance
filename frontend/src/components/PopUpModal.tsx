import React from "react";
import Modal from "react-modal";
// import TextBox from "./TextBox";
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;


const PopBox = styled.textarea`
    height: 15%;
    width: 100%;
`;


const Button = styled.button`
  padding: 10px;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  margin-right: 10px;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

// const SaveButton = styled.button`
//   background-color: green;
//   color: white;
//   padding: 8px;
//   border-radius: 4px;
// `;

// const CancelButton = styled.button`
//   background-color: red;
//   color: white;
//   padding: 8px;
//   border-radius: 4px;
// `;


type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: () => void;
  onCancel: () => void;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  modalId: string;
  buttonText: string;
};

const PopupModal: React.FC<Props> = ({
  isOpen,
  onRequestClose,
  onSave,
  onCancel,
  value,
  onChange,
  placeholder,
  modalId,
  buttonText,
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} id={modalId}
    style={{
        content: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30%",
          height: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
          backgroundColor: "white"
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }
      }}>
    {/* <Container> */}
      <PopBox value={value} onChange={onChange} placeholder={placeholder} />
      <ButtonContainer>
       <Button onClick={onSave}>Save</Button>
      <CancelButton onClick={onCancel}>Cancel</CancelButton>
      </ButtonContainer>
      {/* </Container> */}
    </Modal>
  );
};

export default PopupModal;