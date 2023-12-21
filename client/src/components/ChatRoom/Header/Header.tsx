import { FC } from "react";
import classes from "./Header.module.css";
import { useUserIdStore } from "../../../store/userStorge";

export interface HeaderProps {
  name: string;
  id: any;
}

export const Header: FC<HeaderProps> = ({ name, id }) => {
  const currentOnlineUsers = useUserIdStore((state) => state.onlineUsers);

  const status = currentOnlineUsers.has(id);

  return (
    <div>
      <div className={status ? classes.headerOn : classes.headerOff}>
        <p className={classes.name}>{name}</p>

        {status ? (
          <p className={classes.status}>online</p>
        ) : (
          <p className={classes.status}>offline</p>
        )}
      </div>
    </div>
  );
};
