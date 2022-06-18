import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { SanityAdapter } from '../../../lib/nextAuth/adapters';
import { getUserByEmailQuery } from '../../../lib/nextAuth/queries';

import client from '../../../lib/sanity/client';

import argon2 from 'argon2';

const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        // Find user by email
        const user = await client.fetch(getUserByEmailQuery, {
          email: credentials.email
        });

        // If user can't be found with the provided email throw new error:
        if (!user)
          throw new Error('Wrong email.');

        // Check for password:
        if (await argon2.verify(user.password, credentials.password)) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
          }
        }
        throw new Error('Wrong password.');
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: 'shajebetufolen',
  adapter: SanityAdapter()
};

export default NextAuth(options);