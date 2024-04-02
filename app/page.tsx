"use client";

import { Badge } from "@/components/ui/badge";
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
import { ChatHistory } from "@/interface/chatHistory";
import MarkdownReader from "@/components/mdx-components";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [chatHistory, setChatHistory] = React.useState<ChatHistory[] | []>([]);
  const [message, setMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null); // Ref for the scroll area

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

    setChatHistory((pre) => [...pre, { auther: "0", content: message }]);
    await zoe({
      message: message,
      history: chatHistory,
    })
      .then((result) => {
        console.log(result);
        if (result[0].candidates) {
          let addMessage = result[0].candidates[0];

          if (addMessage.author && addMessage.content) {
            const content = addMessage.content;

            setChatHistory((pre) => [
              ...pre,
              { auther: "1", content: content },
            ]);
          }
        }
        scrollToBottom();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(async () => {
        await scrollToBottom();
        setIsLoading(false);
        setMessage("");
      });
  };

  return (
    <main>
      <ScrollArea className="h-screen">
        <div className="relative flex h-screen mx-0 sm:mx-10 lg:mx-60 flex-col p-4 lg:col-span-2">
          <ScrollArea className="w-full h-5/6 mb-2">
            {chatHistory.map((chat, index) => (
              <div key={index}>
                {chat.auther === "0" ? (
                  <div className="flex justify-end gap-1 mb-2 ">
                    {/* <p>{chat.content}</p> */}
                    <div className="max-w-[70%]">
                      <MarkdownReader markdown={chat.content} />
                    </div>
                    <Badge variant="outline" className="mr-2 h-fit ml-2">
                      You
                    </Badge>
                  </div>
                ) : (
                  <div className="flex justify-start gap-1 mb-2">
                    <Badge variant="outline" className="ml-2 h-fit mr-2">
                      Zoe
                    </Badge>
                    <div className="max-w-[70%]">
                      <MarkdownReader markdown={chat.content} />
                    </div>
                    {/* <p>{chat.content}</p> */}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-1 mb-2">
                <Badge variant="outline" className="ml-2 h-fit mr-2">
                  AI
                </Badge>
                <div className="size-3 bg-secondary-foreground rounded-full animate-pulse"></div>
              </div>
            )}
            <div ref={scrollAreaRef} />
          </ScrollArea>

          {/* <Badge variant="outline" className="absolute right-3 top-3">
                  Output
              </Badge> */}
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
