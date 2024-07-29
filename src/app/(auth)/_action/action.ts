"use server";
export type LoginState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  valuee?: {
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
  return {
    errors: {
      name: ["name is invalid"],
      email: ["email is invalid"],
      password: ["password is invalid"],
    },
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
  return {
    errors: {
      email: ["email is invalid"],
      password: ["password is invalid"],
    },
    message: "login failed",
  };
};
