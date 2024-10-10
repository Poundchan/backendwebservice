import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const ChatTable = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const chatsPerPage = 15;
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  // Fetch chat data from API
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append("token", token);

      const response = await axios.post(URIAPI + 'chat.php', form);
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

      if (response.data) {
        console.log(response.data)
        setChats(response.data);
        setFilteredChats(response.data);
      } else {
        console.error('No data found');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    setFilteredChats(
      chats.filter(chat =>
        chat.chattext.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [chats, searchTerm]);

  const handleEdit = (chat) => {
    setSelectedChat(chat);
    setEditText(chat.chattext);
    setShowModal(true); // Open the modal
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');

    const form = new FormData();
    form.append('token', token);
    form.append('chatid', selectedChat.chatid);
    form.append('consultName', editText);

    try {
      const response = await axios.post(URIAPI + 'add_consult.php', form);
      console.log(response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // Pagination logic
  const indexOfLastChat = currentPage * chatsPerPage;
  const indexOfFirstChat = indexOfLastChat - chatsPerPage;
  const currentChats = filteredChats.slice(indexOfFirstChat, indexOfLastChat);
  const totalPages = Math.ceil(filteredChats.length / chatsPerPage);

  if (loading) {
    return <p>Loading chats...</p>;
  }

  return (
    <>
      <Form.Control
        type="text"
        placeholder="ค้นหาข้อความแชท..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>แชท</th>
            <th>ผู้ใช้</th>
            <th>เวลา</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentChats.map((chat, index) => (
            <tr key={chat.chatid}>
              <td>{indexOfFirstChat + index + 1}</td>
              <td>{chat.chattext}</td>
              <td>{chat.userid}</td>
              <td>{chat.created_at}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(chat)}>
                  เพิ่มเป็นคำถามที่พบบ่อย
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


      {/* Modal for editing chat */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มคำถามที่พบบ่อย</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>อธิบายเกี่ยวกับถามคำผู้ใช้</Form.Label>
              <Form.Control
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            บันทึก
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChatTable;
