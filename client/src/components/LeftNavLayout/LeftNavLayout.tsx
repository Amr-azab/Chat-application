import React, { FC } from "react";
import classes from "./LeftNavLayout.module.css";
import { Outlet } from "react-router-dom";
import { LeftNav } from "../LeftNav/LeftNav";

export interface LeftNavLayoutProps {
  isVisible: boolean;
}

export const LeftNavLayout: FC<LeftNavLayoutProps> = ({ isVisible }) => {
  return (
    <div className={classes.leftNavLayout}>
      {isVisible && <LeftNav />}
      <Outlet />
    </div>
  );
};
