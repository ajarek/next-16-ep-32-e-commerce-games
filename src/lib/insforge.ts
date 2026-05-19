import { createClient } from '@insforge/sdk';

// Initialize the InsForge BaaS client with the exact endpoints and anonymous credentials
export const insforge = createClient({
  baseUrl: 'https://vwds69d5.eu-central.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTk5OTh9.tbxb-TZBsjdy9kf3KUp5wzJP_ZYwElJ2IKG2Df0v-zc'
});
