export interface GoogleCredentialResponse {
  credential: string;
}

export interface GoogleAccounts {
  id: {
    initialize(config: {
      client_id: string;
      callback: (response: GoogleCredentialResponse) => void;
    }): void;
    prompt(): void;
  };
}

export interface WindowWithGoogle extends Window {
  google?: {
    accounts: GoogleAccounts;
  };
}
