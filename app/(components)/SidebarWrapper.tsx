import Sidebar from "./sidebar";
import { cookies } from "next/headers";

export default async function SidebarWrapper() {
  const cookieStore = cookies();
  let userCookie: string | null = null;

  const userCookieObj = (await cookieStore).get("user");
  if (userCookieObj) {
    userCookie = userCookieObj.value;
  }

  return <Sidebar userCookie={userCookie} />;
}