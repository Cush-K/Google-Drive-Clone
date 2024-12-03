import React, { createContext, useContext, useEffect } from 'react';
import useStore from './Store';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => { 
    const {user,setUser, loading, setLoading}=useStore()
    

    useEffect(() => {
        const fetchSession = async () => {
            try {
              const response = await fetch('/api/session', {
                method: 'GET',
                credentials: 'include',
              });
      
              if (response.ok) {
                const data = await response.json();
                setUser(data);
              } else {
                setUser(null);
              }
            } catch (error) {
              setUser(null);
            } finally {
              setLoading(false);
            }
          };
      
          fetchSession();
        }, [setUser, setLoading]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading ,setLoading}}>
            {children}
        </AuthContext.Provider>
    );
};



