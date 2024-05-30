import { URL_KEYS } from "@nature-digital/constants";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default async function auth(req: NextApiRequest, res: NextApiResponse<any>) {
  // eslint-disable-next-line
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        credentials: {
          user: {},
        },
        // @ts-ignore
        async authorize({ user = null }) {
          // If no error and we have user data, return it
          if (user) {
            return JSON.parse(user);
          }
          // Return null if user data could not be retrieved
          return null;
        },
      }),
    ],

    pages: {
      signIn: "/user/login", // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      error: "/user/login", // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: null // If set, new users will be directed here on first sign in
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
      // @ts-ignore
      async signIn(params) {
        return params.user;
      },

      async jwt(token) {
        if (req.query[URL_KEYS.UPDATE] && token.token.user) {
          const username = req.query[URL_KEYS.USERNAME];
          const photos = req.query[URL_KEYS.PHOTOS];

          if (username) {
            token.token.user = { ...token.token.user, [URL_KEYS.USERNAME]: username } as User;
          }

          if (photos) {
            // @ts-ignore
            token.token.user = { ...token.token.user, [URL_KEYS.PHOTOS]: JSON.parse(photos) } as User;
          }
        }

        return {
          user: token.token.user ?? token.user,
        };
      },

      async signOut() {
        // axios.post()
      },

      // @ts-ignore
      async session({ token, session }) {
        return { expires: session.expires, user: token.user };
      },
    },
  });
}
