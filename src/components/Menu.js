import React, { useState, useEffect } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { IoPersonSharp } from 'react-icons/io5';
import { FaHome } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { RiDraftFill } from "react-icons/ri";
import { useNavigate, useLocation } from 'react-router-dom';
import './Menu.css';


function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeClicked, setActiveClicked] = useState('');

  useEffect(() => {
    switch (location.pathname) {
      case '/mform':
        setActiveClicked('MForm');
        break;
      case '/mdrafts':
        setActiveClicked('MDrafts');
        break;
      case '/mprofile':
        setActiveClicked('MProfile');
        break;
      default:
        setActiveClicked('');
        break;
    }
  }, [location.pathname]);

  const MForm = () => {
    navigate('/mform');
  };
  const MDrafts = () => {
    navigate('/mdrafts');
  };
  const MProfile = () => {
    navigate('/mprofile');
  };


 

  return (
    <>
      <Navbar fixed="bottom" className="nav-bottom">
        <Container className="d-flex justify-content-around p-1">
        <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
              <FaClipboardList
                size={27}
                className={`btn-icons ${activeClicked === 'MDrafts' ? 'activeClicked' : ''}`}
                onClick={MDrafts}
              />
            </div>
            <span className='text-muted'>Drafts</span>
          </div>
          <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
              <RiDraftFill
                size={27}
                className={`btn-icons ${activeClicked === 'MForm' ? 'activeClicked' : ''}`}
                onClick={MForm}
              />
            </div>
            <span className='text-muted'>Census Form</span>
          </div>
          <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
              <IoPersonSharp
                size={27}
                className={`btn-icons ${activeClicked === 'MProfile' ? 'activeClicked' : ''}`}
                onClick={MProfile}
              />
            </div>
            <span className='text-muted'>Profile</span>
          </div>
        </Container>
      </Navbar> 
    </>
  );
}

export default Menu;
