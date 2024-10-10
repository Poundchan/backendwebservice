import { useState ,useEffect } from 'react'
import Login from './page/Login';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './companents/Sidebar';
import Dashboard from './page/Dashbroad.Jsx';
import Medications from './page/Medications';
import Medicationtype from './page/Medicationtype';
import Categories from './page/categories';
import BlogManager from './page/Blogmanager';
import TypeblogManager from './page/TypeBlogManager';
import Comments from './page/comment';
import ChatTable from './page/chat';
import ConsultList from './page/consult';
import UserTable from './page/User';
import LinkShopTable from './page/linkshop';
export const URIAPI = "https://student.crru.ac.th/651463045/drugapi/Admin/";
// export const URIAPI = "http://localhost/drug_api/Admin/";
// "https://student.crru.ac.th/651463045/drugapi/"
function App() {
    const [isLogin , setisLogin] = useState(null);
    useEffect(() => {
      const token = localStorage.getItem("token"); 
      if (token) {
        setisLogin(token); 
      }
    }, []); 

  return (
    <>
     <Router>
    {isLogin ?(
      <div>
       
        <Sidebar />
        {/* <img src="./image/allfood.jpg" alt="" /> */}
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/Dashboard" element={<Dashboard />} />
            <Route exact path="/Medications" element={<Medications />} />
            <Route exact path="/Medicationtype" element={<Medicationtype />} />
            <Route exact path="/Categories" element={< Categories />} />
            <Route exact path="/BlogManager" element={< BlogManager />} />
            <Route exact path="/TypeblogManager" element={< TypeblogManager />} />
            <Route exact path="/Comments" element={< Comments />} />
            <Route exact path="/Chat" element={< ChatTable />} />
            <Route exact path="/ConsultList" element={< ConsultList />} />
            <Route exact path="/User" element={< UserTable />} />
            <Route exact path="/Link" element={< LinkShopTable />} />
            {/* <Route exact path="/Save" element={<Modal_save />} /> */}
          </Routes>
        </div>
    
      </div>
    ) : (
      <div>
        <Login/>
      </div>
    )}
    </Router>
     
    </>
  )
}

export default App
