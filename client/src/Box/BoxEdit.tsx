import React, { FC } from "react";
import Modal from "@mui/material/Modal";
import classes from "./BoxEdit.module.css";
import instance from "../instance";
interface ModelBoxProps {
  open: boolean;
  handleClose: () => void;
}

const ModelBox: FC<ModelBoxProps> = ({ open, handleClose }) => {
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div className={classes.box}>
          <button onClick={handleClose}>Done</button>
        </div>
      </Modal>
    </>
  );
};

export default ModelBox;
