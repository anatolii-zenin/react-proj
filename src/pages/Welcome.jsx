import { Link, useParams } from "react-router-dom"
import { useAuth } from "../features/authentication/AuthContext"

function WelcomeComponent() {

    const authContext = useAuth()

    console.log(authContext)
    return (
        <div className="Welcome">
            <h1>Welcome {authContext.currentUser}</h1>
            {authContext.isAdmin && "You are logged in as an administrator."}
            <div>
                <Link to="/news">See news</Link>
            </div>
        </div>
    )
}

export default WelcomeComponent