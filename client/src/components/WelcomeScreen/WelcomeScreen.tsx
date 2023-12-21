import { FC } from "react";
import classes from "./WelcomeScreen.module.css";

// import { RiChatSmileFill } from "react-icons/ri";
import { RiEarthFill } from "react-icons/ri";
export interface WelcomeScreenProps {}

export const WelcomeScreen: FC<WelcomeScreenProps> = (props) => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Welcome To ChatWorld </h1>
        <RiEarthFill size={40} />
      </div>
      <h2>Start Chatting with The World</h2>
    </div>
  );
};
