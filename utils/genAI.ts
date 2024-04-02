import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

if (!process.env.GENERATIVE_API_KEY) {
  console.log("You must define the GENERATIVE_API_KEY environment variable");
}

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(process.env.GENERATIVE_API_KEY || ""),
});

export default client;
