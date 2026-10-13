import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ToastType = 'success' | 'error';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; /* in ms */
}

interface ToastState {
  messages: ToastMessage[];
}

const initialState: ToastState = {
  messages: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    // addToast: (state, action: PayloadAction<ToastMessage>) => {
    //   state.messages.push({ ...action.payload, duration: action?.payload?.duration || 3000 });
    // },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      state.messages.push({
        id: Date.now().toString() + Math.random() * Math.random(),
        message: action.payload.message,
        type: action.payload.type,
        duration: action.payload.duration,
      });
    }, 

    removeToast: (state, action: PayloadAction<ToastMessage['id']>) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
