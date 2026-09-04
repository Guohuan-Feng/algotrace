import { createClient, type User } from "@supabase/supabase-js";
import { createProgressRepository, unavailableProgressRepository } from "./progressRepository";
import type { ProgressAuth, ProgressUser } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function toProgressUser(user: User): ProgressUser {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata.full_name ?? user.user_metadata.name,
    avatarUrl: user.user_metadata.avatar_url ?? user.user_metadata.picture,
  };
}

const unavailableProgressAuth: ProgressAuth = {
  configured: false,
  async getUser() {
    return null;
  },
  onUserChange() {
    return () => undefined;
  },
  async signInWithGoogle() {
    throw new Error("Google sign-in is not configured yet.");
  },
  async signOut() {
    return undefined;
  },
};

export const progressAuth: ProgressAuth = supabase
  ? {
      configured: true,
      async getUser() {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        return data.session?.user ? toProgressUser(data.session.user) : null;
      },
      onUserChange(listener) {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          listener(session?.user ? toProgressUser(session.user) : null);
        });
        return () => data.subscription.unsubscribe();
      },
      async signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
        });
        if (error) {
          throw error;
        }
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      },
    }
  : unavailableProgressAuth;

export const progressRepository = supabase
  ? createProgressRepository(supabase)
  : unavailableProgressRepository;
