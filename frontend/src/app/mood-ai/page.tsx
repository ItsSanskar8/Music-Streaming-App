import { redirect } from "next/navigation";

// Redirect /mood-ai → /mood-match for backwards compatibility.
export default function MoodAIRedirect() {
  redirect("/mood-match");
}
