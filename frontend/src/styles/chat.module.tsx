import styled from 'styled-components';

export const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

export const SideBar = styled.div`
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    height: 100%;
    width: 25%;
    overflow-y: scroll;
    
`;

export const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

export const TextBox = styled.textarea`

    width: 100%;
    height: 15%;
    overflow: scroll;
    
    &.show-modal {
      width: 73%;
      margin-right: 27%;
      height: 30%;
    }

`;

export const BodyContainer = styled.div`
    width: 100%;
    height: 75%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column-reverse;
    
    &.show-modal {
      width: 75%;
    }
   
`;

export const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

type RowProps = {
  active: boolean;
  onClick: () => void;
  key: string;
};

export const Row = styled.div<RowProps>`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? 'rgb(199, 143, 204)' : 'initial')};
  &:hover {
    background-color: rgb(199, 143, 204);
  }
`;
export const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export const Pass = styled.div`
  display: flex;
  position: fixed;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  align-items: flex-start;
`;


export const ModalContainer = styled.div`
  height: 100%;
  border-right: 1px solid black;
  overflow-y: scroll;
`;

export const Button3 = styled.button`
  display:flex;
	border-radius: 0.7rem;
	background-image: linear-gradient(to right, #ff4b96, #ff83a8);
	padding-left: 0.5rem;
	padding-right: 0.5rem;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: #fff;
`
export const ModalContainer2 = styled.div`
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  height: 100%;
  width: 21%;
  background-color: white;
  position: absolute;
  right: 0;
  z-index: 1;
  padding: 20px;
  overflow-y: scroll;

`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;

