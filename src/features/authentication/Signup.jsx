import { useRef } from "react"
import { Button, Card, Container, Form } from "react-bootstrap"

function SignupComponent() {

    const usernameRef = useRef()
    const passwordRef = useRef()

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ maxHeight: "50vh" }}
        >
            <div className="w-100" style={{ maxWidth: "40%" }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <Form>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" ref={usernameRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Button className="w-100 mt-4" type="submit">Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
            </div>
        </Container>
    )
}

export default SignupComponent