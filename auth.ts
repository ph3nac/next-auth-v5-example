import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import credentials from "next-auth/providers/credentials";

// auth: Next.jsアプリでNextAuth.jsとやりとりするための汎用メソッド。auth.ts(このファイル)でNextAuth.jsを初期化した後、Middleware、ServerComponents、Route Handler（app router）でこのメソッドを使う
//
// signIn: providerを指定してサインインすることができる。指定されていない場合、ユーザはサインインページにリダイレクトされる。デフォルトでは、ユーザはサインイン後に現在のページにリダイレクトされます。redirectToオプションに相対パスを設定することで、この動作をオーバーライドできる。
//
// signOut: ユーザーをサインアウトする。セッションがデータベース戦略を使用して作成された場合、セッションはデータベースから削除され、関連するクッキーは無効になります。セッションがJWTを使用して作成された場合、クッキーは無効になる．デフォルトでは、サインアウト後、ユーザーは現在のページにリダイレクトされます。redirectTo オプションに相対パスを設定することで、この動作をオーバーライドできます。
//
// handlers:
// NextAuth.jsのRouteHandlerメソッド。これらは、OAuth/Emailプロバイダー用のエンドポイント、および(`/api/auth/session`のような)クライアントから接続できるREST APIエンドポイントを公開するために使用されます。
// `auth.ts`でNextAuth.jsを初期化した後、これらのメソッドを再エクスポートします。
// `app/api/auth/[...nextauth]/route.ts`内：
// export { GET, POST } from "../../../../auth"
// export const runtime = "edge" // オプション
// その後、`auth.ts`内で次のように再エクスポートします：
//export const { handlers: { GET, POST }, auth } = NextAuth({...})
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    credentials({
      // signInが呼ばれた際にこの関数が呼び出される
      async authorize({ email, password }) {
        console.log("authorize:", email, password);
        // 実際にはここでバックエンドにリクエストを送信して認証を行う
        const url = process.env.API_URL + "/auth/login";
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        const backendToken = data.accessToken;
        const user = { backendToken };

        console.log("token:", backendToken);
        if (!backendToken) {
          // 認証に失敗した場合は nullを返すか，エラーを投げることが期待される
          // CredentialsSignin がスローされた場合、または null が返された場合、以下の 2 つのことが起こる：
          // 1. URL に error=CredentialsSignin&code=credentials を指定して、ユーザーをログインページにリダイレクトする。
          // 2. フォームアクションをサーバーサイドで処理するフレームワークでこのエラーを投げる場合、このエラーはログインフォームアクションによって投げられるので、そこで処理する必要がある。;
          return null;
        }
        return user;
      },
    }),
  ],
});
