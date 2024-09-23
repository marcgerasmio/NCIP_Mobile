import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import supabase from './config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const DATABASE_NAME = 'FormDB';
const STORE_NAME = 'entries';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    cadt: '',
    ip_group: '',
    recognized_leader: '',
    age: '',
    gender: '',
    birth_date: '',
    birth_place: '',
    address: '',
    available_documents: '',
    grade_level: '',
    school: '',
    eap_scholar: '',
    house: '',
    type_of_house: '',
    type_of_illness: '',
    how_long: '',
  });

  const [entries, setEntries] = useState([]);
  const is_verified = sessionStorage.getItem("verification");
  const navigate = useNavigate();

  useEffect(() => {
    if (is_verified === "false") {
        alert("you are not verified, notify administrator immediately and login again");
        navigate("/mlogin");
    } else {
        loadEntries();
    }
}, []);


 
    const loadEntries = async () => {
      const db = await openDB(DATABASE_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        },
      });
      const allEntries = await db.getAll(STORE_NAME);
      setEntries(allEntries);
    };

    loadEntries();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const db = await openDB(DATABASE_NAME, 1);
    const newEntry = { ...formData };


    await db.add(STORE_NAME, newEntry);

   
    const allEntries = await db.getAll(STORE_NAME);
    setEntries(allEntries);


    setFormData({
      name: '',
      cadt: '',
      ip_group: '',
      recognized_leader: '',
      age: '',
      gender: '',
      birth_date: '',
      birth_place: '',
      address: '',
      available_documents: '',
      grade_level: '',
      school: '',
      eap_scholar: '',
      house: '',
      type_of_house: '',
      type_of_illness: '',
      how_long: '',
    });
  };

  const handleClear = async () => {
    const db = await openDB(DATABASE_NAME, 1);

    
    await db.clear(STORE_NAME);
    setEntries([]);
  };

  const handleSync = async () => {
    const db = await openDB(DATABASE_NAME, 1);
    const allEntries = await db.getAll(STORE_NAME);

    if (allEntries.length > 0) {
      try {
        const { data, error } = await supabase
          .from('census_data')
          .insert(allEntries);

        if (error) throw error;

        console.log('Data synced to Supabase:', data);
        alert('Data synced and cleared successfully!');
        
      
        await db.clear(STORE_NAME);
        setEntries([]);
      } catch (error) {
        console.error('Error syncing data:', error.message);
        alert('Error syncing data.');
      }
    } else {
      alert('No data to sync.');
    }
  };

  const check = async () => {
    if (is_verified === null) {
      alert("please login");
      navigate("/");
  } else {
      handleSync();
  }
  }

  return (
    <>
    <div style={{ display: 'flex' }}>
      <form onSubmit={handleSubmit} style={{ marginRight: '20px' }}>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key.replace('_', ' ')}:</label>
            <input
              type={key === 'age' || key === 'how_long' ? 'number' : 'text'}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
        <button type="button" onClick={handleClear} style={{ marginLeft: '10px' }}>
          Clear All
        </button>
        <button type="button" onClick={check} style={{ marginLeft: '10px' }}>
          Sync
        </button>
      </form>

      <div>
        <h3>Stored Entries</h3>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              {Object.values(entry).join(' - ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <Menu/>
    </>
  );
};

export default Form;
