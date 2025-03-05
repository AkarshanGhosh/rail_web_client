import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: sessionStorage.getItem("isLoggedIn") === "true", // Check sessionStorage
  role: sessionStorage.getItem("role") || "user", // Retrieve role from sessionStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = "user"; // Reset role on logout
      sessionStorage.removeItem("role"); // Remove role from sessionStorage
    },
    changeRole(state, action) {
      const role = action.payload;
      state.role = role;
      sessionStorage.setItem("role", role); // ✅ Store role in sessionStorage
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
