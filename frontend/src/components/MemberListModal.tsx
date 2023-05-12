import React, { useState } from "react";
import styled from "styled-components";

const ModalWrapper = styled.div`
  /* Modal wrapper styles */
  /* ... */
`;

const ModalContent = styled.div`
  /* Modal content styles */
  /* ... */
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  margin-left: 5px;
`;

const MemberListModal = ({ members, handleAdminAdding, handleAdminRemoving }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addingAdmin, setAddingAdmin] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleMemberToggle = (member) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleCheckboxChange = (event) => {
    setAddingAdmin(event.target.checked);
  };

  const handleConfirm = () => {
    if (addingAdmin) {
      selectedMembers.forEach((member) => {
        handleAdminAdding(member);
      });
    } else {
      selectedMembers.forEach((member) => {
        handleAdminRemoving(member);
      });
    }
    setSelectedMembers([]);
    setAddingAdmin(false);
    toggleModal();
  };

  return (
    <>
      {/* Render a button or link to open the modal */}
      <button onClick={toggleModal}>Handle admins</button>

      {/* Render the modal */}
      {modalOpen && (
        <ModalWrapper>
          <ModalContent>
            <ul>
              {members.map((member) => (
                <li key={member}>
                  <CheckboxContainer>
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member)}
                      onChange={() => handleMemberToggle(member)}
                    />
                    <CheckboxLabel>{member}</CheckboxLabel>
                  </CheckboxContainer>
                </li>
              ))}
            </ul>
            <CheckboxContainer>
              <input
                type="checkbox"
                checked={addingAdmin}
                onChange={handleCheckboxChange}
              />
              {/* <CheckboxLabel>
                {addingAdmin ? "Remove Admin" : "Add Admin"}
              </CheckboxLabel> */}
            </CheckboxContainer>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={toggleModal}>Cancel</button>
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  );
};

export default MemberListModal;
