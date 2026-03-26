import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  NEXT_PUBLIC_DEVELOPMENT_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_PRODUCTION_URL: z.string().default('https://ecard.immap.org'),
  NEXT_PUBLIC_MSAL_CLIENT_ID: z
    .string()
    .default('73c69515-fadf-479e-91fa-fdc2bcebfb9e'),
  NEXT_PUBLIC_MSAL_TENANT_ID: z
    .string()
    .default('f6f70f1b-2a2d-4f30-852a-64b8ce0c19d7'),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_DEVELOPMENT_URL: process.env.NEXT_PUBLIC_DEVELOPMENT_URL,
  NEXT_PUBLIC_PRODUCTION_URL: process.env.NEXT_PUBLIC_PRODUCTION_URL,
  NEXT_PUBLIC_MSAL_CLIENT_ID: process.env.NEXT_PUBLIC_MSAL_CLIENT_ID,
  NEXT_PUBLIC_MSAL_TENANT_ID: process.env.NEXT_PUBLIC_MSAL_TENANT_ID,
})

/** Canonical origin for links, MSAL redirect, Open Graph (dev vs prod). */
export const publicAppUrl =
  env.NODE_ENV === 'development'
    ? env.NEXT_PUBLIC_DEVELOPMENT_URL
    : env.NEXT_PUBLIC_PRODUCTION_URL
