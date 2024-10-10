import { useState, useEffect } from "react";
import axios from "axios";
import { URIAPI } from "../App";
import { Table, Button, Form } from "react-bootstrap";
import Medicationcate_add from "../companents/Medicationcate_add";
import Medicationcate_edit from "../companents/Medicationcate_edit";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const categoriesPerPage = 15;

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const fetchData = async () => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    const response = await axios.post(URIAPI + "categories.php", form);
    
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

    console.log(response.data);
    const fetchedCategories = Array.isArray(response.data) ? response.data : [];
    setCategories(fetchedCategories);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredCategories(
      categories.filter(cat => 
        cat.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [categories, searchTerm]);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (id) => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    form.append("CategoryID", id);

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
        const response = await axios.post(URIAPI + "delete_categories.php", form)
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
      console.error("Error deleting category:", error);
    }
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  return (
    <>
      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
        เพิ่มหมวดหมู่
      </Button>

      <Form.Control
        type="text"
        placeholder="ค้นหาหมวดหมู่..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>รหัสหมวดหมู่</th>
            <th>ชื่อหมวดหมู่</th>
            <th>คำอธิบาย</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.length > 0 ? (
            currentCategories.map((cat, index) => (
              <tr key={index}>
                <td>{cat.CategoryID}</td>
                <td>{cat.CategoryName}</td>
                <td>{cat.Description}</td>
                <td className="d-flex">
                  <Button variant="warning" className="m-3" onClick={() => handleEditClick(cat)}>
                    แก้ไข
                  </Button>
                  <Button variant="danger" className="m-3" onClick={() => handleDeleteClick(cat.CategoryID)}>
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


      <Medicationcate_add
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        fetchData={fetchData}
      />

      {selectedCategory && (
        <Medicationcate_edit
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          categoryData={selectedCategory}
          fetchData={fetchData}
        />
      )}
    </>
  );
}

export default Categories;
