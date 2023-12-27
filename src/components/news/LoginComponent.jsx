import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./security/AuthContext"

function LoginComponent() {

    const [username, setUsername] = useState("admin")
    const [password, setPassword] = useState("")
    const [authFailure, setAuthFailure] = useState(false)
    const navigate = useNavigate()
    const authContext = useAuth()

    
    function onUserNameChange(event) {
        setUsername(event.target.value)
    }

    function onPasswordChange(event) {
        setPassword(event.target.value)
    }

    function handleSubmit() {
        if(authContext.logIn(username, password)) {
            navigate(`/welcome/${username}`)
        }
        else {
            setAuthFailure(true)
        }
    }

    return (
        <div className="Login">
            <div className="LoginForm">
                {authFailure && <div className="AuthFailedMessage">Authorisation failed</div>}
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={username} onChange={onUserNameChange}/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={password} onChange={onPasswordChange} />
                </div>
                <div>
                    <button type="button" name = "login" 
                        onClick={handleSubmit}
                    >Log in</button>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent