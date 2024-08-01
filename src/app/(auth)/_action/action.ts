"use server";

import { redirect } from "next/navigation";
import { signIn } from "../../../../auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export type LoginState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  value?: {
    name?: string;
    email?: string;
    password?: string;
  };
  message?: string;
};

export const signup = async (
  _state: SignUpState,
  formData: FormData
): Promise<SignUpState> => {
  // signup処理
  const url = process.env.API_URL + "/auth/signup";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  // ログインページにリダイレクト
  if (res.status === 201) {
    redirect("/signin");
  }
  return {
    message: "signup failed",
  };
};

export type SignUpState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  valuee?: {
    email?: string;
    password?: string;
  };
  message: string | null;
};

export const signin = async (
  _state: LoginState,
  formData: FormData
): Promise<LoginState> => {
  // login処理
  try {
    // NEXT_REDIRECTが投げられ，catchでリダイレクトされる
    await signIn("credentials", formData);
    return { message: "success" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.error("Signin error:", error);
          return {
            message: "メールアドレスまたはパスワードが間違っています",
          };
      }
    }
    // リダイレクトエラーの場合はリダイレクト
    if (isRedirectError(error)) {
      redirect("/user");
    }
    return {
      message: "An unexpected error occurred during signin",
    };
  }
};
