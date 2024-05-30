/* eslint-disable react/no-array-index-key */
import styles from "@nature-digital/web-styles/components/toasts.module.scss";
import { useCallback, useState } from "react";

type ToastType = {
  message: string;
  type: "error" | "success";
};

// eslint-disable-next-line
export let createToast: (toast: ToastType) => void;

const Toast = () => {
  const [toasts, setToasts] = useState<Array<ToastType>>([]);

  createToast = useCallback(
    (toast: ToastType) => {
      const newToasts = [toast, ...toasts];
      setToasts(newToasts);

      setTimeout(() => {
        setToasts([]);
      }, 2500);
    },
    [toasts],
  );

  const ToastItem = useCallback(
    ({ message, type }: ToastType) => (
      <div
        className={styles.toast}
        style={{
          background: type === "error" ? "#C32127" : "#219653",
        }}
      >
        {message}
      </div>
    ),
    [],
  );

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast, i) => (
        <ToastItem key={`TOAST_ITEM_${toast}_${i}`} {...toast} />
      ))}
    </div>
  );
};

export default Toast;
