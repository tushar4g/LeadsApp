import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  avatar: 'https://i.pravatar.cc/150?img=3',
  userID: '12345',
  distance: 311.17,
  tasks: {
    total: 11,
    pending: 0,
    overdue: 0,
    completed: 11,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.name = action.payload;
    },
    updateDistance: (state, action) => {
      state.distance = action.payload;
    },
    updateTasks: (state, action) => {
      state.tasks = { ...state.tasks, ...action.payload };
    },
    updateAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    updatePhone: (state, action) => {
      state.phone = action.payload;
    },
  },
});

export const { setUserName, updateDistance, updateTasks, updateAvatar, updateEmail, updatePhone} = userSlice.actions;
export default userSlice.reducer;
