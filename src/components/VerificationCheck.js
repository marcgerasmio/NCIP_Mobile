import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCircleXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from 'react-bootstrap';

function VerificationCheck() {
  const navigate = useNavigate();

  
  const logout = () => {
    navigate("/mlogin");
  }
  const next = () => {
    navigate("/mform");
  }

  
  return (
    <>
      {sessionStorage.getItem('verification') === 'false' && (
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <FaCircleXmark size={50} color='red'/>
        <h2>Account not verified!</h2>
        <h6>For account verification, 
                    contact administration.</h6>
        <Button onClick={logout}>EXIT</Button>
        </div>
      )}
       {sessionStorage.getItem('verification') === 'true' && (
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <FaCheckCircle size={50} color='green'/>
        <h2>Account Verified!</h2>
        <Button onClick={next}>Continue</Button>
        </div>
      )}
    </>
  );
}

export default VerificationCheck;
