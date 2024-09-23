import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Form from './components/Form';
import Login from './components/Login';
import CheckConnection from './components/ConnectionCheck';
import EmailForm from './components/Email';

import MLogin from './components/MLogin';
import MForm from './components/MForm';
import MDrafts from './components/MDrafts';
import MProfile from './components/MProfile';
import VerificationCheck from './components/VerificationCheck';
import Bucket from './components/Bucket';



function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<CheckConnection/>}></Route>
    <Route path="/check" element={<VerificationCheck/>}></Route>
    <Route path="/mlogin" element={<MLogin/>}></Route>
    <Route path="/mform" element={<MForm/>}></Route>
    <Route path="/mdrafts" element={<MDrafts/>}></Route>
    <Route path="/mprofile" element={<MProfile/>}></Route>
    <Route path="/email" element={<EmailForm/>}></Route>
    <Route path="/bucket" element={<Bucket/>}></Route>
     
      {/* <Route path="/home" element={<Home/>}></Route>
      <Route path="/form" element={<Form/>}></Route>
      <Route path="/login" element={<Login/>}></Route> */}
    </Routes>
    </>
  );
}

export default App;
