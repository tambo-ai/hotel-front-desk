"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  type ReactNode,
} from "react";

export type NotificationType = "info" | "warning" | "success" | "error";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  href?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  action?: NotificationAction;
  duration?: number;
}

export interface NotificationOptions {
  type?: NotificationType;
  title: string;
  message?: string;
  action?: NotificationAction;
  duration?: number;
}

interface NotificationContextValue {
  notifications: Notification[];
  notify: (options: NotificationOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  // Convenience methods
  info: (title: string, message?: string, action?: NotificationAction) => string;
  warning: (title: string, message?: string, action?: NotificationAction) => string;
  success: (title: string, message?: string, action?: NotificationAction) => string;
  error: (title: string, message?: string, action?: NotificationAction) => string;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const DEFAULT_DURATION = 5000; // 5 seconds
const MAX_NOTIFICATIONS = 5;

function generateId(): string {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Clear the timer if it exists
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    // Clear all timers
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();

    setNotifications([]);
  }, []);

  const notify = useCallback(
    (options: NotificationOptions): string => {
      const id = generateId();
      const duration = options.duration ?? DEFAULT_DURATION;

      const notification: Notification = {
        id,
        type: options.type ?? "info",
        title: options.title,
        message: options.message,
        action: options.action,
        duration,
      };

      setNotifications((prev) => {
        // Remove oldest notifications if we're at max
        const newNotifications = [...prev, notification];
        if (newNotifications.length > MAX_NOTIFICATIONS) {
          const removed = newNotifications.shift();
          if (removed) {
            const timer = timersRef.current.get(removed.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(removed.id);
            }
          }
        }
        return newNotifications;
      });

      // Set up auto-dismiss timer if duration > 0
      if (duration > 0) {
        const timer = setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  // Convenience methods
  const info = useCallback(
    (title: string, message?: string, action?: NotificationAction) =>
      notify({ type: "info", title, message, action }),
    [notify]
  );

  const warning = useCallback(
    (title: string, message?: string, action?: NotificationAction) =>
      notify({ type: "warning", title, message, action }),
    [notify]
  );

  const success = useCallback(
    (title: string, message?: string, action?: NotificationAction) =>
      notify({ type: "success", title, message, action }),
    [notify]
  );

  const error = useCallback(
    (title: string, message?: string, action?: NotificationAction) =>
      notify({ type: "error", title, message, action }),
    [notify]
  );

  const value: NotificationContextValue = {
    notifications,
    notify,
    dismiss,
    dismissAll,
    info,
    warning,
    success,
    error,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
