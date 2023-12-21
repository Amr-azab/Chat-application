import mongoose, { Schema, SchemaType } from "mongoose";

interface IMessage {
  text: string;
  from: mongoose.Schema.Types.ObjectId;
  to: mongoose.Schema.Types.ObjectId;
  createdAt: string;
}

interface IRoom {
  users: string[];
  messages: IMessage[];
}

const roomSchema = new Schema<IRoom>({
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
  ],
  messages: [
    {
      text: String,
      from: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
      },
      to: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
      },
      createdAt: {
        type: String,
      },
    },
  ],
});

const Room = mongoose.model("room", roomSchema);

export default Room;
