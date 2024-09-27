import "./App.css";
import { Routes, Route } from "react-router-dom";
import CheckConnection from "./components/ConnectionCheck";
import EmailForm from "./components/Email";
import MLogin from "./components/MLogin";
import MForm from "./components/MForm";
import MDrafts from "./components/MDrafts";
import MProfile from "./components/MProfile";
import MRecords from "./components/MRecords";
import VerificationCheck from "./components/VerificationCheck";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CheckConnection />}></Route>
        <Route path="/check" element={<VerificationCheck />}></Route>
        <Route path="/mlogin" element={<MLogin />}></Route>
        <Route path="/mform" element={<MForm />}></Route>
        <Route path="/mdrafts" element={<MDrafts />}></Route>
        <Route path="/mprofile" element={<MProfile />}></Route>
        <Route path="/mrecords" element={<MRecords />}></Route>
        <Route path="/email" element={<EmailForm />}></Route>
      </Routes>
    </>
  );
}

export default App;
