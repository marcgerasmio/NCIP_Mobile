import Menu from './Menu';
import { Container, Form, Row, Col, FloatingLabel, Card, Button, Navbar, Image } from "react-bootstrap";
import { useState } from 'react';
import supabase from './config/supabaseClient';
import { useNavigate } from 'react-router-dom';


const MForm = () => {
  const [cadt, setCadt] = useState('');
  const [ipGroup, setIPGroup] = useState('');
  const [leader, setLeader] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [birth_place, setBirthPlace] = useState('');
  const [address, setAddress] = useState('');
  const [gradelevel, setGradelevel] = useState('');
  const [school, setSchool] = useState('');
  const [illness, setIllness] = useState('');
  const [illnessType, setIllnessType] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedScholar, setSelectedScholar] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  const [selectedHouseType, setSelectedHouseType] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const connection = sessionStorage.getItem('connection');
  const navigate = useNavigate();

  const handleCheckboxChange = (value) => {
    if (selectedGender === value) { 
      setSelectedGender(''); 
    } else {
      setSelectedGender(value);
    }
  };
  const handleHouseTypeCheckbox = (value) => {
    if (selectedHouseType === value) {
      setSelectedHouseType(''); 
    } else {
      setSelectedHouseType(value);
    }
  };
  const handleHouseCheckbox = (value) => {
    if (selectedHouse === value) {
      setSelectedHouse(''); 
    } else {
      setSelectedHouse(value);
    }
  };
  const handleScholarCheckbox = (value) => {
    if (selectedScholar === value) {
      setSelectedScholar(''); 
    } else {
      setSelectedScholar(value);
    }
  };
  const handleDocsCheckbox = (value) => {
    if (selectedDocs.includes(value)) {
      setSelectedDocs(selectedDocs.filter((doc) => doc !== value));
    } else {
      setSelectedDocs([...selectedDocs, value]);
    }
  };

  const save = async () => {
    if (connection === 'true'){
      try{
        const {data} = await supabase
        .from('census_data')
        .insert([
          {
            cadt,
            ip_group: ipGroup,
            recognized_leader:leader,
            name,
            age,
            gender: selectedGender,
            birth_date: birthdate,
            birth_place,
            address,
            available_documents:selectedDocs,
            grade_level:gradelevel,
            school,
            eap_scholar:selectedScholar,
            house:selectedHouse,
            type_of_house:selectedHouseType,
            type_of_illness:illness,
            how_long:illnessType,
          }
        ])
        alert("Data Saved Successfully!");
        window.location.reload();
      }
      catch (error) {
        alert("Error Saving Data.")
    }
    }
    else {
      if (!window.indexedDB) {
        alert("Your browser doesn't support IndexedDB.");
        return;
      }
     
     
      const request = indexedDB.open("CensusDB", 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
      
        // Create an object store for form data if it doesn't exist
        if (!db.objectStoreNames.contains('formData')) {
          db.createObjectStore('formData', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
      
        // Ensure the formData object store exists before attempting a transaction
        if (!db.objectStoreNames.contains('formData')) {
          alert("Object store 'formData' does not exist.");
          return;
        }
      
        const transaction = db.transaction(["formData"], "readwrite");
        const objectStore = transaction.objectStore("formData");
      
        // Data to store in IndexedDB
        const formData = {
          cadt,
          ip_group: ipGroup,
          recognized_leader: leader,
          name,
          age,
          gender: selectedGender,
          birth_date: birthdate,
          birth_place,
          address,
          available_documents: selectedDocs,
          grade_level: gradelevel,
          school,
          eap_scholar: selectedScholar,
          house: selectedHouse,
          type_of_house: selectedHouseType,
          type_of_illness: illness,
          how_long: illnessType,
        };
      
        // Add form data to IndexedDB
        const addRequest = objectStore.add(formData);
      
        addRequest.onsuccess = () => {
          alert("Data saved locally.");
          navigate("/mdrafts");
        };
      
        addRequest.onerror = () => {
          alert("Error saving data locally.");
        };
      };
      
      request.onerror = () => {
        alert("Failed to open IndexedDB.");
      };
    }
  }


  return (
    <>
<Navbar fixed="top" expand="lg" className="p-3 mb-2 nav-bottom">
  <Container className="d-flex justify-content-center">
    <Image
      src="ncip.png"
      alt=""
      className="question-image img-fluid"
    />
  </Container>
</Navbar>
<br/>
<br/>
<div className="d-flex justify-content-between align-items-center mx-3 mt-5">
  <h4>Census Form</h4>
</div>
<Form onSubmit={save}>
      <Container fluid className='main-content'>
        <Container className="mt-3 mb-5">
          <Card className="p-3 shadow mb-5">
            <Card.Body className="text">
              <Row>
                <Col xs={12} md={6}>
                <FloatingLabel controlId="floatingCadet" label="CADT" className="mb-2">
        <Form.Control 
          type="text" 
          placeholder="CADT" 
          value={cadt} 
          onChange={(e) => setCadt(e.target.value)} 
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingIPGroup" label="IP Group" className="mb-2">
        <Form.Control 
          type="text" 
          placeholder="IP Group" 
          value={ipGroup} 
          onChange={(e) => setIPGroup(e.target.value)} 
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingLeader" label="Recognized Leader" className="mb-2">
        <Form.Control 
          type="text" 
          placeholder="Recognized Leader" 
          value={leader} 
          onChange={(e) => setLeader(e.target.value)} 
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingName" label="Name" className="mb-2">
        <Form.Control 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingAge" label="Age" className="mb-2">
        <Form.Control 
          type="text" 
          placeholder="Age" 
          value={age} 
          onChange={(e) => setAge(e.target.value)}
          required 
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingBirthdate" label="Birthdate" className="mb-2">
        <Form.Control 
          type="date" 
          placeholder="Birthdate" 
          value={birthdate} 
          onChange={(e) => setBirthdate(e.target.value)} 
          required
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingBirthPlace" label="Birthplace" className="mb-2">
        <Form.Control 
          type="text" 
          placeholder="Birthplace" 
          value={birth_place} 
          onChange={(e) => setBirthPlace(e.target.value)} 
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingAddress" label="Address" className="mb-2">
        <Form.Control 
          type="text" 
          placeholder="Address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          required
        />
      </FloatingLabel>
                  <p className="font">Gender</p>
                  <Row className="mb-3">
      <Col xs={4}>
        <Form.Group className="mb-2">
          <Form.Check
            type="checkbox"
            label="Male"
            checked={selectedGender === 'Male'}
            onChange={() => handleCheckboxChange('Male')}
          />
        </Form.Group>
      </Col>
      <Col xs={4}>
        <Form.Group className="mb-2">
          <Form.Check
            type="checkbox"
            label="Female"
            checked={selectedGender === 'Female'}
            onChange={() => handleCheckboxChange('Female')}
          />
        </Form.Group>
      </Col>
      <Col xs={4}>
        <Form.Group className="mb-2">
          <Form.Check
            type="checkbox"
            label="LGBTQ"
            checked={selectedGender === 'LGBTQ'}
            onChange={() => handleCheckboxChange('LGBTQ')}
          />
        </Form.Group>
      </Col>
    </Row>
                  <p className="font">Available Documents</p>
                  <Row>
        <Col xs={6}>
          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="Marriage Certificate"
              onChange={() => handleDocsCheckbox('Marriage Certificate')}
              checked={selectedDocs.includes('Marriage Certificate')}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="PhilHealth"
              onChange={() => handleDocsCheckbox('PhilHealth')}
              checked={selectedDocs.includes('PhilHealth')}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="Birth Certificate"
              onChange={() => handleDocsCheckbox('Birth Certificate')}
              checked={selectedDocs.includes('Birth Certificate')}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="DSWD 4P's"
              onChange={() => handleDocsCheckbox("DSWD 4P's")}
              checked={selectedDocs.includes("DSWD 4P's")}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="Pension"
              onChange={() => handleDocsCheckbox('Pension')}
              checked={selectedDocs.includes('Pension')}
            />
          </Form.Group>
        </Col>
      </Row>
                </Col>
                <Col xs={12} md={6}>
                  <p className="font">Education</p>
                  <FloatingLabel controlId="floatingGradeLevel" label="Grade Level" className="mb-2">
                    <Form.Control type="text" placeholder="Grade Level" 
                      value={gradelevel} 
                      onChange={(e) => setGradelevel(e.target.value)} 
                      required/>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingIPGroup2" label="School" className="mb-2">
                    <Form.Control type="text" placeholder="School"
                      value={school} 
                      onChange={(e) => setSchool(e.target.value)} 
                      required />
                  </FloatingLabel>
                  <p className="font">EAP Scholar</p>
                  <Row>
                    <Col xs={6}>
                      <Form.Group className="mb-2">
                        <Form.Check 
                          checked={selectedScholar === 'Yes'}
                          onChange={() => handleScholarCheckbox('Yes')}
                          type="checkbox" label="Yes" />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-2">
                        <Form.Check 
                          checked={selectedScholar === 'No'}
                          onChange={() => handleScholarCheckbox('No')}
                          type="checkbox" label="No" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <p className="font">House</p>
                  <Row>
                    <Col xs={6}>
                      <Form.Group className="mb-2">
                        <Form.Check
                          checked={selectedHouse === 'Owned'}
                          onChange={() => handleHouseCheckbox('Owned')}
                          type="checkbox" label="Owned" />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-2">
                        <Form.Check
                          checked={selectedHouse === 'Rented'}
                          onChange={() => handleHouseCheckbox('Rented')}
                          type="checkbox" label="Rented" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <p className="font">Type of House</p>
                  <Row>
                    <Col xs={4}>
                      <Form.Group className="mb-2">
                        <Form.Check 
                          checked={selectedHouseType === 'Light Material'}
                          onChange={() => handleHouseTypeCheckbox('Light Material')}
                          type="checkbox" label="Light Material" />
                      </Form.Group>
                    </Col>
                    <Col xs={4}>
                      <Form.Group className="mb-2">
                        <Form.Check 
                          checked={selectedHouseType === 'Semi Concrete'}
                          onChange={() => handleHouseTypeCheckbox('Semi Concrete')}
                          type="checkbox" label="Semi Concrete" />
                      </Form.Group>
                    </Col>
                    <Col xs={4}>
                      <Form.Group className="mb-2">
                        <Form.Check
                         checked={selectedHouseType === 'Concrete'}
                         onChange={() => handleHouseTypeCheckbox('Concrete')}
                         type="checkbox" label="Concrete" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <p className="font">Health Concerns</p>
                  <FloatingLabel controlId="floatingIllness" label="Type of Illness" className="mb-2">
                    <Form.Control type="text" placeholder="Type of Illness" 
                      value={illness} 
                      onChange={(e) => setIllness(e.target.value)} 
                      required/>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingDuration" label="How long" className="mb-2">
                    <Form.Control type="text" placeholder="How long"
                      value={illnessType} 
                      onChange={(e) => setIllnessType(e.target.value)} 
                      required />
                  </FloatingLabel>
                  <Container className="d-flex justify-content-end mt-3">
                    <Button className="w-100 fw-bold" variant="info" type='submit'>
                      Save
                    </Button>
                  </Container>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </Container>
      </Form>
     <Menu/>
    </>
  );
};

export default MForm;
