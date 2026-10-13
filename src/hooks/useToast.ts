import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/toastSlice';


export const useToast = () => {
  const dispatch = useAppDispatch();

  const pushToast = ({ type, message, duration }: { type: 'success' | 'error', message: string, duration?: number }) => {
    dispatch(addToast({
      type,
      message,
      duration
    }));
  };

  return { pushToast };
};
