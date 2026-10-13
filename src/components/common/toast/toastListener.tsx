"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeToast } from "@/store/slices/toastSlice";
import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster, ToastT } from "sonner";

// type Props = {}

const ToastListener = () => {
  const messages = useAppSelector((state) => state.toast.messages);
  const dispatch = useAppDispatch();
  const shownToastIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    messages.forEach((msg, index: number) => {
      if (!shownToastIds.current.has(msg.id)) {
        shownToastIds.current.add(msg.id);
        // toast[msg.type](msg.message, {
        //   duration: msg.duration,
        //   onAutoClose: () => dispatch(removeToast(msg.id)),
        //   action: {
        //     label: '×',
        //     onClick: () => dispatch(removeToast(msg.id)),
        //   },
        //   className: `${msg.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} cursor-pointer`,
        //   style: { borderRadius: 8, padding: '12px 16px' },
        // })

        toast.custom(
          (t: any) => (
            <TimedToast
              t={t}
              message={msg.message}
              type={msg.type}
              duration={msg.duration as number}
              onClose={() => dispatch(removeToast(msg.id))}
            />
          ),
          {
            duration: msg.duration,
            onAutoClose: () => dispatch(removeToast(msg.id)),
          },
        );
      }
    });
  }, [messages]);

  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      expand
      visibleToasts={9}
    />
  );
};

export default ToastListener;

interface TimedToastProps {
  t: any;
  message: string;
  type: "success" | "error";
  duration: number;
  onClose: () => void;
}

const TimedToast = ({
  t,
  message,
  type,
  duration,
  onClose,
}: TimedToastProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = 100 - (elapsed / duration) * 100;
      setProgress(Math.max(0, percent));
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className={`relative px-4 py-2 rounded-sm shadow-sm text-white ${type === "success" ? "bg-green-600/70" : "bg-red-600/70"} `}
    >
      <div className="flex items-center justify-between gap-4">
        <p>{message}</p>
        <button
          className=" flex items-center justify-center text-2xl active:scale-95"
          onClick={() => {
            toast.dismiss(t);
            onClose();
          }}
        >
          &times;
        </button>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1  bg-inherit">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
