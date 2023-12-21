import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./SignIn.module.css";
import { Link } from "react-router-dom";
import { RiChatSmileFill } from "react-icons/ri";
import instance from "../../instance";
import { useUserIdStore } from "../../store/userStorge";
import { LinearProgress } from "@mui/material";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

export interface SignInProps {}

export const SignIn: FC<SignInProps> = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const data = { email: "", password: "" };
  const setUser = useUserIdStore((state) => state.setUser);

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setEmail(e.currentTarget.value);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setPassword(e.currentTarget.value);
  };

  const signInHandler = async () => {
    if (!email || !password) {
      setIsError(true);
      setErrorMsg("Please provide email or password !");
      return;
    }
    try {
      setIsLoading(true);
      data.email = email;
      data.password = password;
      const res = await instance.post("/user/login", data);
      if (res.data.status === "success") {
        setIsLoading(false);
        navigate("/", { replace: true });
      }
      const { user } = res.data.data;

      socket.emit("online", user._id);
      setUser(user);
    } catch (err: any) {
      console.log(err.response.data.message);
      setIsLoading(false);
      setIsError(true);
      setErrorMsg(err.response.data.message);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1> Welcome To Chatify </h1>
        <RiChatSmileFill size={50} />
      </div>
      {isLoading && (
        <div className={classes.loading}>
          <LinearProgress color="inherit" />
        </div>
      )}

      <div className={classes.inputs}>
        <input
          className={classes.email}
          type="email"
          placeholder="email"
          onChange={emailHandler}
        />
        <input
          className={classes.password}
          type="password"
          placeholder="password"
          onChange={passwordHandler}
        />
      </div>

      {isError && <p className={classes.errorMsg}>{errorMsg}</p>}

      <div className={classes.buttons}>
        <button className={classes.Login} onClick={signInHandler}>
          Login
        </button>
      </div>

      <p>
        Don't have account {""}
        <Link to="/sign-up" className={classes.link}>
          Sign up ?
        </Link>
      </p>
    </div>
  );
};
