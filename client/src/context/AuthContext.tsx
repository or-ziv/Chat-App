import { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { baseUrl, postRequest } from '../utils/services';

type AuthContextProviderProps = {
    children: ReactNode;
}

type User = {
    name: string,
    email: string,
    password: string,
    _id: string
};


type UserLogin = {
    email: string,
    password: string
}

type AuthContextType = {
    user?: User | null,

    registerInfo?: object,
    updateRegisterInfo?: ((info: object) => void) | null,
    registerUser?: (e: any) => void,
    registerError?: Error | null,
    isRegisterLoading?: boolean,

    loginInfo?: UserLogin,
    updateLoginInfo?: ((info: UserLogin) => void) | null,
    loginUser?: (e: any) => void,
    loginError?: Error | null,
    isLoginLoading?: boolean,

    logoutUser?: () => void
};

export const AuthContext = createContext<AuthContextType>({});





export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const [registerError, setRegisterError] = useState(null)
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState<object>({});

    const [loginError, setLoginError] = useState(null)
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState<UserLogin>({} as UserLogin);


    useEffect(() => {
        const userFromStorage = (localStorage.getItem('User'));
        if (userFromStorage)
            setUser(JSON.parse(userFromStorage));
    }, [])

    // updating the info from the register page given by the user.
    const updateRegisterInfo = useCallback((info: object) => {
        setRegisterInfo(info);
    }, []);

    // updating the info from the login page given by the user.
    const updateLoginInfo = useCallback((info: UserLogin) => {
        setLoginInfo(info);
    }, []);


    // Checks with the server if the information is valid and if so, register successfully.
    const registerUser = useCallback(async (e: any) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/users/register`, registerInfo);
        setIsRegisterLoading(false);

        if (response.error)
            return setRegisterError(response);


        localStorage.setItem('User', JSON.stringify(response));
        setUser(response);

    }, [registerInfo])



    // Checks with the server if the information is valid and if so, Login successfully.
    const loginUser = useCallback(async (e: any) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/users/login`, loginInfo);
        setIsLoginLoading(false);

        if (response.error) {
            return setLoginError(response);
        }

        localStorage.setItem('User', JSON.stringify(response));
        setUser(response);

    }, [loginInfo])



    // Handles logout.
    const logoutUser = useCallback(() => {
        localStorage.removeItem('User');
        setUser(null);
    }, [])


    return (
        <AuthContext.Provider value={{
            user,

            registerInfo,
            updateRegisterInfo,
            registerUser,
            registerError,
            isRegisterLoading,

            loginInfo,
            updateLoginInfo,
            loginUser,
            loginError,
            isLoginLoading,

            logoutUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
