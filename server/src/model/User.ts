import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  photo: string | undefined;
  correctPassword: Function;
}
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "user must have name!"],
  },
  userName: {
    type: String,
    unique: true,
    required: [true, "user must have username!"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "user must have email!"],
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  password: {
    type: String,
    required: [true, "user must have password!"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: "passwords are not the same",
    },
  },
  photo: {
    type: String, // Store the URL of the user's photo
    default:
      "https://res.cloudinary.com/df6gs6m1e/image/upload/v1694554226/wallpaperflare.com_wallpaper_3_tjpvzd.jpg",
  },
});

userSchema.pre<IUser>("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next();
});

userSchema.methods.correctPassword = async (
  enteredPass: string,
  storedPass: string
) => {
  return await bcrypt.compare(enteredPass, storedPass);
};

const User = mongoose.model("users", userSchema);
export default User;
