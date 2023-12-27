import { createContext, useContext, useState } from "react";

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

function AuthProvider({children}) {
    const [isAuthenticated, setAuthenticated] = useState(false)

    function logIn(username, password) {
        if(username==="admin" && password==="admin") {
            setAuthenticated(true)
            return true
        }
        else {
            return false
        }
    }

    function logOut() {
        setAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={ {isAuthenticated, logIn, logOut} }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider