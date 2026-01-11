"use client";

import { useEffect, useState } from "react";
import {
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import type { Notification, NotificationType } from "./notification-context";

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const typeConfig: Record<
  NotificationType,
  {
    icon: typeof Info;
    bgClass: string;
    borderClass: string;
    iconClass: string;
    titleClass: string;
  }
> = {
  info: {
    icon: Info,
    bgClass: "bg-info/10 dark:bg-info/15",
    borderClass: "border-info/30",
    iconClass: "text-info",
    titleClass: "text-info",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-warning/10 dark:bg-warning/15",
    borderClass: "border-warning/30",
    iconClass: "text-warning",
    titleClass: "text-warning",
  },
  success: {
    icon: CheckCircle,
    bgClass: "bg-success/10 dark:bg-success/15",
    borderClass: "border-success/30",
    iconClass: "text-success",
    titleClass: "text-success",
  },
  error: {
    icon: XCircle,
    bgClass: "bg-destructive/10 dark:bg-destructive/15",
    borderClass: "border-destructive/30",
    iconClass: "text-destructive",
    titleClass: "text-destructive",
  },
};

export function NotificationToast({
  notification,
  onDismiss,
}: NotificationToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  // Handle dismiss with exit animation
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 200);
  };

  // Progress bar animation
  useEffect(() => {
    if (!notification.duration || notification.duration <= 0) return;

    const startTime = Date.now();
    const duration = notification.duration;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    const animationId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationId);
  }, [notification.duration]);

  // Handle action click
  const handleActionClick = () => {
    if (notification.action?.href) {
      window.open(notification.action.href, "_blank", "noopener,noreferrer");
    }
    notification.action?.onClick?.();
    handleDismiss();
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        relative overflow-hidden
        w-80 max-w-[calc(100vw-2rem)]
        bg-card border ${config.borderClass}
        rounded-lg shadow-lg
        transform transition-all duration-200 ease-out
        ${isExiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}
      `}
    >
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 mt-0.5 ${config.iconClass}`}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${config.titleClass}`}>
              {notification.title}
            </p>
            {notification.message && (
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {notification.message}
              </p>
            )}

            {/* Action button */}
            {notification.action && (
              <button
                onClick={handleActionClick}
                className={`
                  mt-2 inline-flex items-center gap-1
                  text-sm font-medium
                  ${config.iconClass} hover:underline
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  transition-colors
                `}
              >
                {notification.action.label}
                {notification.action.href && (
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {notification.duration && notification.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border">
          <div
            className={`h-full ${config.iconClass.replace("text-", "bg-")} transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
