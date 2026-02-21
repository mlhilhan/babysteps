import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

type AuthUser = Auth.User;

type UseAuthOptions = {
  autoFetch?: boolean;
};

function apiUserToAuthUser(apiUser: Api.ApiUser): AuthUser {
  return {
    id: apiUser.id,
    openId: apiUser.openId,
    name: apiUser.name,
    email: apiUser.email,
    loginMethod: apiUser.loginMethod,
    lastSignedIn: new Date(apiUser.lastSignedIn),
  };
}

export function useAuth(options?: UseAuthOptions) {
  const { autoFetch = true } = options ?? {};
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const doGetMe = async (): Promise<Api.ApiUser | null> => {
        return Api.getMe();
      };

      if (Platform.OS === "web") {
        let apiUser = await doGetMe();
        if (!apiUser) {
          const refreshed = await Api.refreshToken();
          if (refreshed) {
            await Auth.setSessionToken(refreshed.token);
            await Auth.setUserInfo(apiUserToAuthUser(refreshed.user));
            apiUser = refreshed.user;
          }
        }
        if (apiUser) {
          const userInfo = apiUserToAuthUser(apiUser);
          setUser(userInfo);
          await Auth.setUserInfo(userInfo);
        } else {
          setUser(null);
          await Auth.clearUserInfo();
        }
        return;
      }

      const sessionToken = await Auth.getSessionToken();
      if (!sessionToken) {
        setUser(null);
        return;
      }

      const cachedUser = await Auth.getUserInfo();
      if (cachedUser) {
        setUser(cachedUser);
      }

      let apiUser = await doGetMe();
      if (!apiUser) {
        const refreshed = await Api.refreshToken();
        if (refreshed) {
          await Auth.setSessionToken(refreshed.token);
          const userInfo = apiUserToAuthUser(refreshed.user);
          await Auth.setUserInfo(userInfo);
          setUser(userInfo);
          return;
        }
        setUser(null);
      } else {
        const userInfo = apiUserToAuthUser(apiUser);
        setUser(userInfo);
        await Auth.setUserInfo(userInfo);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      try {
        setError(null);
        const { token, user: apiUser } = await Api.login(email, password);
        await Auth.setSessionToken(token);
        const userInfo = apiUserToAuthUser(apiUser);
        await Auth.setUserInfo(userInfo);
        setUser(userInfo);
        return {};
      } catch (err) {
        const message = err instanceof Error ? err.message : "Giriş başarısız";
        setError(err instanceof Error ? err : new Error(message));
        return { error: message };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name?: string,
    ): Promise<{ error?: string }> => {
      try {
        setError(null);
        const { token, user: apiUser } = await Api.register(email, password, name);
        await Auth.setSessionToken(token);
        const userInfo = apiUserToAuthUser(apiUser);
        await Auth.setUserInfo(userInfo);
        setUser(userInfo);
        return {};
      } catch (err) {
        const message = err instanceof Error ? err.message : "Kayıt başarısız";
        setError(err instanceof Error ? err : new Error(message));
        return { error: message };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await Api.logout();
    } catch {
      // Continue with local logout
    } finally {
      await Auth.removeSessionToken();
      await Auth.clearUserInfo();
      setUser(null);
      setError(null);
    }
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    if (autoFetch) {
      if (Platform.OS === "web") {
        fetchUser();
      } else {
        Auth.getUserInfo().then((cachedUser) => {
          if (cachedUser) {
            setUser(cachedUser);
            setLoading(false);
          } else {
            fetchUser();
          }
        });
      }
    } else {
      setLoading(false);
    }
  }, [autoFetch, fetchUser]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    refresh: fetchUser,
    login,
    register,
    logout,
  };
}
