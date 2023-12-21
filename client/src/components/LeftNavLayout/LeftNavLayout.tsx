import { FC } from "react";
import classes from "./LeftNavLayout.module.css";

import { Outlet } from "react-router-dom";
import { LeftNav } from "../LeftNav/LeftNav";

export interface LeftNavLayoutProps {}

export const LeftNavLayout: FC<LeftNavLayoutProps> = (props) => {
  return (
    <div className={classes.leftNavLayout}>
      <LeftNav />
      <Outlet />
    </div>
  );
};
