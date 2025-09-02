declare global {
  interface Window {
    FrameworkIAA?: {
      fingerprint?: string;
    };
    nexusProspect?: {
      id: string;
    };
  }
}

export {};
