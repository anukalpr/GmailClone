// import {useEffect} from 'react';
// import {auth} from '../../firebase/firebase'

// const AuthContext  = React.createContext();

// export function useAuth(){
//     return useContext(AuthContext);
    
// }
// export function AuthProvider({Children }){
//     const [currentUser, setCurrentuser] = useState(null);
//     const [userLoggedIn, setUserLoggedIn] = useState(false);
//     const [loading , setLoading] = useState(true);

//     useEffect(()=>{
//         const unsubscribe = onAuthStateChanged(auth ,initializeApp);
//         return unsubscribe;

//     },[]);
//     async function initializeApp(user){
//         if(user){
//             setCurrentuser(user),
//             setUserLoggedIn(true);
    
//         }else[
//             setCurrentuser(null),
//             setUserLoggedIn(false)
//         ]
//         setLoading(false);
//     }
//     const value = {
//         currentUser, 
//         userLoggedIn, 
//         loading
//     }
//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     )
// }
import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext); // Access the context
}

export function AuthProvider({ children }) { // Fix Children to children
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeApp);
        return unsubscribe;
    }, []);

    async function initializeApp(user) {
        if (user) {
            setCurrentUser(user);
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Fixed 'children' prop */}
        </AuthContext.Provider>
    );
}
