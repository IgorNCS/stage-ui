"use server";

import { LoginFormSchema, SignupFormSchema } from "@/app/(lib)/definitions";
import setCookieParser from "set-cookie-parser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { axiosApi } from "@/app/(lib)/axios";

export const loginAction = async (prevState: unknown, formData: FormData) => {

  const validateFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  try {
    console.log('login')
    const res = await axiosApi.post("/auth/login", { email, password });

    const data = await res.data.access_token;
    const user = await res.data.user;
    console.log(res.headers["set-cookie"]);
    const cookieStore = await cookies();
    const cookieData = setCookieParser(res.headers["set-cookie"]!);

    cookieData.forEach((cookie: any) =>

      cookieStore.set(cookie.name, cookie.value, { ...cookie })
    );

    cookieStore.set("user", JSON.stringify(user), { path: "/" });
    cookieStore.set("access_token", data, { path: "/" });
    

    redirect("/area");
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
  const cpf = formData.get("cpf");
  const birthday = formData.get("birthday");
  const confirmPassword = formData.get("confirmPassword");

  const role = "EMPLOYEER";

  try {
    const res = await axiosApi.post("/user", {
      name,
      email,
      password,
      role,
      cpf,
      birthday,
      confirmPassword,
    });
    const data = await res.data;
    const cookieStore = await cookies();
    const cookieData = setCookieParser(res.headers["set-cookie"]!);

    cookieData.forEach((cookie: any) =>
      cookieStore.set(cookie.name, cookie.value, { ...cookie })
    );
    redirect("/profile");
    return data;
  } catch (error) {
    console.log("Error occurred during login: ", error);
    throw error;
  }
};
