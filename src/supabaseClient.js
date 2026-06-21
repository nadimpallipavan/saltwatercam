import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabase = null;
if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// ----------------------------------------------------
// Cryptographic Password Hashing Helpers (Web Crypto API)
// ----------------------------------------------------
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const pwKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    pwKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["exportKey"]
  );
  
  const exported = await crypto.subtle.exportKey("raw", derivedKey);
  const hashArray = new Uint8Array(exported);
  
  // Convert binary to Base64 safely
  let binary = '';
  const len = hashArray.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(hashArray[i]);
  }
  return btoa(binary);
}

// ----------------------------------------------------
// Local Client-Side Cryptographic Auth Fallback (Option 3)
// ----------------------------------------------------
const listeners = new Set();

const localAuth = {
  async signUp(username, password, avatar) {
    try {
      const users = JSON.parse(localStorage.getItem('swc_local_users') || '{}');
      const userKey = username.toLowerCase().trim();
      
      if (users[userKey]) {
        return { data: null, error: { message: 'Username is already taken.' } };
      }

      // Generate a cryptographically secure random salt
      const saltBuffer = crypto.getRandomValues(new Uint8Array(16));
      let saltBinary = '';
      for (let i = 0; i < saltBuffer.length; i++) {
        saltBinary += String.fromCharCode(saltBuffer[i]);
      }
      const salt = btoa(saltBinary);

      // Securely hash the password with PBKDF2
      const passwordHash = await hashPassword(password, salt);

      // Save user profile metadata
      users[userKey] = {
        username: username.trim(),
        avatar,
        salt,
        passwordHash
      };
      localStorage.setItem('swc_local_users', JSON.stringify(users));

      const sessionUser = {
        username: username.trim(),
        avatar,
        id: `local-${userKey}`
      };
      
      localStorage.setItem('swc_local_session', JSON.stringify(sessionUser));
      notifyListeners(sessionUser);

      return { data: { user: sessionUser }, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message || 'Error creating profile.' } };
    }
  },

  async signIn(username, password) {
    try {
      const users = JSON.parse(localStorage.getItem('swc_local_users') || '{}');
      const userKey = username.toLowerCase().trim();
      const user = users[userKey];

      if (!user) {
        return { data: null, error: { message: 'Invalid username or password.' } };
      }

      // Hash input password using the stored salt to verify
      const testHash = await hashPassword(password, user.salt);

      if (testHash !== user.passwordHash) {
        return { data: null, error: { message: 'Invalid username or password.' } };
      }

      const sessionUser = {
        username: user.username,
        avatar: user.avatar,
        id: `local-${userKey}`
      };

      localStorage.setItem('swc_local_session', JSON.stringify(sessionUser));
      notifyListeners(sessionUser);

      return { data: { user: sessionUser }, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message || 'Error signing in.' } };
    }
  },

  async signOut() {
    localStorage.removeItem('swc_local_session');
    notifyListeners(null);
    return { error: null };
  },

  async getSessionUser() {
    const saved = localStorage.getItem('swc_local_session');
    return saved ? JSON.parse(saved) : null;
  },

  onAuthStateChange(callback) {
    listeners.add(callback);
    // Trigger callback with initial session if it exists
    const current = localStorage.getItem('swc_local_session');
    callback(current ? JSON.parse(current) : null);
    
    return () => {
      listeners.delete(callback);
    };
  }
};

function notifyListeners(user) {
  for (const listener of listeners) {
    listener(user);
  }
}

// ----------------------------------------------------
// Unified Authentication Service (Adaptive Interface)
// ----------------------------------------------------
export const authService = {
  isSupabaseConfigured,
  
  async signUp(username, password, avatar = '🐢') {
    if (isSupabaseConfigured) {
      // Format a placeholder email using the username to keep signup forms clean (no extra email fields required)
      const email = `${username.toLowerCase().replace(/\s+/g, '')}@saltwatercam.local`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar
          }
        }
      });
      if (error) return { data: null, error };
      
      const formattedUser = {
        username: data.user.user_metadata.username || username,
        avatar: data.user.user_metadata.avatar || avatar,
        id: data.user.id
      };
      return { data: { user: formattedUser }, error: null };
    } else {
      return await localAuth.signUp(username, password, avatar);
    }
  },

  async signIn(username, password) {
    if (isSupabaseConfigured) {
      const email = `${username.toLowerCase().replace(/\s+/g, '')}@saltwatercam.local`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) return { data: null, error };

      const formattedUser = {
        username: data.user.user_metadata.username || username,
        avatar: data.user.user_metadata.avatar || '🐢',
        id: data.user.id
      };
      return { data: { user: formattedUser }, error: null };
    } else {
      return await localAuth.signIn(username, password);
    }
  },

  async signOut() {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      return { error };
    } else {
      return await localAuth.signOut();
    }
  },

  async getSessionUser() {
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      const user = session.user;
      return {
        username: user.user_metadata.username || user.email.split('@')[0],
        avatar: user.user_metadata.avatar || '🐢',
        id: user.id
      };
    } else {
      return await localAuth.getSessionUser();
    }
  },

  onAuthStateChange(callback) {
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          const user = session.user;
          callback({
            username: user.user_metadata.username || user.email.split('@')[0],
            avatar: user.user_metadata.avatar || '🐢',
            id: user.id
          });
        } else {
          callback(null);
        }
      });
      return () => subscription.unsubscribe();
    } else {
      return localAuth.onAuthStateChange(callback);
    }
  }
};
