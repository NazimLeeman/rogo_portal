export interface UserIdentity {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
  }
  
  export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at?: string;
    phone: string;
    last_sign_in_at?: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    identities: UserIdentity[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
  }
  
  export interface Session {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at?: number;
    refresh_token: string;
    user: User;
  }
  
  export interface SupabaseResponse {
    data: {
        session: Session | null;
    };
    error: {
        message: string;
      } | null;
  }