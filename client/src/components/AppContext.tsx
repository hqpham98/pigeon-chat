import { createContext } from 'react';
import { User, Auth } from '../lib/types';

type AppContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (auth: Auth) => void;
  handleSignOut: () => void;
};

export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
});
