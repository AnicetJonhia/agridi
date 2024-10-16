// src/types/react-i18next.d.ts
import 'react-i18next';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      common: {
        welcome: string;
        description: string;

      };
    };
  }
}
