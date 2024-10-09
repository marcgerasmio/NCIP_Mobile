import "../App.css";
import Menu from "./Menu.js";
import { MdPreview } from "react-icons/md";
import { Navbar, Container, Image, Card, Form, Modal, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import supabase from "./config/supabaseClient.js";

// IndexedDB functions inside the same file
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myDB', 1);

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('userdata')) {
        db.createObjectStore('userdata', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

const saveToIndexedDB = async (data) => {
  const db = await openDB();
  const transaction = db.transaction('userdata', 'readwrite');
  const store = transaction.objectStore('userdata');
  data.forEach((item) => store.put(item));
  return transaction.complete;
};

const getFromIndexedDB = async () => {
    const db = await openDB(); 
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('userdata', 'readonly');
      const store = transaction.objectStore('userdata');
      const request = store.getAll();
  
      request.onsuccess = () => {
        resolve(request.result); 
      };
  
      request.onerror = () => {
        reject(request.error); 
      };
    });
};  

const deleteDataFromDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDB", 1); 

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["userdata"], "readwrite"); 
      const objectStore = transaction.objectStore("userdata");

      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = function () {
        console.log("Object store cleared successfully.");
        resolve();
      };

      clearRequest.onerror = function () {
        console.error("Error clearing object store.");
        reject();
      };
    };

    request.onerror = function () {
      console.error("Error opening database.");
      reject();
    };
  });
};

const MRecords = () => {
    const [showModal, setShowModal] = useState(false);
    const [userdata, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  // New state for selected user
    const [searchQuery, setSearchQuery] = useState("");  // State for search query

    const handleIconClick = (user) => {
        setSelectedUser(user);  // Set the clicked user
        setShowModal(true);     // Show the modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);  // Reset selected user when closing modal
    };

    const fetch_data = async () => {
        try {
            const { error, data } = await supabase
                .from('census_data')
                .select('*');
            
            if (error) {
                throw error;
            }
            console.log(data);
            deleteDataFromDB();
            saveToIndexedDB(data);
            window.location.reload();

        } catch (error) {
            alert("An unexpected error occurred.");
            console.error('Error during fetch:', error.message);
        }
    };

    const loadData = async () => {
        const localData = await getFromIndexedDB();
        console.log(localData);
        setUserData(localData);
    };

    const filteredData = Array.isArray(userdata)
        ? userdata.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter logic for search
          )
        : [];

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <Navbar expand="lg" fixed="top" className="p-3 nav-bottom shadow">
                <Container className="d-flex justify-content-center">
                    <Image src="ncip.png" alt="" className="img-fluid" />
                </Container>
            </Navbar>
            <Container className="mt-5 text">
                <div style={{ height: "83vh", overflowY: "auto" }}>
                    <Container className="mt-5 mb-4">
                    {sessionStorage.getItem("connection") === "true" && (
                    <div className="d-flex align-items-end justify-content-end">
                    <Button className="fw-bold sync-btn text-white text mb-3" onClick={fetch_data}>
                        SYNC DATA
                    </Button>
                    </div>
                    )}
                        <Form.Control
                            type="text"
                            placeholder="Search by name"  
                            className="w-100 mb-2 p-3 shadow"
                            value={searchQuery}             
                            onChange={(e) => setSearchQuery(e.target.value)}  
                        />
                        <p className="text-muted fst-italic text">
                            *NOTE: Not real-time records
                        </p>
                    </Container>

                    <Container>
                        {filteredData.length > 0 ? (
                            filteredData.map((user, index) => (
                                <Card className="p-0 mb-1" key={index}>
                                    <Card.Body className="d-flex justify-content-between align-items-center p-2">
                                        <Card.Title className="mt-1 font">{user.name}</Card.Title>
                                        <MdPreview 
                                            size={30} 
                                            onClick={() => handleIconClick(user)}  // Pass user on click
                                            color="green"
                                        />
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p>No records found</p>
                        )}
                    </Container>
                </div>
            </Container>

            <Menu />

            <Modal className="font" show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser ? selectedUser.name : "Details"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <>
                         <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0 font">CADT</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{selectedUser.cadt}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0 font">Age</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{selectedUser.age}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col xs={4} sm={3}>
                                    <p className="mb-0 font">Gender</p>
                                </Col>
                                <Col xs={8} sm={9}>
                                    <p className="text-muted mb-0">{selectedUser.gender}</p>
                                </Col>
                            </Row>
                            <hr />
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default MRecords;
