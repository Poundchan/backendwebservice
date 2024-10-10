import { useState, useEffect } from "react";
import axios from "axios";
import { URIAPI } from "../App";
import { Table, Button, Form } from "react-bootstrap";
import Medication_edit from "../companents/Medication_edit";
import Medication_add from "../companents/Medication_add";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

function Medications() {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const medicationsPerPage = 15;

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const handleShow = () => setIsModalVisible(true);
  const handleClose = () => setIsModalVisible(false);

  const fetchData = async () => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    
    try {
      const res = await axios.post(URIAPI + "medications.php", form);
      
      if(res.data.error){
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

      console.log(res.data);
      setMedications(res.data);
      setFilteredMedications(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredMedications(
      medications.filter(med =>
        med.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [medications, searchTerm]);

  const handleEditClick = (med) => {
    setSelectedMedication(med);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedication(null);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const deletes = (id) => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    form.append("MedicationID", id);

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
        await axios.post(URIAPI + "delete_medications.php", form)
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
      console.error("Error deleting medication:", error);
    }
  };

  // Pagination logic
  const indexOfLastMedication = currentPage * medicationsPerPage;
  const indexOfFirstMedication = indexOfLastMedication - medicationsPerPage;
  const currentMedications = filteredMedications.slice(indexOfFirstMedication, indexOfLastMedication);
  const totalPages = Math.ceil(filteredMedications.length / medicationsPerPage);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        เพิ่มข้อมูลยา
      </Button>

      <Form.Control
        type="text"
        placeholder="ค้นหาข้อมูลยา..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <Medication_add show={isModalVisible} handleClose={handleClose} />
      <h3 className="text-center">ตารางจัดการข้อมูลยา</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>รหัสยา</th>
            <th>ชื่อยา</th>
            <th>หมวดหมู่ยา</th>
            <th>ประเภทยา</th>
            <th>รูปภาพ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentMedications.length > 0 ? (
            currentMedications.map((med, index) => (
              <tr key={index}>
                <td>{truncateText(med.MedicationID, 20)}</td>
                <td>{truncateText(med.Name, 20)}</td>
                <td>{truncateText(med.CategoryName, 20)}</td>
                <td>{truncateText(med.TypeName, 20)}</td>
                <td>
                  <img src={med.img} alt={med.Name} style={{ width: "100px" }} />
                </td>
                <td className="d-flex">
                  <Button variant="warning" className="m-3" onClick={() => handleEditClick(med)}>แก้ไข</Button>
                  <Button variant="danger" className="m-3" onClick={() => deletes(med.MedicationID)}>ลบ</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14">No data available</td>
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

      <Medication_edit
        show={showModal}
        handleClose={handleCloseModal}
        medication={selectedMedication}
      />
    </div>
  );
}

export default Medications;
