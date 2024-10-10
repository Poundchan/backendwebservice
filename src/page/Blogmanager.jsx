import React, { useState, useEffect } from 'react';
import AddBlogModal from '../companents/AddBlogmodal';
import EditBlogModal from '../companents/EditBlogmodal';
import axios from 'axios';
import { URIAPI } from '../App';
import { Table, Button, Image, Form } from 'react-bootstrap';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 15;

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    setFilteredBlogs(
      blogs.filter(blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setCurrentPage(1); 
  }, [blogs, searchTerm]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('token', token);

      const response = await axios.post(`${URIAPI}blogs.php`, form)
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
      const fetchedBlogs = Array.isArray(response.data) ? response.data : [];
      setBlogs(fetchedBlogs);
      console.log(fetchedBlogs); 
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const form = new FormData();
      form.append('blog_id', id);
      const token = localStorage.getItem('token');
      form.append('token', token);
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
        await axios.post(`${URIAPI}delete_blogs.php`, form)
        .then((res) => {
          if (result.isConfirmed) {
            MySwal.fire({
              title: "เสร็จสิน!",
              text: "ดำเนินการเสร็จสิ้น!",
              icon: "success"
            }).then(() => {
              fetchBlogs();
            });
          }
        });
      });

    
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    
    <div>
      <h2>ข้อมูล Blog</h2>
      <Button onClick={() => setShowAddModal(true)} variant="primary" className="mb-3">
        เพิ่มข้อมูล
      </Button>
      <Form.Control
        type="text"
        placeholder="ค้นหาบล็อก..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>หัวข้อ</th>
            <th>เนื้อหา</th>
            <th>รูป</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.id}</td>
              <td>{blog.title}</td>
              <td style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {blog.content}
              </td>
              <td>
                {blog.img ? (
                  <Image src={blog.img} alt={blog.title} style={{ width: '100px' }} />
                ) : (
                  'No Image'
                )}
              </td>
            <td  style={{ color: blog.status === 'published' ? 'green' : 'red' }}>
              {blog.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}
            </td>
                
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setSelectedBlog(blog);
                    setShowEditModal(true);
                  }}
                >
                  แก้ไข
                </Button>
                <Button variant="danger" onClick={() => deleteBlog(blog.id)}>
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
      <AddBlogModal show={showAddModal} onClose={() => setShowAddModal(false)} onBlogAdded={fetchBlogs} />
      <EditBlogModal blog={selectedBlog} show={showEditModal} onClose={() => setShowEditModal(false)} onBlogUpdated={fetchBlogs} />
    </div>
  );
};

export default BlogManager;
