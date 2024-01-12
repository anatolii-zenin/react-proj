import { useRef, useState } from "react"
import { Alert, Button, Card, Container, Form } from "react-bootstrap"
import { signUp } from "../api/AuthApi"

function SignupComponent() {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const usernameRef = useRef()
    const passwordRef = useRef()

    async function handleSubmit(e) {
        e.preventDefault()
        try{
            setError("")
            validateInputs()
            setLoading(true)
            await signUp(usernameRef.current.value, passwordRef.current.value)
            setSuccess(true)
        } catch (err) {
            setError(err.response.data.message)
            console.error(err.response)
            setLoading(false)
            return false
        }
        setLoading(false)
    }

    function validateInputs() {
        if (usernameRef.current.value.length < 3)
            throw new Error("Username should be longer than 3 symbols")
        if (passwordRef.current.value.length < 3)
            throw new Error("Password should be longer than 3 symbols")
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ maxHeight: "50vh" }}
        >
            <div className="w-100" style={{ maxWidth: "40%" }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error != "" && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Sign-up successful</Alert>}
                    {!success &&
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" ref={usernameRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Button className="w-100 mt-4" type="submit" disabled={loading}>Sign Up</Button>
                        </Form>
                    }
                </Card.Body>
            </Card>
            </div>
        </Container>
    )
}

export default SignupComponent

