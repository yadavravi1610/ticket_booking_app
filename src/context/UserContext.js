import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth } from 'firebase/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const auth = getAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [auth]);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
