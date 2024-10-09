import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCircleXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { Button, Container } from "react-bootstrap";

function VerificationCheck() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/mlogin");
  };
  const next = () => {
    navigate("/mform");
  };

  return (
    <>
      {sessionStorage.getItem("verification") === "false" && (
        <Container
          className="d-flex flex-column justify-content-center align-items-center text"
          style={{ height: "90vh" }}
        >
          <FaCircleXmark size={60} color="red" />
          <h2 className="fw-bold mt-2">Account not verified!</h2>
          <h6 className="fw-bold mt-1 text-muted">
            *For verification, contact admin
          </h6>
          <Button onClick={logout} className="fw-bold w-100 login-btn mt-3">
            Exit
          </Button>
        </Container>
      )}
      {sessionStorage.getItem("verification") === "true" && (
        <Container
          className="d-flex flex-column justify-content-center align-items-center text"
          style={{ height: "90vh" }}
        >
          <FaCheckCircle size={60} color="green" />
          <h2 className="fw-bold mt-2">Account Verified!</h2>
          <Button onClick={next} className="fw-bold w-100 login-btn mt-3">
            Continue
          </Button>
        </Container>
      )}
    </>
  );
}

export default VerificationCheck;
