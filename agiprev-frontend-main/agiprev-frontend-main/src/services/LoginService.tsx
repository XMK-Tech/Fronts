import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ENABLE_MIDDLEWARE } from '../environment';
import { showToast } from '../utils/showToast';
import Api, { getApi, getResp, Middleware } from './Api';
import { removeSessionStorage, useSessionStorage } from './SessionStorage';

export type UserData = {
  token: string;
  personId: string;
  permissions: {
    id: string;
    permissionName: string;
    description: string;
  }[];
  userId: string;
  onBoarding: boolean;
  entity?: string;
  year?: string;
};

type UserContextType = {
  user: UserData | undefined;
  setUser: (user: UserData) => void;
  logoff: () => void;
};

const defaultUserData: UserData | undefined = undefined;
//TODO: Add other user fields
const UserContext = React.createContext<UserContextType>({
  user: defaultUserData,
  setUser: () => {},
  logoff: () => {},
});
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useSessionStorage<UserData | undefined>(
    'userData',
    defaultUserData
  );
  const logoff = () => {
    removeSessionStorage('userData');
    setUser(undefined);
    //TODO: adjust and remove reload
    window.location.reload();
  };
  return (
    <UserContext.Provider value={{ user: user ?? undefined, setUser, logoff }}>
      {children}
    </UserContext.Provider>
  );
}
function useUser() {
  return React.useContext(UserContext);
}

export function useLogoff() {
  const { logoff } = useUser();
  return logoff;
}

export function useUserData() {
  const { user } = useUser();
  return user;
}

export function useSetUserData() {
  const { setUser } = useUser();
  return setUser;
}

export default function useLogin() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  const { mutate, isLoading } = useMutation(postLogin, {
    onSuccess: (data) => {
      //TODO: Invalidate user-data query
      if (data.onBoarding) {
        showToast({
          toast,
          status: 'info',
          title: 'Atenção',
          description:
            'Para completar seu cadastro e conseguir acessar seu perfil acesse a parte de onboarding',
          duration: 30000,
        });
      }
      setUser(data);
      navigate('/dashboard');
      return data;
    },
  });
  return {
    login: mutate,
    isLoading,
    user,
  };
}

export function useGoogleLogin() {
  const { user, setUser } = useUser();
  const { mutate, isLoading } = useMutation(googleLogin, {
    onSuccess: (data) => {
      //TODO: Invalidate user-data query
      setUser(data);
      return data;
    },
  });
  return {
    login: mutate,
    isLoading,
    user,
  };
}

type LoginResponse = {
  token: string;
  personId: string;
  permissions: {
    id: string;
    permissionName: string;
    description: string;
  }[];
  userId: string;
  onBoarding: boolean;
  entity?: string;
  year?: string;
};

type LoginMiddlewareResponse = {
  token: string;
  entities: string[];
  franchises: string[];
  permissions: {
    id: string;
    permissionName: string;
    description: string;
  }[];
};

async function postLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  if (ENABLE_MIDDLEWARE) {
    return await loginMiddleware(email, password);
  }
  return await Api.post(`/user/login`, {
    username: email,
    password,
  }).then(getResp<LoginResponse>);
}

export async function postLoginIcp(): Promise<LoginResponse> {
  return await Api.post(`/user/login-icp`).then(getResp<LoginResponse>);
}

async function loginMiddleware(
  username: string,
  password: string
): Promise<LoginResponse> {
  const middlewareResp = await Middleware.post(`/user/login`, {
    username,
    password,
  }).then(getResp<LoginMiddlewareResponse>);
  //pedir rota para dados de login
  //TODO: Buscar person id e user id da API e tratar usuário sem entidade
  return {
    onBoarding: false,
    permissions: middlewareResp.permissions,
    personId: '',
    token: middlewareResp.token,
    userId: '',
    entity: middlewareResp.entities[0],
    year: '2023',
  };
}

export function postRecoverPassword({
  email,
  isFirstAccess,
}: {
  email: string;
  isFirstAccess: boolean;
}) {
  if (ENABLE_MIDDLEWARE)
    if (isFirstAccess) {
      return Middleware.post('/user/validate-agiprev', {
        email,
      });
    } else
      return Middleware.post('/user/recover-password', {
        email,
      });
  else
    return Api.post('user/recover-password', {
      email,
    });
}

export function postSetPassword({
  password,
  username,
  setPasswordToken,
}: {
  password: string;
  username: string;
  setPasswordToken: string;
}) {
  if (ENABLE_MIDDLEWARE)
    return Middleware.post('/user/set-password', {
      password,
      email: username,
      setPasswordToken,
    });
  else
    return Api.post('user/set-password', {
      password,
      username,
      setPasswordToken,
    });
}

export function postInsertUser({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  if (ENABLE_MIDDLEWARE)
    return Middleware.post('/user/insert-user-onboarding', {
      username,
      email,
      password,
    });
  else
    return Api.post('user/insert-user-onboarding', {
      username,
      email,
      password,
    });
}

function googleLogin({ code }: { code: string }) {
  return getApi()
    .get('/Google/login', {
      params: {
        code,
      },
    })
    .then(getResp<LoginResponse>);
}
