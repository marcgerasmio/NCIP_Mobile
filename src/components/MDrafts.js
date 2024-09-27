import Menu from "./Menu";
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Container,
  Image,
  Modal,
  Navbar,
  InputGroup,
  FloatingLabel,
  Form,
} from "react-bootstrap";
import supabase from "./config/supabaseClient";
import { MdPreview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../App.css";

function MDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState(null);
  const [selectedDrafts, setSelectedDrafts] = useState(new Set());
  const connection = sessionStorage.getItem("connection");
  const navigate = useNavigate();

  const fetchDataFromIndexedDB = () => {
    if (!window.indexedDB) {
      alert("Your browser doesn't support IndexedDB.");
      return;
    }
    const request = indexedDB.open("CensusDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("formData")) {
        db.createObjectStore("formData", {
          keyPath: "id",
          autoIncrement: true,
        });
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

  const handleAccordionClick = (draft) => {
    setSelectedDraft(draft);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const syncData = async () => {
    if (connection === "false") {
      alert("Check internet connection and login again.");
      navigate("/");
    } else {
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
              const { data, error } = await supabase
                .from("census_data")
                .insert(formDataWithoutId);
              if (error) {
                alert("Error syncing data with Supabase.");
                console.error(error);
                return;
              }
              const deleteTransaction = db.transaction(
                ["formData"],
                "readwrite",
              );
              const deleteObjectStore =
                deleteTransaction.objectStore("formData");
              deleteObjectStore.clear();
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

  const handleDeleteClick = (draft) => {
    setDraftToDelete(draft);
    setShowDeleteModal(true);
  };

  const deleteDraft = (draftId) => {
    const request = indexedDB.open("CensusDB", 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["formData"], "readwrite");
      const objectStore = transaction.objectStore("formData");
      objectStore.delete(draftId).onsuccess = () => {
        setDrafts((prevDrafts) =>
          prevDrafts.filter((draft) => draft.id !== draftId),
        );
        setSelectedDrafts((prev) => {
          const updated = new Set(prev);
          updated.delete(draftId);
          return updated;
        });
        setShowDeleteModal(false);
      };
    };
    request.onerror = () => {
      alert("Failed to delete draft.");
    };
  };

  const confirmDelete = () => {
    const draftIdToDelete = draftToDelete ? draftToDelete.id : null;
    if (draftIdToDelete) {
      deleteDraft(draftIdToDelete);
    } else {
      selectedDrafts.forEach(id => deleteDraft(id));
      setSelectedDrafts(new Set()); // Clear selection after deletion
    }
  };

  const toggleSelectAll = () => {
    if (selectedDrafts.size === drafts.length) {
      setSelectedDrafts(new Set()); // Deselect all
    } else {
      setSelectedDrafts(new Set(drafts.map(draft => draft.id))); // Select all
    }
  };

  const handleSelectDraft = (id) => {
    const newSelectedDrafts = new Set(selectedDrafts);
    if (newSelectedDrafts.has(id)) {
      newSelectedDrafts.delete(id); // Deselect
    } else {
      newSelectedDrafts.add(id); // Select
    }
    setSelectedDrafts(newSelectedDrafts);
  };

  useEffect(() => {
    fetchDataFromIndexedDB();
  }, []);

  return (
    <>
      <Navbar expand="lg" fixed="top" className="p-3 nav-bottom shadow">
        <Container className="d-flex justify-content-center">
          <Image src="ncip.png" alt="" className="img-fluid" />
        </Container>
      </Navbar>
      <Container className="mt-5 text">
        {drafts.length > 0 ? (
          <>
            <div
              style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}
              className="mt-5"
            >
              <div className="mt-5 mb-2">
                <p className="text-muted fst-italic font">
                  *Click the button to sync all the data
                </p>
                <label className="text-muted text">
                  <input 
                    type="checkbox" 
                    checked={selectedDrafts.size === drafts.length}
                    onChange={toggleSelectAll}
                    className="me-1"
                  /> 
                  Select All
                </label>
              </div>
              <div>
                {drafts.map((draft) => (
                  <Card key={draft.id} className="p-0 mb-1">
                    <Card.Body className="d-flex justify-content-between align-items-center p-2">
                      <div className="d-flex align-items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedDrafts.has(draft.id)}
                          onChange={() => handleSelectDraft(draft.id)}
                        />
                        <Card.Title className="mt-1 ms-2">{draft.name || "Unnamed"}</Card.Title>
                      </div>
                      <div className="d-flex gap-2">
                        <MdPreview 
                          size={33} 
                          onClick={() => handleAccordionClick(draft)}
                          color="green"
                        />
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
            <Navbar fixed="bottom" className="mb-5">
              <Container className="mb-4 gap-3">
                <Button
                  className="fw-bold font p-3 buttons w-100"
                  onClick={syncData}
                >
                  Sync
                </Button>
                <Button
                  variant="danger"
                  className="fw-bold font w-100 p-3"
                  onClick={() => confirmDelete()}
                  disabled={selectedDrafts.size === 0 && !draftToDelete}
                >
                  Delete
                </Button>
              </Container>
            </Navbar>
          </>
        ) : (
          <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: "70vh" }}
          >
            <p className="text-muted fst-italic fw-bold">
              *No drafts available.
            </p>
          </Container>
        )}
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {selectedDraft?.name || "Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {selectedDraft && (
            <div>
              {Object.entries(selectedDraft).map(([key, value]) => (
                <InputGroup className="mb-2" key={key}>
                  <FloatingLabel
                    controlId={key}
                    label={key.replace("_", " ").toUpperCase()}
                  >
                    <Form.Control
                      value={value}
                      readOnly
                      type="text"
                      placeholder={key}
                    />
                  </FloatingLabel>
                </InputGroup>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold font">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="fw-bold font">
          <p>Are you sure you want to delete this item?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={confirmDelete}
            className="fw-bold font w-100 p-3"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Menu />
    </>
  );
}

export default MDrafts;
