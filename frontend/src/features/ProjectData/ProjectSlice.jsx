import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectname(state, action) {
      state.name = action.payload;
    },
  },
});

export const { setProjectname } = projectSlice.actions;

export default projectSlice.reducer;
