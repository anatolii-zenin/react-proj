import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./NewsApp.css"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import AuthProvider, { useAuth } from "../authentication/AuthContext"
import HeaderComponent from "../../pages/Header"
import LoginComponent from "../authentication/Login"
import LogoutComponent from "../authentication/Logout"
import ErrorComponent from "../components/Error"
import News from "./NewsList"
import ManageUsersComponent from "../components/ManageUsers"
import WelcomeComponent from "../../pages/Welcome"
import SignupComponent from "../authentication/Signup"
import AboutComponent from "../../pages/About"
import FooterComponent from "../../pages/Footer"


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

const queryClient = new QueryClient()

export default function NewsApp() {
    return (
        <div className="NewsApp">
            <QueryClientProvider client={queryClient}>
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
                            <Route path="/" element={ <News /> } />
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
                                    <ManageUsersComponent /> 
                                </AuthenticatedRoute>} />
                        </Routes>
                        <FooterComponent />
                    </BrowserRouter>
                </AuthProvider>
            </QueryClientProvider>
        </div>
    )
}