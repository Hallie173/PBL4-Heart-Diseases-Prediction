import { createAction, createReducer } from "@reduxjs/toolkit";
import { userState } from "../types/user.type";

let userFromStorage: userState;

try {
  userFromStorage = JSON.parse(localStorage.getItem("user") || "null") || {
    isAuthenticated: false,
    token: "",
    account: {},
  };
} catch (error) {
  userFromStorage = {
    isAuthenticated: false,
    token: "",
    account: {},
  };
}

const initialState: userState = userFromStorage;

export const loginUserRedux = createAction<userState>("user/loginUser");
export const updateUserRedux = createAction<userState>("user/updateUser");
export const logoutUserRedux = createAction<userState>("user/logoutUserRedux");

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginUserRedux, (state, action) => {
      //use lib immerjs của redux-toolkit
      // giúp mutate 1 state an toàn
      const data = action.payload;
      state.isAuthenticated = data.isAuthenticated;
      state.token = data.token;
      state.account = data.account;
    })
    .addCase(updateUserRedux, (state, action) => {
      const updatedAccount = action.payload;
      // Only update the fields that are provided in action.payload
      state.account = { ...state.account, ...updatedAccount };
    })
    .addCase(logoutUserRedux, (state) => {
      return initialState;
    });
});

export default userReducer;
