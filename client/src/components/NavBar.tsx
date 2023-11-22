import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import Notification from '../components/Notification'

export default function NavBar() {

    const { user, logoutUser } = useContext(AuthContext);

    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to={"/"} className="link-light text-decoration-none">ChatApp</Link>
                </h2>
                {
                    user ? <span className="text-warning">Logged in as {user?.name}</span> : null
                }
                <Nav>
                    <Stack direction="horizontal" gap={3}>
                        <Notification />
                        {
                            user ? (
                                <Link onClick={() => { logoutUser!() }} to={"/logout"} className="link-light text-decoration-none">Logout</Link>
                            ) : null
                        }
                        {
                            !user ? (
                                <>
                                    <Link to={"/login"} className="link-light text-decoration-none">Login</Link>
                                    <Link to={"/register"} className="link-light text-decoration-none">Register</Link>
                                </>
                            ) : null
                        }
                    </Stack>
                </Nav>
            </Container>
        </Navbar >
    )
}
