import NextAuth from "next-auth";
import ZitadelProvider from 'next-auth/providers/zitadel';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [ZitadelProvider({
    authorization: {
      params: {
        scope: `openid email profile offline_access`,
      },
    },
    async profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        loginName: profile.preferred_username,
        image: profile.picture
      }
    }
  })],
  callbacks: {
    async jwt({ token, user, account }) {
      token.user ??= user;
      token.accessToken ??= account?.access_token;
      token.refreshToken ??= account?.refresh_token;
      token.expiresAt ??= (account?.expires_at ?? 0) * 1000;
      token.error = undefined;
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return null;
    },
    async session({ session, token: { user, error: tokenError } }) {
      session.user = {
        id: user?.id,
        email: user?.email,
        image: user?.image,
        name: user?.name,
        loginName: user?.loginName,
      };
      session.clientId = process.env.ZITADEL_CLIENT_ID;
      session.error = tokenError;
      return session;
    },
  },
})
