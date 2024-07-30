"use server";

import { redirect } from "next/navigation";
import { auth, signOut } from "../../../../auth";

type User = {
  id: string;
  email: string;
  name?: string;
};
const getUser = async (backendToken: string): Promise<User> => {
  console.log("getUser", backendToken);
  const API_URL = process.env.API_URL;
  const url = API_URL + "/user";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${backendToken}`,
    },
  });
  return res.json();
};
export default async function UserPage() {
  const nextAuthSession = await auth();
  const backendToken = nextAuthSession?.backendToken;
  if (!backendToken) {
    redirect("signin");
  }
  const user = await getUser(backendToken);

  return (
    <>
      <div>ID: {user.id}</div>
      <div>email: {user.email}</div>
      <div>name: {user.name}</div>
      <form
        action={async () => {
          // onClickだとclient componentになるのでformにしている
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  );
}
