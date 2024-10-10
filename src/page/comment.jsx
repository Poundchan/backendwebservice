import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";
import { URIAPI } from "../App";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const Comments = () => {
  const [comments, setComments] = useState([]); // เก็บข้อมูล comments
  const [filteredComments, setFilteredComments] = useState([]); // สำหรับการค้นหา
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 15;

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchData = async () => {
    const token = localStorage.getItem("token"); // ดึง token จาก localStorage
    const formData = new FormData();
    formData.append("token", token); // เพิ่ม token ไปใน formData

    try {
      const response = await axios.post(URIAPI + "comment.php", formData);
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
      if (response.data.status === "success") {
        setComments(response.data.comments); // ถ้าข้อมูลสำเร็จ นำข้อมูลมาแสดงใน state
        setFilteredComments(response.data.comments);
      } else {
        console.error(response.data.message); 
        console.log(response.data)
        // แสดงข้อผิดพลาดถ้ามี
      }
    } catch (error) {
      console.error("Failed to fetch comments from the server."); // ถ้ามี error จากเซิร์ฟเวอร์
    }
  };

  // ดึงข้อมูลเมื่อ component ถูก mount
  useEffect(() => {
    fetchData();
  }, []);

  // ค้นหาข้อมูล
  useEffect(() => {
    setFilteredComments(
      comments.filter(comment =>
        comment.comment_text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [comments, searchTerm]);

  // ฟังก์ชันลบ comment
  const handleDeleteComment = async (comment_id) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("token", token);
    formData.append("comment_id", comment_id);

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
        const response = await axios.post(URIAPI + "delete_comment.php", formData)
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
      console.error("Failed to delete comment.");
    }
  };

  // Pagination logic
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  return (
    <div>
      <h1>ข้อมูลคอมเม้น</h1>

      <Form.Control
        type="text"
        placeholder="ค้นหาคอมเมนต์..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ผู้ใช้</th>
            <th>คอมเม้น</th>
            <th>เวลา</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentComments.length > 0 ? (
            currentComments.map((comment, index) => (
              <tr key={index}>
                <td>{comment.comment_id}</td>
                <td>{comment.email}</td>
                <td>{comment.comment_text}</td>
                <td>{comment.created_at}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteComment(comment.comment_id)}
                  >
                    ลบ
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No comments found
              </td>
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

    </div>
  );
};

export default Comments;
