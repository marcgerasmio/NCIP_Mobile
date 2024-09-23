import { FloatingLabel, Form, Button, Dropdown } from "react-bootstrap";
import { useState} from "react";
import supabase from './config/supabaseClient';
import { useNavigate } from "react-router-dom";

function Login() {
    const [name, setName] = useState('');
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee'); 
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();

        if (!name || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('name', name)
                .single();

            if (data && data.password === password && data.idnumber === id && data.role === role) {
                alert('Login successful');
                const verification = data.is_verified;
                sessionStorage.setItem('verification', verification);
                navigate("/check");
      
            } else {
                alert("INVALID CREDENTIALS");
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    return (
        <>
            <FloatingLabel label="Name" className="mb-2 mt-4">
                <Form.Control
                    type="name"
                    placeholder="name@example.com"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FloatingLabel>
            <FloatingLabel label="ID" className="mb-2 mt-4">
                <Form.Control
                    type="id"
                    placeholder="112345"
                    value={id}
                    onChange={(e) => setID(e.target.value)}
                />
            </FloatingLabel>
            <FloatingLabel label="Password" className="mb-2 mt-4">
                <Form.Control
                    type="password"
                    placeholder="*****"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>
            <div className="d-flex align-items-center">
                <Button onClick={login} className="me-2">LOGIN</Button>
                <Dropdown onSelect={(eventKey) => setRole(eventKey)}>
                    <Dropdown.Toggle variant="secondary">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
                        <Dropdown.Item eventKey="Employee">Employee</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    );
}

export default Login;
