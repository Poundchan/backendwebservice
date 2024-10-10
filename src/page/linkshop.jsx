import { useState, useEffect } from "react";
import axios from "axios";
import { URIAPI } from "../App";
import { Table, Form, Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

function LinkShopTable() {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null); // For edit
  const [editLinkName, setEditLinkName] = useState('');
  const [editLinkDescription, setEditLinkDescription] = useState('');
  const [currentMedicationID, setCurrentMedicationID] = useState(null);
  const [link , setlink] = useState(null); // Store current medication ID for operations
  const medicationsPerPage = 15;

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const fetchData = async () => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);

    try {
      const res = await axios.post(URIAPI + "medications.php", form);

      if (res.data.error) {
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

  const fetchLinks = async (medicationID) => {
    setlink(medicationID);
    setLoadingLinks(true);
    setCurrentMedicationID(medicationID); // Store the medication ID for further operations
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    form.append("linkID", medicationID);

    try {
      const res = await axios.post(URIAPI + "linkshop.php", form);
      if (res.data.success) {
        setLinks(res.data.data);
        console.log(res.data)
      } else {
        setLinks([]);
      }
      setLoadingLinks(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching links:", error);
      setLoadingLinks(false);
    }
  };

  const handleAddLink = async () => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    form.append("medicationID", currentMedicationID);
    form.append("linkname", editLinkName);
    form.append("description", editLinkDescription);
    form.append("medicationID", link);

    try {
      const res = await axios.post(URIAPI + "add_linkshop.php", form);
      if (res.data.success) {
        fetchLinks(currentMedicationID); // Refresh the link list
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const handleDeleteLink = async (linkID) => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    form.append("linkID", linkID);

    try {
      const res = await axios.post(URIAPI + "delete_linkshop.php", form);
      if (res.data.success) {
        fetchLinks(currentMedicationID); // Refresh the link list
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleEditLink = (link) => {
    setSelectedLink(link);
    setEditLinkName(link.linkname);
    setEditLinkDescription(link.description);
    setShowEditModal(true); // Open edit modal
  };

  const handleSaveEdit = async () => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    form.append("linkID", selectedLink.linkID);
    form.append("linkname", editLinkName);
    form.append("description", editLinkDescription);

    try {
      const res = await axios.post(URIAPI + "update_linkshop.php", form);
      if (res.data.success) {
        fetchLinks(currentMedicationID); // Refresh the link list
        setShowEditModal(false);
      }else{
        console.log(res.data)
      }
    } catch (error) {
      console.error("Error editing link:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Pagination logic
  const indexOfLastMedication = currentPage * medicationsPerPage;
  const indexOfFirstMedication = indexOfLastMedication - medicationsPerPage;
  const currentMedications = filteredMedications.slice(indexOfFirstMedication, indexOfLastMedication);
  const totalPages = Math.ceil(filteredMedications.length / medicationsPerPage);

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="ค้นหาข้อมูลยา..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

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
                <td>
                  <Button
                    variant="info"
                    className="m-3"
                    onClick={() => fetchLinks(med.MedicationID)}
                  >
                    ดูลิงก์
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
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

      {/* Modal for displaying links */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ลิงก์ของยา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingLinks ? (
            <p>กำลังโหลดลิงก์...</p>
          ) : links.length > 0 ? (
            <ul>
              {links.map((link) => (
                <li key={link.linkID}>
                  {link.description}
                  <Button variant="warning" className="ml-3" onClick={() => handleEditLink(link)}>
                    แก้ไข
                  </Button>
                  <Button variant="danger" className="ml-3" onClick={() => handleDeleteLink(link.linkID)}>
                    ลบ
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>ไม่มีข้อมูลลิงก์</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowEditModal(true)}>
            เพิ่มลิงก์
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for adding/editing links */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedLink ? 'แก้ไขลิงก์' : 'เพิ่มลิงก์ใหม่'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>ลิงก์</Form.Label>
              <Form.Control
                type="text"
                value={editLinkName}
                onChange={(e) => setEditLinkName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>คำอธิบาย</Form.Label>
              <Form.Control
                type="text"
                value={editLinkDescription}
                onChange={(e) => setEditLinkDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            ปิด
          </Button>
          <Button variant="primary" onClick={selectedLink ? handleSaveEdit : handleAddLink}>
            บันทึก
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LinkShopTable;
