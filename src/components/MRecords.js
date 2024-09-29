import "../App.css";
import Menu from "./Menu.js";
import { MdPreview } from "react-icons/md";
import { Navbar, Container, Image, Card, Form, Modal, Row, Col } from "react-bootstrap";
import { useState } from "react";

const MRecords = () => {
    const [showModal, setShowModal] = useState(false);

    const handleIconClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Navbar expand="lg" fixed="top" className="p-3 nav-bottom shadow">
                <Container className="d-flex justify-content-center">
                    <Image src="ncip.png" alt="" className="img-fluid" />
                </Container>
            </Navbar>
            <Container className="mt-5 text">
                <div style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}>
                    <Container className="mt-5 mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="w-100 mb-2 p-3 shadow"
                        />
                        <p className="text-muted fst-italic text">
                            *NOTE: Not real-time records
                        </p>
                    </Container>
                    <Container>
                        <Card className="p-0 mb-1">
                            <Card.Body className="d-flex justify-content-between align-items-center p-2">
                                <Card.Title className="mt-1 font">Marc Estoque</Card.Title>
                                <MdPreview 
                                    size={30} 
                                    onClick={handleIconClick} 
                                    color="green"
                                />
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
            </Container>
            <Menu />

            <Modal className="font" show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={4} sm={3}>
                            <p className="mb-0 font">Sample</p>
                        </Col>
                        <Col xs={8} sm={9}>
                            <p className="text-muted mb-0">Sample</p>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col xs={4} sm={3}>
                            <p className="mb-0 font">Sample</p>
                        </Col>
                        <Col xs={8} sm={9}>
                            <p className="text-muted mb-0">Sample</p>
                        </Col>
                    </Row>
                    <hr />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default MRecords;
