import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';

import { SignInReq } from '@/api/services/userService';
import tobaccoService from '@/api/services/tobaccoService';
import { getItem, removeItem, setItem } from '@/utils/storage';

import { UserInfo, UserToken } from '#/entity';
import { StorageEnum } from '#/enum';
import { DEFAULT_USER } from '@/_mock/assets'
// import useLocale, { LANGUAGE_MAP } from '@/locales/useLocale';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;
// const { setLocale } = useLocale();
type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: UserToken) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>((set) => ({
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<UserToken>(StorageEnum.Token) || {},
  actions: {
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: {} });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
    },
  },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
  const navigatge = useNavigate();
  const { message } = App.useApp();
  const { setUserToken, setUserInfo } = useUserActions();

  const signInMutation = useMutation({
    // mutationFn: userService.signin,
    mutationFn: tobaccoService.login
  });

  const signIn = async (data: SignInReq) => {
    try {
      const res = await signInMutation.mutateAsync(data);
      // debugger
      // const { user, accessToken, refreshToken } = res;
      // setUserToken({ accessToken, refreshToken });
      // setUserInfo(user);
      // setLocale('zh_CN')
      const accessToken = res
      setUserToken({
        accessToken
        // ,refreshToken:accessToken
      })
      setUserInfo({ ...DEFAULT_USER, username: data.userName })
      navigatge(HOMEPAGE, { replace: true });
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  return signIn;
};

export default useUserStore;
