import { FC, useEffect, useState, useRef } from "react";
import classes from "./ChatRoom.module.css";
import { Header } from "./Header/Header";
import { Message } from "./Message/Message";
import { TypeField } from "./TypeField/TypeField";
import io from "socket.io-client";
import instance from "../../instance";
import { useParams } from "react-router-dom";
import { useUserIdStore } from "../../store/userStorge";
import { LinearProgress } from "@mui/material";
import WhatsAppWall from "../../pages/whatsappWall.jpg";
export interface ChatRoomProps {}

const socket = io("http://localhost:8000");

interface IMessage {
  text: string;
  from: string;
  createdAt: string;
  to: string;
  imageUrl?: string;
}

export const ChatRoom: FC<ChatRoomProps> = () => {
  const { receiverId } = useParams();
  const [message, setMessage] = useState("");
  const from = useUserIdStore((state) => state.userProfile._id);
  const [isLoading, setIsLoading] = useState(true);
  const [receiver, setReceiver] = useState<string>("");
  const [messagesArray, setMessagesArray] = useState<IMessage[]>([]);
  const [roomId, setRoomId] = useState("");
  const setLastMessage = useUserIdStore((state) => state.setLastMessage);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roomHandler = async () => {
      setIsLoading(true);
      const res = await instance.get(`/room/roomCheck/${receiverId}`);
      setRoomId(res.data.room._id);
      setMessagesArray(res.data.room.messages);

      const [_id] = res.data.room.users.filter(
        (el: any) => el._id === receiverId
      );

      setReceiver(_id.name);
      socket.emit("join_room", res.data.room._id);
      setIsLoading(false);
    };

    roomHandler();
  }, [receiverId]);

  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      console.log(data);
      setLastMessage({ message: data.text, id: data.from });
      setMessagesArray((prev: any) => [
        ...prev,
        { text: data.text, from: data.from, createdAt: data.createdAt },
      ]);
    });
  }, [socket]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messagesArray]);

  const sendMessageHandler = () => {
    if (message === "") return;

    const date = new Date();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const amOrPm = date.getHours() >= 12 ? "PM" : "AM";
    const formattedTime = `${hours}:${minutes} ${amOrPm}`;

    socket.emit("send_message", {
      text: message,
      roomId,
      from,
      to: receiverId,
      createdAt: formattedTime,
    });

    setLastMessage({ message, id: receiverId });

    setMessagesArray((prev: any) => [
      ...prev,
      { text: message, from, createdAt: formattedTime },
    ]);
    setMessage("");
  };

  return (
    <div className={classes.container}>
      {isLoading ? (
        <div className={classes.loading}>
          <h1>Loading...</h1>
          <LinearProgress color="inherit" />
        </div>
      ) : (
        <>
          <Header key={receiverId} name={receiver} id={receiverId as string} />

          <div className={classes.chatBody} ref={chatBodyRef}>
            {messagesArray?.map((el: IMessage) => (
              <>
                {el.from !== from ? (
                  <Message
                    text={el.text}
                    messageType={false}
                    createdAt={el.createdAt}
                  />
                ) : (
                  <Message
                    text={el.text}
                    messageType={true}
                    createdAt={el.createdAt}
                  />
                )}
              </>
            ))}
          </div>

          <TypeField
            setMessage={setMessage}
            message={message}
            sendMessageHandler={sendMessageHandler}
          />
        </>
      )}
    </div>
  );
};
