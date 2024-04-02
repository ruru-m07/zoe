"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { zoe } from "../action/zoe";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ListChat from "@/components/listChat";
import AiLoading from "@/components/AiLoading";
import { Content } from "@google/generative-ai";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [chatHistory, setChatHistory] = React.useState<Content[] | []>([]);
  const [message, setMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  const scrollAreaRef = React.useRef<HTMLDivElement>(null); // Ref for the scroll area
  const { toast } = useToast();

  // Function to scroll to the bottom of the chat area
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({
        block: "end",
      });
    }
  };

  // Scroll to bottom when chatHistory changes
  React.useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    scrollToBottom();

    try {
      setChatHistory((prevMsg) => [
        ...prevMsg,
        { role: "user", parts: [{ text: message }] },
      ]);

      const data = await zoe({ message: message, history: chatHistory });

      if (data.success && data.text) {
        setChatHistory((prevMsg) => [
          ...prevMsg,
          { role: "model", parts: [{ text: data.text }] },
        ]);
      } else {
        console.log(data.error);
        if (data.error) {
          toast({
            description: data.error,
          });
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setMessage("");
      scrollToBottom();
    }
  };

  return (
    <main>
      <ScrollArea className="h-screen">
        <div className="relative flex h-screen mx-0 sm:mx-10 lg:mx-60 flex-col p-4 lg:col-span-2">
          <ScrollArea className="w-full h-5/6 mb-2">
            <ListChat chatHistory={chatHistory} />
            {isLoading && <AiLoading />}
            <div ref={scrollAreaRef} />
          </ScrollArea>

          <div className="flex-1" />
          <form
            onSubmit={handelSubmit}
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              disabled={isLoading}
              required
            />
            <div className="flex items-center p-3 pt-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button disabled variant="ghost" size="icon">
                      <Paperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button disabled variant="ghost" size="icon">
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
                disabled={isLoading}
              >
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </main>
  );
}
