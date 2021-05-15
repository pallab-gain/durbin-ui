import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from "../../app/store";

export interface AppState {
    value: number;
}

const initialState: AppState = {
  value: 0,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    }
  },
});

export const getValue = ({app}: RootState) => app.value
export const { increment, decrement } = appSlice.actions;
export const { reducer } = appSlice;
