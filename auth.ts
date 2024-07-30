import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import credentials from "next-auth/providers/credentials";

// auth: Next.jsアプリでNextAuth.jsとやりとりするための汎用メソッド。auth.ts(このファイル)でNextAuth.jsを初期化した後、Middleware、ServerComponents、Route Handler（app router）でこのメソッドを使う
//
// signIn: providerを指定してサインインすることができる。指定されていない場合、ユーザはサインインページにリダイレクトされる。デフォルトでは、ユーザはサインイン後に現在のページにリダイレクトされます。redirectToオプションに相対パスを設定することで、この動作をオーバーライドできる。
//
// signOut: ユーザーをサインアウトする。セッションがデータベース戦略を使用して作成された場合、セッションはデータベースから削除され、関連するクッキーは無効になります。セッションがJWTを使用して作成された場合、クッキーは無効になる．デフォルトでは、サインアウト後、ユーザーは現在のページにリダイレクトされます。redirectTo オプションに相対パスを設定することで、この動作をオーバーライドできます。
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    credentials({
      // signInが呼ばれた際にこの関数が呼び出される
      async authorize(credentials) {
        // 実際にはここでバックエンドにリクエストを送信して認証を行う
        const user = { backendToken: "xxx" };

        // 認証に成功した場合はUserを返す
        // Userに任意の値を含めるにはUser型を拡張する必要がある
        if (!user.backendToken) {
          return user;
        }

        // 認証に失敗した場合は nullを返すか，エラーを投げることが期待される
        return null;
        // CredentialsSignin がスローされた場合、または null が返された場合、以下の 2 つのことが起こる：
        // 1. URL に error=CredentialsSignin&code=credentials を指定して、ユーザーをログインページにリダイレクトする。
        // 2. フォームアクションをサーバーサイドで処理するフレームワークでこのエラーを投げる場合、このエラーはログインフォームアクションによって投げられるので、そこで処理する必要があります。;
      },
    }),
  ],
});
