"use client";
import React, {useState} from "react";
import {PaperAirPlaneIcon} from "@heroicons/react/solid";

type Props ={
    chatId: string;
}

function MessageInput({send}: {send : (val: string) => void}) {
    const [prompt, setPrompt] = useState("");
    const [hasTyped, setHasTyped] = useState(false);
  
    const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        send(prompt);
        setPrompt("");
      }
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPrompt(event.target.value);
      setHasTyped(true);
    };
  
    const handleSend = (message: string) => {
        send(message);
        setPrompt("");
      };
    
    return (
      <div className="-bg-gray-700-50 text-gray-400 rounded-lg text-sm flex">
        <input
        className="bg-transparent focus:outline-none flex-1"
          onChange={handleInputChange}
          onKeyUp={handleInputKeyUp}
          placeholder={hasTyped ? "" : "Type your message here..."}
          value={prompt}
        />
            <button onClick={() => handleSend(prompt)}>Send</button>
      <div></div>
      </div>
    );
  }
export default MessageInput;