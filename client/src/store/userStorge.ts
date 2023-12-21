import { create } from "zustand";

interface User {
  name: string;
  userName: string;
  email: string;
  _id: string;
  profilePhoto?: string; // Optional property for profile photo
}

interface UserState {
  userProfile: User;
  onlineUsers: Set<any>;
  updatedUsers: boolean;
  lastMessage: any;

  setOnlineUsers: (id: []) => void;
  setUser: (userProfile: User | {}) => void;
  setLastMessage: (message: any) => void;
  setUpdateUsers: () => void;
}

export const useUserIdStore = create<UserState>((set) => ({
  userProfile: {} as User,
  onlineUsers: new Set(),
  updatedUsers: false,
  lastMessage: {},

  setUser: (userProfile: User | {}) =>
    set({
      userProfile: userProfile as User,
    }),

  setOnlineUsers: (ids: []) => {
    set((state) => {
      ids.map((el) => state.onlineUsers.add(el));

      return {
        onlineUsers: new Set(ids),
      };
    });
  },
  setLastMessage: (message: any) => {
    set({
      lastMessage: message,
    });
  },
  setUpdateUsers: () => {
    set((state) => ({
      updatedUsers: !state.updatedUsers,
    }));
  },
}));
