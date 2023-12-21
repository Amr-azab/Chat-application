import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./SignUp.module.css";
import { RiChatSmileFill } from "react-icons/ri";
import instance from "../../instance";
import { useUserIdStore } from "../../store/userStorge";
import { LinearProgress } from "@mui/material";

export interface SignUpProps {}

export const SignUp: FC<SignUpProps> = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setUpdateUsers = useUserIdStore((state) => state.setUpdateUsers);

  let data = {
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const setUser = useUserIdStore((state) => state.setUser);

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setName(e.target.value);
  };
  const userNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setUserName(e.target.value);
  };
  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setEmail(e.target.value);
  };
  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setPassword(e.target.value);
  };
  const confirmPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setConfirmPassword(e.target.value);
    data.confirmPassword = confirmPassword;
  };

  const signupHandler = async () => {
    if (!email || !name || !password || !confirmPassword) {
      setIsError(true);
      console.log("error");
      setUpdateUsers();
      setErrorMsg("Please provide all the fields !");
      return;
    }
    try {
      setIsLoading(true);
      data = {
        name,
        userName,
        email,
        password,
        confirmPassword,
      };
      console.log(data);

      const res = await instance.post("user/signup", data);
      console.log(res.data);
      if (res.data.status === "success") {
        setIsLoading(false);
        navigate("/", { replace: true });
      }
      const { user } = await res.data.data;
      setUpdateUsers();
      setUser(user);
      // setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      setIsError(true);
      setErrorMsg(err.response.data.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1> Chatify </h1>

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
          type="text"
          placeholder="name"
          onChange={nameHandler}
        />
        <input
          className={classes.email}
          type="text"
          placeholder="username"
          onChange={userNameHandler}
        />
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
        <input
          className={classes.password}
          type="password"
          placeholder="confirm password"
          onChange={confirmPasswordHandler}
        />
      </div>
      {isError && <p className={classes.errorMsg}>{errorMsg}</p>}
      <div className={classes.buttons}>
        <button className={classes.signup} onClick={signupHandler}>
          Sign up
        </button>
      </div>
    </div>
  );
};
