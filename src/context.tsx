import {
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

export type User = {
  id: string;
  nickname?: string;
  email: string;
  currency: string;
  stripeAccountId: string;
  stripeVerified: boolean;
  banned: boolean;
  payouts: number;
  ratings: number[];
  createdAt: Date;
  updatedAt: Date;
};

const defaultUser: User = {
  id: '',
  email: '',
  currency: '',
  stripeAccountId: '',
  stripeVerified: false,
  banned: false,
  payouts: 0,
  ratings: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const AppContext = createContext({
  accessToken: '',
  saveAccessToken: (val: string) => {
    val;
  },
  user: defaultUser,
  saveUser: (val: User) => {
    val;
  },
  clear: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem('accessToken') || '',
  );
  const [user, setUser] = useState<User>(
    JSON.parse(localStorage.getItem('user') || JSON.stringify(defaultUser)),
  );

  const saveAccessToken = useCallback((newAccessToken: string) => {
    localStorage.setItem('accessToken', newAccessToken);
    setAccessToken(newAccessToken);
  }, []);

  const saveUser = useCallback((user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken('');
    setUser(defaultUser);
  }, []);

  const providerValue = useMemo(
    () => ({
      accessToken,
      saveAccessToken,
      user,
      saveUser,
      clear,
    }),
    [accessToken, user],
  );

  return (
    <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>
  );
};
