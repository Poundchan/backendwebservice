import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URIAPI } from '../App';
import { Table, Button, Form } from 'react-bootstrap';
import Medicationtype_edit from '../companents/Medicationtype_edit';
import Medicationtype_add from '../companents/Medicationtype_add';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

function Medicationtype() {
  const [type, setType] = useState([]);
  const [filteredType, setFilteredType] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const typesPerPage = 15;

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const fetchData = async () => {
    const isToken = localStorage.getItem('token');
    const form = new FormData();
    form.append('token', isToken);

    const respons = await axios.post(URIAPI + 'medicationtypes.php', form);
    if (respons.data.error) {
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
    setType(respons.data);
    setFilteredType(respons.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredType(
      type.filter(med =>
        med.TypeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [type, searchTerm]);

  const deletes = async (id) => {
    const isToken = localStorage.getItem('token');
    const form = new FormData();
    form.append('token', isToken);
    form.append('TypeID', id);

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
        const res = await axios.post(URIAPI + 'delete_medicationtypes.php', form)
        .then((res) => {
          if (result.isConfirmed) {
            MySwal.fire({
              title: "เสร็จสิน!",
              text: "ดำเนินการเสร็จสิ้น!",
              icon: "success"
            }).then(() => {
              fetchData();
            });
          }
        });
      });

     
    } catch (error) {
      console.error('Error deleting medication type:', error);
    }
  };

  const handleEditClick = (med) => {
    setSelectedType(med);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  // Pagination logic
  const indexOfLastType = currentPage * typesPerPage;
  const indexOfFirstType = indexOfLastType - typesPerPage;
  const currentTypes = filteredType.slice(indexOfFirstType, indexOfLastType);
  const totalPages = Math.ceil(filteredType.length / typesPerPage);

  return (
    <>
      <Button variant="primary" onClick={handleAddClick} className="mb-3">
        เพิ่มประเภทยา
      </Button>

      <Form.Control
        type="text"
        placeholder="ค้นหาประเภทยา..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>รหัสประเภทยา</th>
            <th>ชื่อประเภทยา</th>
            <th>คำอธิบาย</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentTypes.length > 0 ? (
            currentTypes.map((med, index) => (
              <tr key={index}>
                <td>{med.TypeID}</td>
                <td>{med.TypeName}</td>
                <td>{med.Description}</td>
                <td className="d-flex">
                  <Button
                    variant="warning"
                    className="m-3"
                    onClick={() => handleEditClick(med)}
                  >
                    แก้ไข
                  </Button>
                  <Button
                    variant="danger"
                    className="m-3"
                    onClick={() => deletes(med.TypeID)}
                  >
                    ลบ
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
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

      {selectedType && (
        <Medicationtype_edit
          show={showModal}
          handleClose={() => setShowModal(false)}
          data={selectedType}
          fetchData={fetchData}
        />
      )}
      <Medicationtype_add
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        fetchData={fetchData}
      />
    </>
  );
}

export default Medicationtype;
