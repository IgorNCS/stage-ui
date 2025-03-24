import { cookies } from "next/headers";
import { axiosApi } from "../lib/axios";


type Response = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
const getUser = async () => {
  const cookieStore = await cookies();

  const res = await axiosApi.get("/user/me", {
    headers: {
      Authorization: `access_token=${
        cookieStore.get("access_token")?.value
      } ,refresh_token=${cookieStore.get("refresh_token")?.value}`,
    },
    withCredentials: true,
  });
  const data = (await res.data) as Response;
  console.log(data);
  return data;
};
const ProfilePage = async () => {
  const user = await getUser();
  return <ProfileCard {...user.user} />;
};

export default ProfilePage;

