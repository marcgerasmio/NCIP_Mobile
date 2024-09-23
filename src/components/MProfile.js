import Menu from "./Menu";
import { Col, Row, Card, Container, Button, FloatingLabel, Form, Modal, InputGroup, Spinner } from "react-bootstrap";
import { useState, useEffect} from "react";
import supabase from './config/supabaseClient';
import { useNavigate } from "react-router-dom";



function MProfile() {
    const navigate = useNavigate();
    const id = sessionStorage.getItem("user_id")
    const [name, setName] = useState('');
    const [image_link, setImageLink] = useState('');
    const [position, setPosition] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState('');
    const [religion, setReligion] = useState('');
    const [blood_type, setBloodType] = useState('');
    const [userdata, setUserData] =useState([]);
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(false);
  
    const fetch_user_details = async (e) => {
        try {
            const { error, data } = await supabase
                .from('user_details')
                .select('*')
                .eq('idnumber', id)
                .single();

          console.log(data);
          setUserData(data);
          setName(data.name);
          setPosition(data.position);
          setAddress(data.address);
          setEmail(data.email);
          setPhone(data.phone);
          setGender(data.gender);
          setBirthday(data.birthday);
          setReligion(data.religion);
          setBloodType(data.blood_type);
          setImageLink(data.image_link)
    
        } catch (error) {
            alert("An unexpected error occurred.");
            console.error('Error during registration:', error.message);
        }
    };


    useEffect(() => {
        fetch_user_details();
    }, []);


    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            uploadImage(selectedFile)
                .then(() => {
                    e.target.value = null; 
                })
                .catch((error) => {
                    console.error("Upload failed:", error);
   
                });
        }
    };
    
    
      const uploadImage = async (file) => {
        setLoading(true);
        try {
          const filePath = `${file.name}`;
    
          const { data, error } = await supabase.storage
            .from('Profile')
            .upload(filePath, file);
        
          const { data: publicURL, error: urlError } = supabase.storage
            .from('Profile')
            .getPublicUrl(filePath);
            console.log('Image URL:', publicURL);
            setImageLink(publicURL.publicUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image: ' + error.message);
        }
        finally {
            setLoading(false); 
          }
      };

      const update = async() =>{
        try{
            const {data} = await supabase
            .from('user_details')
            .update([
              {
               name,
               image_link,
               position,
               address,
               email,
               phone,
               religion,
               blood_type,
               gender,
               birthday
              }
            ])
            .eq('idnumber', id);
            alert("Update Profile Success!");
            window.location.reload();
          }
          catch (error) {
            alert("Error Saving Data.")
        }
      }


      const logout = () =>{
        navigate("/mlogin");
      }
    return(
        <>
    <Container fluid className="text main-content">
        <Container className='mt-4'>
            <Row>
                <Col xs={12} md={4} className="mb-4">
                    <Card className="shadow">
                        <Card.Body className="text-center">
                            <Card.Img 
                                variant="top" 
                                src={userdata.image_link} 
                                alt="No Data" 
                                className="rounded-circle img-fluid" 
                                style={{ width: '200px' }} 
                            />
                            <Card.Title className="my-3">{userdata.name ? userdata.name : "null"}</Card.Title>
                            <Card.Text className="text-muted mb-1">{userdata.position ? userdata.position : "null"}</Card.Text>
                            <Card.Text className="text-muted mb-4">{userdata.address ? userdata.address : "null"}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={8}>
                    <Card className="mb-4 shadow">
                        <Card.Body>
                            <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0">Email</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{userdata.email ? userdata.email : "null"}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0">Phone</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{userdata.phone ? userdata.phone : "null"}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0">Gender</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{userdata.gender ? userdata.gender : "null"}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0">Birthday</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{userdata.birthday ? userdata.birthday : "null"}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0">Religion</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{userdata.religion ? userdata.religion : "null"}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0">Blood Type</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{userdata.blood_type ? userdata.blood_type : "null"}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        <div className="d-flex justify-content-center align-items-center">
  <div className="d-flex gap-3">
    <Button onClick={handleShow}>EDIT ACCOUNT</Button>
    <Button onClick={logout}>LOGOUT</Button>
    <Modal show={showModal} onHide={handleClose} className='text'>
                <Modal.Header closeButton>
                    <Modal.Title className='font fw-bold'>EDIT ACCOUNT</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
    <Col xs={12} md={4} className="mb-3">
        <Card className="shadow">
            <Card.Body className="text-center">
                <div
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => document.getElementById('imageUpload').click()}
                >
                    <Card.Img
                        src={image_link}
                        alt="Profile"
                        className="rounded-circle img-fluid"
                        style={{ width: '200px' }}
                    />
                </div>

                <input
                    type="file"
                    id="imageUpload"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </Card.Body>
        </Card>
    </Col>
    <div className="d-flex justify-content-center align-items-center mb-3">
        {loading && (
            <>
                <Spinner animation="border" role="status" style={{ marginRight: '10px' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <span>Uploading image, please wait...</span>
            </>
        )}
    </div>
    <Form>
        <InputGroup className="mb-2">
            <FloatingLabel controlId="floatingInput" label="Name">
                <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="name@example.com"
                    autoComplete="off"
                    required
                />
            </FloatingLabel>
        </InputGroup>
        <InputGroup className="mb-2">
            <FloatingLabel controlId="floatingInput" label="Position">
                <Form.Control
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    type="text"
                    placeholder="name@example.com"
                    autoComplete="off"
                    required
                />
            </FloatingLabel>
        </InputGroup>
        <InputGroup className="mb-2">
            <FloatingLabel controlId="floatingInput" label="Address">
                <Form.Control
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    placeholder="name@example.com"
                    autoComplete="off"
                    required
                />
            </FloatingLabel>
        </InputGroup>
        <InputGroup className="mb-2">
            <FloatingLabel controlId="floatingInput" label="Email">
                <Form.Control
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="name@example.com"
                    autoComplete="off"
                    required
                />
            </FloatingLabel>
        </InputGroup>
        <InputGroup className="mb-2">
            <FloatingLabel controlId="floatingInput" label="Phone Number">
                <Form.Control
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    placeholder="name@example.com"
                    autoComplete="off"
                    required
                />
            </FloatingLabel>
        </InputGroup>
        <InputGroup className="mb-2">
            <FloatingLabel controlId="floatingInput" label="Religion">
                <Form.Control
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    type="text"
                    placeholder="name@example.com"
                    autoComplete="off"
                    required
                />
            </FloatingLabel>
        </InputGroup>
        <InputGroup className="mb-2">
            <FloatingLabel controlId="floatingInput" label="Blood Type">
                <Form.Control
                    value={blood_type}
                    onChange={(e) => setBloodType(e.target.value)}
                    type="text"
                    placeholder="name@example.com"
                    autoComplete="off"
                    required
                />
            </FloatingLabel>
        </InputGroup>
        <InputGroup className="mb-2">
            <FloatingLabel controlId="floatingInput" label="Gender">
                <Form.Control
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    type="text"
                    placeholder="name@example.com"
                    autoComplete="off"
                    required
                />
            </FloatingLabel>
        </InputGroup>
        <InputGroup className="mb-2">
    <FloatingLabel controlId="floatingInput" label="Date of Birth">
        <Form.Control
            value={birthday} // Use a state variable for the date
            onChange={(e) => setBirthday(e.target.value)} // Update the state on change
            type="date"
            placeholder="Select date"
            autoComplete="off"
            required
        />
    </FloatingLabel>
</InputGroup>

    </Form>
</Modal.Body>

                <Modal.Footer className='d-flex justify-content-center'>
                    <Button className='w-50 fw-bold login-btn' variant="primary" onClick={update}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
  </div>
</div>

        
    </Container>
    <Menu/>
</>

    );
    
    
    }
    export default MProfile;