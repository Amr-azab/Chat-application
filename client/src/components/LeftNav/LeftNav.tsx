import { FC, useEffect, useState } from "react";
import classes from "./LeftNav.module.css";
import { UserProfile } from "../UsersProfile/UserProfile";
import { Link, useNavigate } from "react-router-dom";
import {
  RiEarthFill,
  RiUserFill,
  RiCameraFill,
  RiSearchLine,
  RiSettings3Line,
  RiDoorOpenLine,
} from "react-icons/ri";
import instance from "../../instance";
import { useUserIdStore } from "../../store/userStorge";
import io from "socket.io-client";
import ModelBox from "../../Box/BoxEdit";

export interface LeftNavProps {}

interface User {
  _id: string;
  userName: string;
  name: string;
  email: string;
  lastMessage: string;
}
const socket = io("http://localhost:8000");

export const LeftNav: FC<LeftNavProps> = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const user = useUserIdStore((state) => state.userProfile);
  const update = useUserIdStore((state) => state.updatedUsers);
  const addOnlineUser = useUserIdStore((state) => state.setOnlineUsers);

  const setUser = useUserIdStore((state) => state.setUser);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const res = await instance.get("/user/getAllUsers");
      setAllUsers(res.data.data);
    };
    fetchAllUsers();
  }, [update]);

  useEffect(() => {
    socket.on("online_users", (data: any) => {
      setOnlineUsers(data);
      addOnlineUser(data);
    });
    socket.on("offline", (data) => {
      setOnlineUsers(data);
      addOnlineUser(data);
    });
    socket.emit("online", user._id);
  }, [socket]);

  const logOutHandler = async () => {
    const res = await instance.post("/user/logout");
    if (res.data.status === "success") {
      socket.emit("logout", user._id);
      setUser({});
      navigate("/sign-in", { replace: true });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.header1}>
          <div className={classes.header2}>
            <h1>Chats </h1>
            <RiEarthFill size={40} />
          </div>
          <div className={classes.icons}>
            <>
              {/* Clickable icon */}
              <button
                onClick={handleOpen}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <RiUserFill size={20} />
              </button>
              <ModelBox open={open} handleClose={handleClose} />
            </>
            <RiCameraFill size={20} />
            <RiSearchLine size={20} />
            <button
              onClick={logOutHandler}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <RiDoorOpenLine size={20} />
            </button>
          </div>
        </div>

        <div className={classes.leftNav}>
          {allUsers.map((user) => (
            <Link
              key={user._id}
              className={classes.link}
              to={`user/${user._id}  `}
            >
              <UserProfile
                id={user._id}
                name={user.name}
                status={onlineUsers.some((el: any) => user._id === el)}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* <div className={classes.logoutDiv}>
        <button className={classes.logoutBtn} onClick={logOutHandler}>
          Log out
        </button>
      </div> */}
    </div>
  );
};
