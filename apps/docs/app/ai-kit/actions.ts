"use server";
import { headers } from "next/headers";
import {
  aiConfigured,
  allowedAIOrigin,
  releaseRequest,
  requestScene,
  reserveRequest,
  validAccessCode,
} from "../../server/ai-provider";
export async function generateScene(brief: string, accessCode: string) {
  const h = await headers();
  if (!allowedAIOrigin(h.get("host"), h.get("origin")))
    return { error: "Generation is available only from the local workspace." };
  if (
    typeof brief !== "string" ||
    typeof accessCode !== "string" ||
    brief.trim().length < 8 ||
    brief.length > 2000 ||
    accessCode.length > 128
  )
    return { error: "Write a brief between 8 and 2000 characters." };
  if (!aiConfigured())
    return {
      error: "AI provider setup is required. Use the prompt pack or a starter scene meanwhile.",
    };
  if (!validAccessCode(accessCode)) return { error: "The workspace access code is incorrect." };
  if (!reserveRequest())
    return { error: "Generation limit reached or another request is running. Try again later." };
  try {
    return { scene: await requestScene(brief.trim()) };
  } catch {
    return {
      error:
        "Generation could not finish. Check the server provider configuration or try again later.",
    };
  } finally {
    releaseRequest();
  }
}
