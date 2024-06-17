import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('user');
        const userToken = JSON.parse(tokenString);
        return userToken?.access
    };
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        const userTokenLength = Object.keys(userToken).length;
        if(userTokenLength === 1) {
            const user = JSON.parse(localStorage.getItem('user'));
            user['access'] = userToken?.access;
            localStorage.setItem('user', JSON.stringify(user));
            setToken(userToken.access);
        } else {
            localStorage.setItem('user', JSON.stringify(userToken));
            setToken(userToken.access);
        }
    };

    return {
        setToken: saveToken,
        token
    }
}