import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { throttle } from 'lodash';
import { fetchAllChats } from '../apis/chat';
const initialState = {
  chats: [],
  activeChat: '',
  isLoading: false,
  notifications: [],
};
const throttleFetchAllChats = throttle(fetchAllChats, 1500);
export const fetchChats = createAsyncThunk('redux/chats', async () => {
  try {
    const data = await throttleFetchAllChats();
    return data;
  } catch (error) {
    toast.error('Something Went Wrong!Try Again');
  }
});
const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, { payload }) => {
      state.activeChat = payload;
    },
    setNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
  },
  extraReducers: {
    [fetchChats.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchChats.fulfilled]: (state, { payload }) => {
      state.chats = payload;
      state.isLoading = false;
    },
    [fetchChats.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});
export const { setActiveChat, setNotifications } = chatsSlice.actions;
export default chatsSlice.reducer;
