"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Message, messageApi } from "@/lib/api/message";
import { useAuth } from "@/lib/auth/useAuth";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface MessageChatProps {
  bookingId: string;
}

export function MessageChat({ bookingId }: MessageChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await messageApi.getMessagesByBooking(bookingId);
      setMessages(response.data.messages);
      setLoading(false);

      // Mark messages as read
      if (user) {
        const unreadCount = response.data.messages.filter(
          (msg) => msg.toUserId === user.id && !msg.readAt
        ).length;
        if (unreadCount > 0) {
          await messageApi.markMessagesAsRead(bookingId);
        }
      }
    } catch (error) {
      if (!loading) {
        // Only show error if not initial load
        console.error("Failed to fetch messages:", error);
      }
    }
  };

  const handleSend = async () => {
    if (!messageBody.trim()) return;

    try {
      setSending(true);
      await messageApi.createMessage(bookingId, {
        bookingId,
        body: messageBody.trim(),
      });
      setMessageBody("");
      // Fetch messages immediately after sending
      await fetchMessages();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Loading messages...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.fromUserId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isOwnMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            message.fromUser?.profile?.avatarUrl || undefined
                          }
                        />
                        <AvatarFallback>
                          {message.fromUser?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`flex flex-col max-w-[70%] ${
                        isOwnMessage ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isOwnMessage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.body}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {format(new Date(message.createdAt), "MMM dd, h:mm a")}
                      </span>
                    </div>
                    {isOwnMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={2}
              className="resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!messageBody.trim() || sending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
