import { Content } from "@google/generative-ai";
import MarkdownReader from "./mdx-components";
import { Badge } from "./ui/badge";

const ListChat = ({ chatHistory }: { chatHistory: Content[] }) => {
  return (
    <div>
      {chatHistory.map((chat, index) => (
        <div key={index}>
          {chat.role === "user" ? (
            <div className="flex justify-end gap-1 mb-2 ">
              {/* <p>{chat.content}</p> */}
              <div className="max-w-[70%]">
                <MarkdownReader markdown={chat.parts[0].text} />
              </div>
              <Badge variant="outline" className="mr-2 h-fit ml-2">
                You
              </Badge>
            </div>
          ) : (
            <div className="flex justify-start gap-1 mb-2 border-b pb-2">
              <Badge variant="outline" className="ml-2 h-fit mr-2 md:block hidden">
                Zoe
              </Badge>
              <div className="md:max-w-[70%] sm:max-w-[90%] max-w-[95%]">
                <MarkdownReader markdown={chat.parts[0].text} />
              </div>
              {/* <p>{chat.content}</p> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListChat;
