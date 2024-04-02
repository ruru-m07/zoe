import { Badge } from "./ui/badge";

const AiLoading = () => {
  return (
    <div className="flex justify-start gap-1 mb-2">
      <Badge variant="outline" className="ml-2 h-fit mr-2">
        Zoe
      </Badge>
      <div className="size-3 bg-secondary-foreground rounded-full animate-pulse"></div>
    </div>
  );
};

export default AiLoading;
