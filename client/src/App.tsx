import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { useUserIdStore } from "./store/userStorge";
import instance from "./instance";
import { LeftNavLayout } from "./components/LeftNavLayout/LeftNavLayout";
import { WelcomeScreen } from "./components/WelcomeScreen/WelcomeScreen";
import { ChatRoom } from "./components/ChatRoom/ChatRoom";
import { SignIn } from "./components/SignIn/SignIn";
import { SignUp } from "./components/SignUp/SignUp";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import classes from "./App.module.css";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLeftNavVisible, setIsLeftNavVisible] = useState(true);
  const user = useUserIdStore((state) => state.userProfile);
  const setUser = useUserIdStore((state) => state.setUser);

  useEffect(() => {
    const fetchUserHandler = async () => {
      try {
        setIsLoading(true);

        const res = await instance.get("/user/getMe");
        const data = res.data.data;
        setUser(data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchUserHandler();
  }, []);

  const toggleLeftNavVisibility = () => {
    setIsLeftNavVisible((prev) => !prev);
  };

  return (
    <div>
      {isLoading ? (
        <div className={classes.loading}>
          <LinearProgress color="inherit" />
        </div>
      ) : (
        <>
          {user._id && (
            <button onClick={toggleLeftNavVisibility}>
              {isLeftNavVisible ? ">>" : "<<"}
            </button>
          )}
          <Routes>
            {!user._id ? (
              <>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
              </>
            ) : null}

            <Route
              element={
                <ProtectedRoute>
                  <LeftNavLayout isVisible={isLeftNavVisible} />
                </ProtectedRoute>
              }
            >
              <Route
                path="/"
                index={true}
                element={
                  <ProtectedRoute>
                    <WelcomeScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/:receiverId"
                element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
