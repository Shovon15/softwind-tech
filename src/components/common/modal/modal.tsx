"use client";

import { cn } from "@/utils/helpers/cn";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
  iconColor?: string;
}

const Modal = ({
  children,
  onClose,
  isOpen = false,
  className = "",
  iconColor = "",
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Mount modal and lock scroll
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setTimeout(() => setShow(true), 10); // Trigger animation
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Unmount after animation
  useEffect(() => {
    if (!show && mounted) {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show, mounted]);

  // Close on outside click
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose?.();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div
      className={cn(
        `fixed inset-0 z-[9999999] flex items-center justify-center transition-opacity duration-300 ${
          show ? "bg-[#000000B5] opacity-100" : "bg-black/0 opacity-0"
        }`,
      )}
    >
      <div
        ref={modalRef}
        className={cn(
          `relative w-full p-6 shadow-xl bg-white transform transition-all duration-300  max-w-[90%] md:max-w-[70%]  ${className} ${
            show ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`,
        )}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-10 right-10 text-xl">
          <svg
            className="size-[14px] md:size-[18px] "
            // width="18"
            // height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.7384 8.8L17.3188 2.21889C17.4998 2.03773 17.5997 1.79603 17.6 1.53831C17.6 1.28045 17.5001 1.03847 17.3188 0.857591L16.7422 0.281046C16.5609 0.0994536 16.3192 0 16.0612 0C15.8037 0 15.562 0.0994536 15.3807 0.281046L8.80029 6.86173L2.2196 0.281046C2.0386 0.0994536 1.79677 0 1.53893 0C1.28137 0 1.03954 0.0994536 0.858537 0.281046L0.2816 0.857591C-0.0938667 1.23308 -0.0938667 1.84383 0.2816 2.21889L6.86214 8.8L0.2816 15.3808C0.100449 15.5623 0.000715447 15.804 0.000715447 16.0617C0.000715447 16.3194 0.100449 16.5611 0.2816 16.7424L0.858393 17.319C1.0394 17.5004 1.28137 17.6 1.53878 17.6C1.79663 17.6 2.03845 17.5004 2.21946 17.319L8.80014 10.7381L15.3805 17.319C15.5618 17.5004 15.8035 17.6 16.0611 17.6H16.0614C16.3191 17.6 16.5607 17.5004 16.742 17.319L17.3187 16.7424C17.4997 16.5612 17.5996 16.3194 17.5996 16.0617C17.5996 15.804 17.4997 15.5623 17.3187 15.381L10.7384 8.8Z"
              // fill="#2F2F2F"
              fill={iconColor ? iconColor : "#2F2F2F"}
            />
          </svg>
        </button>

        <div className="w-full h-full">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
