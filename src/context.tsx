import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const AppContext = createContext({
  accessToken: '',
  saveAccessToken: (val: string) => {
    val;
  },
  id: '',
  saveId: (val: string) => {
    val;
  },
  nickname: '',
  saveNickname: (val: string) => {
    val;
  },
  currency: '',
  saveCurrency: (val: string) => {
    val;
  },
  clear: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem('accessToken') || '',
  );
  const [id, setId] = useState<string>(localStorage.getItem('id') || '');
  const [nickname, setNickname] = useState<string>(
    localStorage.getItem('nickname') || '',
  );
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem('currency') || '',
  );

  const saveAccessToken = useCallback((newAccessToken: string) => {
    localStorage.setItem('accessToken', newAccessToken);
    setAccessToken(newAccessToken);
  }, []);

  const saveId = useCallback((newId: string) => {
    localStorage.setItem('id', newId);
    setId(newId);
  }, []);

  const saveNickname = useCallback((newNickname: string) => {
    localStorage.setItem('nickname', newNickname);
    setNickname(newNickname);
  }, []);

  const saveCurrency = useCallback((newCurrency: string) => {
    localStorage.setItem('currency', newCurrency);
    setCurrency(newCurrency);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('id');
    localStorage.removeItem('nickname');
    setAccessToken('');
    setId('');
    setNickname('');
  }, []);

  const providerValue = useMemo(
    () => ({
      accessToken,
      saveAccessToken,
      id,
      saveId,
      nickname,
      saveNickname,
      currency,
      saveCurrency,
      clear,
    }),
    [accessToken, id, nickname, currency],
  );

  return (
    <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AppContext);
}
