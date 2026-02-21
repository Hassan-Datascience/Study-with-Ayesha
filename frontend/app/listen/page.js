import { redirect } from "next/navigation";

export default function ListenPage() {
    // The separate listen page has been deprecated in favor of native
    // Web Speech API directly inside the Chat interface.
    // Redirect users who try to access this old route.
    redirect("/chat");
}

