"use client";

import {
  MessageInput,
  MessageInputTextarea,
  MessageInputToolbar,
  MessageInputSubmitButton,
  MessageInputError,
  MessageInputFileButton,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsStatus,
  MessageSuggestionsList,
} from "@/components/tambo/message-suggestions";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import type { messageVariants } from "@/components/tambo/message";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { ThreadDropdown } from "@/components/tambo/thread-dropdown";
import { cn } from "@/lib/utils";
import { useMergeRefs } from "@/lib/thread-hooks";
import type { VariantProps } from "class-variance-authority";
import { MessageSquare, XIcon } from "lucide-react";
import * as React from "react";
import { useRef } from "react";
import type { Suggestion } from "@tambo-ai/react";

/**
 * Props for the MessageThreadPanel component
 * @interface
 */
export interface MessageThreadPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional content to render in the left panel of the grid */
  children?: React.ReactNode;
  /**
   * Controls the visual styling of messages in the thread.
   * Possible values include: "default", "compact", etc.
   * These values are defined in messageVariants from "@/components/tambo/message".
   * @example variant="compact"
   */
  variant?: VariantProps<typeof messageVariants>["variant"];
  /** Callback when the close button is clicked */
  onClose?: () => void;
}

/**
 * Props for the ResizablePanel component
 */
interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Children elements to render inside the container */
  children: React.ReactNode;
  /** Whether the panel should be positioned on the left (true) or right (false) */
  isLeftPanel: boolean;
}

/**
 * A resizable panel component with a draggable divider
 */
const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, children, isLeftPanel, ...props }, ref) => {
    const [width, setWidth] = React.useState(480);
    const isResizing = React.useRef(false);
    const lastUpdateRef = React.useRef(0);

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isResizing.current) return;

        const now = Date.now();
        if (now - lastUpdateRef.current < 16) return;
        lastUpdateRef.current = now;

        const windowWidth = window.innerWidth;

        requestAnimationFrame(() => {
          let newWidth;
          if (isLeftPanel) {
            newWidth = Math.round(e.clientX);
          } else {
            newWidth = Math.round(windowWidth - e.clientX);
          }

          // Ensure minimum width of 420px
          const clampedWidth = Math.max(
            420,
            Math.min(windowWidth - 400, newWidth),
          );
          setWidth(clampedWidth);

          // Update both panel and canvas widths using the same divider position
          if (isLeftPanel) {
            document.documentElement.style.setProperty(
              "--panel-left-width",
              `${clampedWidth}px`,
            );
          } else {
            document.documentElement.style.setProperty(
              "--panel-right-width",
              `${clampedWidth}px`,
            );
          }
        });
      },
      [isLeftPanel],
    );

    return (
      <div
        ref={ref}
        className={cn(
          "h-full flex flex-col relative",
          "transition-[width] duration-75 ease-out",
          isLeftPanel
            ? "border-r border-border"
            : "border-l border-border shadow-[-8px_0_24px_-8px_rgba(0,0,0,0.15)]",
          className,
        )}
        style={{
          width: `${width}px`,
          flex: "0 0 auto",
        }}
        {...props}
      >
        {/* Resize handle - subtle but functional */}
        <div
          className={cn(
            "absolute top-0 bottom-0 w-1 cursor-ew-resize transition-colors z-50",
            "bg-transparent hover:bg-accent/50",
            isLeftPanel ? "right-0" : "left-0",
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            isResizing.current = true;
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener(
              "mouseup",
              () => {
                isResizing.current = false;
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
                document.removeEventListener("mousemove", handleMouseMove);
              },
              { once: true },
            );
          }}
        />
        {children}
      </div>
    );
  },
);
ResizablePanel.displayName = "ResizablePanel";

/**
 * A resizable panel component that displays a chat thread with message history, input, and suggestions
 * @component
 * @example
 * ```tsx
 * // Default left positioning
 * <MessageThreadPanel />
 *
 * // Explicit right positioning
 * <MessageThreadPanel className="right" />
 * ```
 */
export const MessageThreadPanel = React.forwardRef<
  HTMLDivElement,
  MessageThreadPanelProps
>(({ className, variant, onClose, ...props }, ref) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs<HTMLDivElement | null>(ref, panelRef);

  const defaultSuggestions: Suggestion[] = [
    {
      id: "suggestion-1",
      title: "Get started",
      detailedSuggestion: "What can you help me with?",
      messageId: "welcome-query",
    },
    {
      id: "suggestion-2",
      title: "Learn more",
      detailedSuggestion: "Tell me about your capabilities.",
      messageId: "capabilities-query",
    },
    {
      id: "suggestion-3",
      title: "Examples",
      detailedSuggestion: "Show me some example queries I can try.",
      messageId: "examples-query",
    },
  ];

  return (
    <ResizablePanel
      ref={mergedRef}
      isLeftPanel={false}
      className={cn("bg-background", className)}
      {...props}
    >
      <div className="flex flex-col h-full">
        {/* Chat header - matches nav height (h-12) */}
        <div className="h-12 px-4 flex items-center justify-between shrink-0 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Assistant</span>
            </div>
            <ThreadDropdown />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close chat"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Message thread content - subtle background */}
        <ScrollableMessageContainer className="p-4 bg-muted/30">
          <ThreadContent variant={variant}>
            <ThreadContentMessages />
          </ThreadContent>
        </ScrollableMessageContainer>

        {/* Message Suggestions Status */}
        <MessageSuggestions>
          <MessageSuggestionsStatus />
        </MessageSuggestions>

        {/* Input area - grouped with suggestions */}
        <div className="border-t border-border bg-background">
          {/* Message input */}
          <div className="p-4 pb-2">
            <MessageInput>
              <MessageInputTextarea placeholder="Ask anything..." autoFocus />
              <MessageInputToolbar>
                <MessageInputFileButton />
                <MessageInputSubmitButton />
              </MessageInputToolbar>
              <MessageInputError />
            </MessageInput>
          </div>

          {/* Message suggestions - part of input area */}
          <div className="px-4 pb-4">
            <MessageSuggestions initialSuggestions={defaultSuggestions}>
              <MessageSuggestionsList />
            </MessageSuggestions>
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
});
MessageThreadPanel.displayName = "MessageThreadPanel";
