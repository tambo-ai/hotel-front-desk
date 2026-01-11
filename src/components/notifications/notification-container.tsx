"use client";

import { useNotification } from "./notification-context";
import { NotificationToast } from "./notification-toast";

export function NotificationContainer() {
  const { notifications, dismiss } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 pointer-events-none"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto animate-in slide-in-right"
        >
          <NotificationToast notification={notification} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
