import { Link } from "react-router-dom"
import { useAuth } from "../features/authentication/AuthContext"

function HeaderComponent() {

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated

    return (
        <header className="border-bottom border-light border-5 mb-5 p-2">
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">
                        <a className="navbar-brand ms-2 fs-2 fw-bold text-black" href="https://mjc.school/">MJC School</a>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav">
                                <li className="nav-item"><Link className="nav-link" to="/news">News</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                            </ul>
                        </div>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    {!isAuthenticated && <Link className="nav-link" to="/login">Log in</Link>}
                                </li>
                                <li className="nav-item">
                                    {isAuthenticated && <Link className="nav-link" to="/welcome">Signed in as: {authContext.currentUser}</Link>}
                                </li>
                                <li className="nav-item">
                                    {isAuthenticated && <Link className="nav-link" to="/logout" onClick={authContext.logOut}>Log out</Link>}
                                </li>
                                <li className="nav-item">
                                    {!isAuthenticated && <Link className="nav-link" to="/signup">Sign up</Link>}
                                </li>
                        </ul>
                    </nav>
                </div>                
            </div>
        </header>
    )
}

export default HeaderComponent