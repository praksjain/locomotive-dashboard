import { createSlice } from "@reduxjs/toolkit";

const initialState = { speed: 0 };

const speedSlice = createSlice({
  name: "speed",
  initialState,
  reducers: {
    setSpeed: (state, action) => {
      state.speed = action.payload;
    },
  },
});

export const { setSpeed } = speedSlice.actions;
export default speedSlice.reducer;
