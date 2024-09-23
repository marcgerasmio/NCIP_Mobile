import Menu from "./Menu";
import { useEffect, useState } from "react";
import { Accordion, Button, Container, Image, Modal, Navbar } from "react-bootstrap";
import supabase from "./config/supabaseClient"; 
import { useNavigate } from "react-router-dom";
import './Display.css';

function MDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState(null); 
  const connection = sessionStorage.getItem('connection');
  const navigate = useNavigate();


  const fetchDataFromIndexedDB = () => {
    if (!window.indexedDB) {
      alert("Your browser doesn't support IndexedDB.");
      return;
    }
  
    const request = indexedDB.open("CensusDB", 1);
  
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
  
      // Check if the object store already exists, otherwise create it
      if (!db.objectStoreNames.contains("formData")) {
        db.createObjectStore("formData", { keyPath: "id", autoIncrement: true });
      }
    };
  
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["formData"], "readonly");
      const objectStore = transaction.objectStore("formData");
      const getAllRequest = objectStore.getAll();
  
      getAllRequest.onsuccess = () => {
        setDrafts(getAllRequest.result);
      };
    };
  
    request.onerror = () => {
      alert("Failed to open IndexedDB.");
    };
  };
  

  // Open modal with selected draft details
  const handleAccordionClick = (draft) => {
    setSelectedDraft(draft);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => setShowModal(false);


  const syncData = async () => {
   if (connection === 'false'){
    alert('Check internet connection and login again.');
    navigate("/");
   }
   else{

    const request = indexedDB.open("CensusDB", 1);

    request.onsuccess = async (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["formData"], "readonly");
      const objectStore = transaction.objectStore("formData");
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = async () => {
        const formData = getAllRequest.result;
        const formDataWithoutId = formData.map(({ id, ...rest }) => rest);
        if (formData.length > 0) {
          try {
            // Send data to Supabase
            const { data, error } = await supabase
              .from("census_data")
              .insert(formDataWithoutId);

            if (error) {
              alert("Error syncing data with Supabase.");
              console.error(error);
              return;
            }

            // If data is synced successfully, clear IndexedDB
            const deleteTransaction = db.transaction(["formData"], "readwrite");
            const deleteObjectStore = deleteTransaction.objectStore("formData");
            deleteObjectStore.clear();

            // Clear the local state
            setDrafts([]);
            alert("Data successfully synced with Supabase and IndexedDB cleared.");
          } catch (error) {
            console.error("Sync failed:", error);
            alert("Failed to sync data.");
          }
        } else {
          alert("No data to sync.");
        }
      };

      getAllRequest.onerror = () => {
        alert("Failed to retrieve data from IndexedDB.");
      };
    };

    request.onerror = () => {
      alert("Failed to open IndexedDB.");
    };
  }
  };

  // Function to show delete confirmation modal
  const handleDeleteClick = (draft) => {
    setDraftToDelete(draft);
    setShowDeleteModal(true);
  };

  // Function to delete a draft from IndexedDB
  const deleteDraft = (draftId) => {
    const request = indexedDB.open("CensusDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["formData"], "readwrite");
      const objectStore = transaction.objectStore("formData");

      objectStore.delete(draftId).onsuccess = () => {
        setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft.id !== draftId));
        setShowDeleteModal(false); // Close delete confirmation modal
      };
    };

    request.onerror = () => {
      alert("Failed to delete draft.");
    };
  };

  // Confirm delete
  const confirmDelete = () => {
    if (draftToDelete) {
      deleteDraft(draftToDelete.id);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchDataFromIndexedDB();
  }, []);
  return (
    <>
      <Navbar expand="lg" className="p-3 nav-bottom">
        <Container className="d-flex justify-content-center">
          <Image src="ncip.png" alt="" className="img-fluid" />
        </Container>
      </Navbar>
      <div className="d-flex justify-content-between align-items-center mx-3 mt-3">
        <h4>Drafts</h4>
        <Button variant="info" className="fw-bold" onClick={syncData}>
          Sync Data
        </Button>
      </div>

      <Container className="mt-3">
  {drafts.length > 0 ? (
    <div className="drafts">
      <Accordion>
        {drafts.map((draft, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{draft.name || "Unnamed"}</Accordion.Header>
            <Accordion.Body>
              <div className="">
                <Button variant="info" onClick={() => handleAccordionClick(draft)}>
                  View Details
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => handleDeleteClick(draft)}
                >
                  Delete
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  ) : (
    <p>No drafts available.</p>
  )}
</Container>


      {/* Modal for displaying detailed data */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedDraft?.name || "Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDraft && (
            <div>
              <p><strong>CADT:</strong> {selectedDraft.cadt}</p>
              <p><strong>IP Group:</strong> {selectedDraft.ip_group}</p>
              <p><strong>Recognized Leader:</strong> {selectedDraft.recognized_leader}</p>
              <p><strong>Age:</strong> {selectedDraft.age}</p>
              <p><strong>Gender:</strong> {selectedDraft.gender}</p>
              <p><strong>Birth Date:</strong> {selectedDraft.birth_date}</p>
              <p><strong>Birth Place:</strong> {selectedDraft.birth_place}</p>
              <p><strong>Address:</strong> {selectedDraft.address}</p>
              <p><strong>Available Documents:</strong> {selectedDraft.available_documents.join(", ")}</p>
              <p><strong>Grade Level:</strong> {selectedDraft.grade_level}</p>
              <p><strong>School:</strong> {selectedDraft.school}</p>
              <p><strong>EAP Scholar:</strong> {selectedDraft.eap_scholar}</p>
              <p><strong>House:</strong> {selectedDraft.house}</p>
              <p><strong>Type of House:</strong> {selectedDraft.type_of_house}</p>
              <p><strong>Type of Illness:</strong> {selectedDraft.type_of_illness}</p>
              <p><strong>How Long:</strong> {selectedDraft.how_long}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

       {/* Delete confirmation modal */}
       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this item?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Menu />
    </>
  );
}

export default MDrafts;
