import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./features/ProjectData/ProjectSlice";

const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

export default store;
