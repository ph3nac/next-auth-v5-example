"use server";

import email from "next-auth/providers/email";
import { redirect } from "next/navigation";
import { signIn } from "../../../../auth";
import { AuthError } from "next-auth";

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
  message: string | null;
};

export const signup = async (
  _state: LoginState,
  formData: FormData
): Promise<LoginState> => {
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
): Promise<SignUpState> => {
  // login処理
  try {
    await signIn("credentials", formData, { redirectTo: "/user" });
  } catch (error) {
    if (error instanceof AuthError) {
      // TODO: 確認
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "メールアドレスまたはパスワードが正しくありません",
          };
        }
        default: {
          throw error;
        }
      }
    }
  }
  return {
    message: null,
  };
};
