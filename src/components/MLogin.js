import { useState } from "react";
import supabase from "./config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaIdBadge } from "react-icons/fa";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import {
  FloatingLabel,
  Form,
  Button,
  Container,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import "../App.css";

function MLogin() {
  const [name, setName] = useState("");
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !password) {
      alert("Please enter both email and password.");
      return;
    }
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("idnumber", id)
        .single();
      if (
        data &&
        data.password === password &&
        data.idnumber === id &&
        data.role === role
      ) {
        alert("Login successful");
        const verification = data.is_verified;
        sessionStorage.setItem("verification", verification);
        const user_id = data.idnumber;
        sessionStorage.setItem("user_id", user_id);
        navigate("/check");
      } else {
        alert("INVALID CREDENTIALS");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
    setLoading(false);
  };

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmpassword) {
      alert("Password does not match");
      return;
    }
    if (!name || !password || !id) {
      alert("Please enter all required fields.");
      return;
    }
    try {
      const { error, data } = await supabase.from("users").insert([
        {
          idnumber: id,
          name,
          password,
          role,
          is_verified: "false",
        },
      ]);
      if (error) {
        if (error.status === 409) {
          alert("Conflict: A user with this ID already exists.");
        } else {
          alert("A user with this ID already exists.");
        }
        console.error("Error during registration:", error.message);
      } else {
        reg_user_details();
      }
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error("Error during registration:", error.message);
    }
    setLoading(false);
  };

  const reg_user_details = async (e) => {
    try {
      const { error, data } = await supabase.from("user_details").insert([
        {
          idnumber: id,
          name,
        },
      ]);
      if (error) {
        if (error.status === 409) {
          alert("Conflict: A user with this ID already exists.");
        } else {
          alert("A user with this ID already exists.");
        }
        console.error("Error during registration:", error.message);
      } else {
        alert("Registration Sucessful!");
        handleClose();
      }
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <>
      <Container className="p-3 text">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <img src="ncip-logo-2.png" alt="Logo 1" className="img-fluid" />
        </div>
        <Form>
          <InputGroup className="mb-2">
            <InputGroupText>
              <FaIdBadge />
            </InputGroupText>
            <FloatingLabel
              controlId="floatingInput"
              label="ID"
              value={id}
              onChange={(e) => setID(e.target.value)}
            >
              <Form.Control
                type="text"
                placeholder="name@example.com"
                autoComplete="off"
                required
              />
            </FloatingLabel>
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroupText>
              <FaUserAlt />
            </InputGroupText>
            <FloatingLabel
              controlId="floatingInput"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-autocomplete="off"
            >
              <Form.Control
                type="text"
                placeholder="name@example.com"
                autoComplete="off"
                required
              />
            </FloatingLabel>
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroupText>
              <RiLockPasswordFill />
            </InputGroupText>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
            </FloatingLabel>
          </InputGroup>
          <Form.Group className="mb-3 text-muted">
            <Form.Check
              type="checkbox"
              label="Show password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
          </Form.Group>
          <FloatingLabel controlId="floatingSelect" label="Login as:">
            <Form.Select
              aria-label="Floating label select example"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </Form.Select>
          </FloatingLabel>
          <Button
            variant="primary"
            className="w-100 fw-bold login-btn mt-3"
            onClick={login}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>
        </Form>
        <Container className="d-flex justify-content-center mt-4">
          <p>
            Don't have an account?{" "}
            <span className="register" onClick={handleShow}>
              Click here
            </span>
          </p>
        </Container>
      </Container>

      <Modal show={showModal} onHide={handleClose} className="text" centered>
        <Modal.Header closeButton>
          <Modal.Title className="font fw-bold">
            REGISTER AN ACCOUNT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <InputGroup className="mb-2">
              <InputGroupText>
                <FaIdBadge />
              </InputGroupText>
              <FloatingLabel
                controlId="floatingInput"
                label="ID"
                value={id}
                onChange={(e) => setID(e.target.value)}
              >
                <Form.Control
                  type="text"
                  placeholder="name@example.com"
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-2">
              <InputGroupText>
                <FaUserAlt />
              </InputGroupText>
              <FloatingLabel
                controlId="floatingInput"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              >
                <Form.Control
                  type="text"
                  placeholder="name@example.com"
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-2">
              <InputGroupText>
                <RiLockPasswordFill />
              </InputGroupText>
              <FloatingLabel
                controlId="floatingPassword"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              >
                <Form.Control
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-2">
              <InputGroupText>
                <RiLockPasswordFill />
              </InputGroupText>
              <FloatingLabel
                controlId="floatingPassword"
                label="Confirm password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              >
                <Form.Control
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
            </InputGroup>
            <Form.Group className="mb-3 text-muted">
              <Form.Check
                type="checkbox"
                label="Show password"
                checked={showPass}
                onChange={() => setShowPass(!showPass)}
              />
            </Form.Group>
            <FloatingLabel controlId="floatingSelect" label="Register as:">
              <Form.Select
                aria-label="Floating label select example"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </Form.Select>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            className="w-100 fw-bold login-btn"
            variant="primary"
            onClick={register}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Register"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MLogin;
