import { Link } from "react-router-dom"
import { useAuth } from "../features/authentication/AuthContext"

function WelcomeComponent() {

    const authContext = useAuth()

    return (
        <div className="Welcome">
            <h1>Welcome {localStorage.getItem("currentUser")}</h1>
            {authContext.isAdmin && "You are logged in as an administrator."}
            <div>
                <Link to="/news">See news</Link>
            </div>
        </div>
    )
}

export default WelcomeComponent