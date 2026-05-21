import { createClient } from '@insforge/sdk';

// Initialize the InsForge BaaS client with the exact endpoints and anonymous credentials
export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
});
