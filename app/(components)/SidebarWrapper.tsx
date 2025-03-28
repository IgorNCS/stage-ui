import Sidebar from "./sidebar";
import { cookies } from "next/headers";

export default async function SidebarWrapper() {
  try {
    const cookieStore = cookies();
    let userCookie: string | null = null;

    const userCookieObj = (await cookieStore).get("user");
    if (userCookieObj) {
      userCookie = userCookieObj.value;
    }

    return <Sidebar userCookie={userCookie} />;
  } catch (error) {
    console.error("Erro ao acessar cookies:", error);
    return <Sidebar userCookie={null} />;
  }
}