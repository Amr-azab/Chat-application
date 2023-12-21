import { FC, useState } from "react";
import classes from "./TypeField.module.css";
import { TextareaAutosize } from "@mui/material";

export interface TypeFieldProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessageHandler: VoidFunction;
}

export const TypeField: FC<TypeFieldProps> = ({
  setMessage,
  sendMessageHandler,
  message,
}) => {
  const messageHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };

  return (
    <div className={classes.container}>
      <TextareaAutosize
        className={classes.typeArea}
        placeholder="Message"
        maxRows={3}
        value={message}
        onChange={messageHandler}
      />

      <button className={classes.Send} onClick={sendMessageHandler}>
        Send
      </button>
    </div>
  );
};
