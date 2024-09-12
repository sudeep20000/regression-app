import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current_project: "",
  projects: [],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrProjectname(state, action) {
      state.current_project = action.payload;
    },
  },
});

export const { setCurrProjectname } = projectSlice.actions;

export default projectSlice.reducer;
