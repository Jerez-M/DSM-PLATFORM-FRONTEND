import {createContext, useState} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState({});
    const [meetingName, setMeetingName] = useState('');

    return (
        <AuthContext.Provider value={{ token, meetingName, setMeetingName, setToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;