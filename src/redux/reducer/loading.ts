import { createAction, createReducer } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const setLoading = createAction("setLoading");
export const setUnLoading = createAction("setUnLoading");

const loadingReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state) => {
      //use lib immerjs của redux-toolkit
      // giúp mutate 1 state an toàn
      state.isLoading = true;
    })
    .addCase(setUnLoading, (state) => {
      state.isLoading = false;
    });
});

export default loadingReducer;
