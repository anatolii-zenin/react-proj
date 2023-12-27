import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./NewsApp.css"
import AboutComponent from "./AboutComponent"
import SignupComponent from "./SignupComponent"
import LogoutComponent from "./LogoutComponent"
import FooterComponent from "./FooterComponent"
import HeaderComponent from "./HeaderComponent"
import NewsListComponent from "./NewsListComponent"
import WelcomeComponent from "./WelcomeComponent"
import ErrorComponent from "./ErrorComponent"
import LoginComponent from "./LoginComponent"
import AuthProvider, { useAuth } from "./security/AuthContext"
import ManageNewsComponent from "./ManageNews"

function AuthenticatedRoute({children}) {
    const authContext = useAuth()
    if(authContext.isAuthenticated) {
        return children
    }
    
    return <Navigate to="/login" />
}

function AnonymousRoute({children}) {
    const authContext = useAuth()
    if(!authContext.isAuthenticated) {
        return children
    }
    
    return <Navigate to="/" />
}

export default function NewsApp() {
    return (
        <div className="NewsApp">
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent />
                    <Routes>
                        <Route path="/login" element={ <LoginComponent /> } />
                        <Route path="/welcome/:username" element={ 
                            <AuthenticatedRoute>
                                <WelcomeComponent />
                            </AuthenticatedRoute> } />
                        <Route path="*" element={ <ErrorComponent /> } />
                        <Route path="/" element={ <NewsListComponent /> } />
                        <Route path="/logout" element={ 
                            <AuthenticatedRoute>
                                <LogoutComponent />
                            </AuthenticatedRoute> } />
                        <Route path="/signup" element={ 
                            <AnonymousRoute>
                                <SignupComponent />
                            </AnonymousRoute> } />
                        <Route path="/about" element={ <AboutComponent /> } />
                        <Route path="/manage" element={ 
                            <AuthenticatedRoute> 
                                <ManageNewsComponent /> 
                            </AuthenticatedRoute>} />
                    </Routes>
                    <FooterComponent />
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}