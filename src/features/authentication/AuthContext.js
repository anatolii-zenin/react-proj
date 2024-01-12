import { createContext, useContext, useEffect, useState } from "react"
import { getJWT } from "../api/AuthApi"
import { jwtDecode } from "jwt-decode"
import { filterAuthors } from "../api/NewsApi"

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

function AuthProvider({children}) {
    const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true")

    async function logIn(username, password) {
        let jwt_local
        try {
            jwt_local = await getJWT(username, password)
            const decoded = jwtDecode(jwt_local?.data.token)
            localStorage.setItem("currentUser", decoded.sub)
            localStorage.setItem("userRoles", decoded.roles)
            localStorage.setItem("isAuthenticated", true)
            localStorage.setItem("jwt", jwt_local?.data.token)
            if (decoded.roles.find(x => x === "ROLE_ADMIN") === "ROLE_ADMIN")
                localStorage.setItem("isAdmin", true)
            localStorage.setItem("authorId", await getAuthorId(decoded.sub))
            setAuthenticated(true)
        }
        catch (err) {
            console.error(err)
        }
        if (jwt_local != null && jwt_local != undefined)
            return true
    }

    function logOut() {
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("jwt")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("userRoles")
        localStorage.removeItem("authorId")
        localStorage.removeItem("isAdmin")
        setAuthenticated(false)
    }
    
    return (
        <AuthContext.Provider value={ 
            {
                logIn, logOut
            } 
        }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

async function getAuthorId(name) {
    let nameFilter = [
        {
            column: "name",
            operation: "EQUAL",
            value: name
        }
    ]
    return (await filterAuthors(1, 1, nameFilter))?.data.content[0].id
}