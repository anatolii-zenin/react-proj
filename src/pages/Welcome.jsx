import { Link, useParams } from "react-router-dom"

function WelcomeComponent() {

    const {username} = useParams()

    return (
        <div className="WelcomeComponent">
            <h1>Welcome {username}</h1>
            <div>
                <Link to="/">See news</Link>
            </div>
        </div>
    )
}

export default WelcomeComponent