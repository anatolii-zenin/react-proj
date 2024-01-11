import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { Button, Card, Container, Form } from "react-bootstrap"

function LoginComponent() {

    const [username, setUsername] = useState("")
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

    async function handleSubmit(e) {
        e.preventDefault()

        let authSuccessful = await authContext.logIn(username, password)

        console.log(authSuccessful)
        if(authSuccessful) {
            navigate(`/welcome/${username}`)
        }
        else {
            setAuthFailure(true)
        }
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ maxHeight: "50vh" }}
        >
            <div className="w-100" style={{ maxWidth: "40%" }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log in</h2>
                    {authFailure && <div className="AuthFailedMessage">Authorisation failed</div>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" value={username} onChange={onUserNameChange} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={onPasswordChange} required />
                        </Form.Group>
                        <Button className="w-100 mt-4" type="submit">Log in</Button>
                    </Form>
                </Card.Body>
            </Card>
            </div>
        </Container>
    )
}

export default LoginComponent