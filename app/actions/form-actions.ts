"use server";

import { LoginFormSchema, SignupFormSchema } from "../lib/definitions";
import setCookieParser from "set-cookie-parser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { axiosApi } from "../lib/axios";


export const loginAction = async (prevState: unknown, formData: FormData) => {
  console.log(prevState);

  const validateFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  console.log("Fields validated");

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await axiosApi.post("/auth/login", { email, password });
    const data = await res.data;
    console.log(res.headers["set-cookie"]);
    const cookieStore = await cookies();
    const cookieData = setCookieParser(res.headers["set-cookie"]!);

    cookieData.forEach((cookie: any) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      cookieStore.set(cookie.name, cookie.value, { ...cookie })
    );
    console.log(data);

    redirect("/register");
  } catch (error) {
    console.log("Error occurred during login: ", error);
    throw error;
  }
};

export const signupAction = async (prevState: unknown, formData: FormData) => {
  console.log(prevState);

  const validateFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  console.log("Fields validated");

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await axiosApi.post("/user", { name, email, password });
    const data = await res.data;
    const cookieStore = await cookies();
    const cookieData = setCookieParser(res.headers["set-cookie"]!);

    cookieData.forEach((cookie: any) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      cookieStore.set(cookie.name, cookie.value, { ...cookie })
    );
    redirect("/profile");
    return data;
  } catch (error) {
    console.log("Error occurred during login: ", error);
    throw error;
  }
};
