import { ClassNames } from "@emotion/react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/Modal.module.css"
import { Authentication } from "@/pages/login";

export default function Modal({show, onClose, view}){
    const [isBrowser, setisBrowser] = useState(false);

    useEffect(() => {setisBrowser(true);},[]);

    const handleClose = (e) => {
        e.preventDefault();
        onClose();
    }

    const modalContent = show ? (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {view}
                {/* <div>
                    <a href='#' onClick={handleClose}>
                    <button>close</button>
                    </a>
                </div>
                <div className={styles.body}>{children}</div> */}
            </div>
        </div>
    ) : null;

    if (isBrowser){
        return ReactDOM.createPortal(
            modalContent, 
            document.getElementById('modal-root')
        )
    } else {
        return null;
    }
}