import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";

const CheckConnection = () => {
    const navigate = useNavigate();
    const [connection, setConnection] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sessionStorage.clear();
        sessionStorage.setItem("verification", "false");
        const checkInternetConnection = async () => {
            try {
                const response = await fetch("https://www.google.com/generate_204", {
                    method: "GET",
                    mode: "no-cors",
                });

                if (response.ok || response.status === 0) {
                    setConnection(true);
                    sessionStorage.setItem("connection", "true");
                  
               
                } else {
                    setConnection(false);
                    sessionStorage.setItem("connection", "false");
               
                  
                }
            } catch (error) {
                setConnection(false);
                sessionStorage.setItem("connection", "false");
           
           
            } finally {
                setLoading(false);
            }
        };

        if (navigator.onLine) {
            checkInternetConnection();
        } else {
            setConnection(false);
            sessionStorage.setItem("connection", "false");
            setLoading(false);
      
        }
    }, [navigate]);

    function redirect (){
        if (connection === true ){
            navigate("/mlogin");
        }
        else{
            navigate("/mform");
        }
    }

    return (
        <>
            {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Checking your internet connection...</p>
            </div>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
                            <img src="ncip-logo.png" alt="Logo 1" className="logo-start" />
                <h2>
                    {connection ? 'Online Access' : 'Offline Access'}
                </h2>
                <Button onClick={redirect} className="login-btn">
                    Get Started
                </Button>
                </div>
            )}
        </>
    );
};

export default CheckConnection;
