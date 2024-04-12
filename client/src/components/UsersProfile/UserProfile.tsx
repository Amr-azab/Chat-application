import { FC, useState, useEffect } from "react";
import classes from "./UserProfile.module.css";
import { useUserIdStore } from "../../store/userStorge";
import instance from "../../instance";

export interface UserProfileProps {
  name: string;
  status: boolean;
  id: string;
}

export const UserProfile: FC<UserProfileProps> = ({ name, status, id }) => {
  const user = useUserIdStore((state) => state.userProfile._id);

  const lastMessage = useUserIdStore((state) => state.lastMessage);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllChats = async () => {
      const res = await instance.get("/room/getChats");
      const data: any = res.data.data;

      const message = data.find(
        (el: any) =>
          (el.from === id && el.to === user) ||
          (el.to === id && el.from === user)
      );

      if (message) {
        setMessage(message.text);
      }
    };
    fetchAllChats();
  }, []);

  useEffect(() => {
    if (lastMessage.id === id) {
      setMessage(lastMessage.message);
    }
  }, [lastMessage]);

  return (
    <div className={status ? classes.userDetailsOn : classes.userDetailsOff}>
      <div className={classes.photo}></div>
      <div className={classes.details}>
        <p className={classes.userName}>{name}</p>

        <p className={classes.userMessage}>
          {message.length > 20 ? message.slice(0, 20) + "..." : message}
        </p>
      </div>
    </div>
  );
};
