import { createContext, useContext, useEffect, useState } from "react"
import { getJWT } from "../api/AuthApi"
import { jwtDecode } from "jwt-decode"
import { filterAuthors } from "../api/NewsApi"

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

function AuthProvider({children}) {
    const [isAuthenticated, setAuthenticated] = useState()
    const [isAdmin, setAdmin] = useState(false)
    const [currentUser, setCurrentUser] = useState()
    const [userRoles, setUserRoles] = useState()
    const [authorId, setAuthorId] = useState()
    const [jwt, setJwt] = useState()

    async function logIn(username, password) {
        let jwt_local
        try {
            jwt_local = await getJWT(username, password)
            const decoded = jwtDecode(jwt_local?.data.token)
            setCurrentUser(decoded.sub)
            setUserRoles(decoded.roles)
            setAuthenticated(true)
            setJwt(jwt_local?.data.token)
            if (decoded.roles.find(x => x === "ROLE_ADMIN") === "ROLE_ADMIN")
                setAdmin(true)
            setAuthorId(await getAuthorId(decoded.sub))
        }
        catch (err) {
            console.error(err)
        }
        if (jwt_local != null && jwt_local != undefined)
            return true
    }

    function logOut() {
        setAuthenticated(false)
        setJwt(null)
        setCurrentUser(null)
        setUserRoles(null)
        setAuthorId(null)
        setAdmin(false)
    }

    useEffect(() => {

    }, [])

    return (
        <AuthContext.Provider value={ 
            {
                isAuthenticated, jwt, userRoles, currentUser, authorId, isAdmin, logIn, logOut
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