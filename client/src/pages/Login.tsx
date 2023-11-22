import { useContext, useState } from "react";
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";

export default function Login() {

    const { loginUser, loginError, loginInfo, updateLoginInfo, isLoginLoading } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        if (email && password) {
            const loginInfo = { email, password };
            updateLoginInfo!(loginInfo);
        };
    };


    return (
        <>
            <Form onSubmit={loginUser}>
                <Row style={{
                    height: '100vh',
                    justifyContent: 'center',
                    paddingTop: '10%'
                }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Login</h2>
                            <Form.Control type="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                            <Form.Control type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                            <Button variant="primary" type="submit" onClick={handleRegister} >
                                {isLoginLoading ? 'Logging In' : 'Login'}
                            </Button>
                            {
                                loginError?.message &&
                                <Alert variant="danger">
                                    <p>{loginError?.message}</p>
                                </Alert>
                            }
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
