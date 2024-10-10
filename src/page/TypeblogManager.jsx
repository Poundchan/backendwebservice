import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App'; // แก้ตาม path ที่ใช้จริง
import AddTypeBlogModal from '../companents/AddTypeBlogModal';
import EditTypeBlogModal from '../companents/EditTypeBlogModal';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const TypeblogManager = () => {
  const [typeblogs, setTypeblogs] = useState([]);
  const [filteredTypeblogs, setFilteredTypeblogs] = useState([]);
  const [selectedTypeBlog, setSelectedTypeBlog] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const typeblogsPerPage = 15;

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  // Fetch typeblogs on load
  useEffect(() => {
    fetchTypeblogs();
  }, []);

  useEffect(() => {
    setFilteredTypeblogs(
      typeblogs.filter(typeblog =>
        typeblog.blogstypename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [typeblogs, searchTerm]);

  const fetchTypeblogs = async () => {
    try {
      const isToken = localStorage.getItem('token');
      const form = new FormData();
      form.append('token', isToken);

      const response = await axios.post(`${URIAPI}typeblogs.php`, form);
      if (response.data.error) {
        MySwal.fire({
          title: 'เชสชันหมดอายุ!',
          icon: 'error',
          text: 'กรุณาล็อคอินอีกครั้ง'
        }).then(() => {
          localStorage.removeItem('token');
        }).then(() => {
          navigate('/');
          window.location.reload();
        });
      }
      setTypeblogs(response.data);
      setFilteredTypeblogs(response.data);
    } catch (error) {
      console.error('Error fetching typeblogs:', error);
    }
  };

  // Function to delete typeblog
  const deleteTypeBlog = async (id) => {
    try {
      MySwal.fire({
        title: "คุณแน่ใจหรือไม่",
        text: "กดยืนยันเพื่อลบข้อมูล",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then(async (result) => {
        const isToken = localStorage.getItem('token');
        const form = new FormData();
        form.append('token', isToken);
        form.append('typeblog_id', id);
        const res = await axios.post(`${URIAPI}delete_typeblogs.php`, form)
        .then((res) => {
          if (result.isConfirmed) {
            MySwal.fire({
              title: "เสร็จสิน!",
              text: "ดำเนินการเสร็จสิ้น!",
              icon: "success"
            }).then(() => {
              fetchTypeblogs(); 
            });
          }
        });
      });

    } catch (error) {
      console.error('Error deleting typeblog:', error);
    }
  };

  // Pagination logic
  const indexOfLastTypeBlog = currentPage * typeblogsPerPage;
  const indexOfFirstTypeBlog = indexOfLastTypeBlog - typeblogsPerPage;
  const currentTypeblogs = filteredTypeblogs.slice(indexOfFirstTypeBlog, indexOfLastTypeBlog);
  const totalPages = Math.ceil(filteredTypeblogs.length / typeblogsPerPage);

  return (
    <div>
      <h2>ข้อมูลประเภท Blog</h2>
      <Button onClick={() => setShowAddModal(true)} variant="primary" className="mb-3">
        เพิ่มข้อมูล
      </Button>

      <Form.Control
        type="text"
        placeholder="ค้นหาประเภทบล็อก..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ประเภทblog</th>
            <th>เวลา</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentTypeblogs.map((typeblog) => (
            <tr key={typeblog.blogstypeID}>
              <td>{typeblog.blogstypeID}</td>
              <td>{typeblog.blogstypename}</td>
              <td>{typeblog.created_at}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setSelectedTypeBlog(typeblog);
                    setShowEditModal(true);
                  }}
                >
                  แก้ไข
                </Button>
                <Button variant="danger" onClick={() => deleteTypeBlog(typeblog.blogstypeID)}>
                  ลบ
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination controls */}
      <div className="d-flex justify-content-center align-items-center">
        <Button
          className='m-3'
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          หน้าเเรก
        </Button>
        <Button
        className='m-3'
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </Button>
        <span>หน้าที่ {currentPage} ของ {totalPages}</span>
        <Button
        className='m-3'
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </Button>
        <Button
        className='m-3'
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          หน้าสุดท้าย
        </Button>
      </div>

      {/* Add and Edit Modals */}
      <AddTypeBlogModal show={showAddModal} onClose={() => setShowAddModal(false)} onTypeBlogAdded={fetchTypeblogs} />
      <EditTypeBlogModal typeBlog={selectedTypeBlog} show={showEditModal} onClose={() => setShowEditModal(false)} onTypeBlogUpdated={fetchTypeblogs} />
    </div>
  );
};

export default TypeblogManager;
