import NextAuth from "next-auth";
import ZitadelProvider from 'next-auth/providers/zitadel';
import prisma from "@/lib/db";
import { AuthOrg, TokenUser } from "./types/auth";
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string,
      email: string
      name: string
      image: string
      orgs: AuthOrg[]
    } & DefaultSession["user"];
  }
}

interface Roles {
  "contact-center": {
    [k: string]: Record<string, string>
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [ZitadelProvider({
    authorization: {
      params: {
        scope: `openid email profile offline_access`,
      },
    },
    async profile(profile) {
      const roles = profile["urn:zitadel:iam:org:project:roles"] as Roles;
      return {
        id: profile.sub,
        name: profile.name,
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        loginName: profile.preferred_username,
        image: profile.picture,
        roles
      }
    }
  })],
  callbacks: {
    async jwt({ token, user, account }) {
      token.user ??= user;
      token.accessToken ??= account?.access_token;
      token.refreshToken ??= account?.refresh_token;
      token.expiresAt ??= (account?.expires_at ?? 0) * 1000;

      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // TODO: Refresh token if enabled
      return null;
    },
    async signIn({ account, profile }) {
      if (!profile?.email_verified) return false;

      const roles = profile["urn:zitadel:iam:org:project:roles"] as Roles;
      if (!roles["contact-center"]) return false;

      Object.entries(roles["contact-center"]).forEach(async ([key, value]) => {
        let org = await prisma.org.findUnique({
          where: {
            identifier: Number(key)
          }
        })

        if (!org) {
          org = await prisma.org.create({
            data: {
              identifier: Number(key),
              name: `${value}`,
            }
          })
        }
      })
      let localUser = await prisma.user.findUnique({
        where: {
          oauth: {
            provider: account?.provider as string,
            providerId: account?.providerAccountId as string
          }
        }
      })


      if (!localUser) {
        localUser = await prisma.user.create({
          data: {
            provider: account?.provider as string,
            providerId: account?.providerAccountId as string,
            firstName: profile?.given_name as string,
            lastName: profile?.family_name as string,
            email: profile?.email as string,
            image: profile?.picture ?? "",
          }
        })
      }

      await prisma.session.create({
        data: {
          token: account?.access_token as string,
          expiresAt: new Date(account?.expires_at as number * 1000),
          user: {
            connect: {
              id: localUser?.id
            }
          }
        }
      })

      return true;
    },
    async session({ token, session }) {
      const user = token.user as TokenUser;
      const orgs = Object.entries(user?.roles["contact-center"]).map(([k, v]): AuthOrg => ({ id: k, identifier: Number(k), org: v }));

      const dbSession = await prisma.session.findFirst({
        where: {
          token: token.accessToken as string
        }
      })

      session.user.id = dbSession?.userId as string
      session.user.email = user?.email
      session.user.name = user?.name
      session.user.image = user?.image
      session.user.orgs = orgs

      return session;
    },
  }
})
/*
 *
 */
