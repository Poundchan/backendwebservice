import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App';

const Medicationtype_edit = ({ show, handleClose, data, fetchData }) => {
  const [typeName, setTypeName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (data) {
      setTypeName(data.TypeName);
      setDescription(data.Description);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isToken = localStorage.getItem('token');
    const form = new FormData();
    form.append('token', isToken);
    form.append('TypeID', data.TypeID);
    form.append('TypeName', typeName);
    form.append('Description', description);

    try {
      const res = await axios.post(URIAPI + 'update_medicationtypes.php', form);
      console.log(res.data);
      fetchData(); // ดึงข้อมูลใหม่หลังจากอัปเดตสำเร็จ
      handleClose(); // ปิด modal
    } catch (error) {
      console.error('Error updating medication type:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>แก้ไขข้อมูลประเภทยา</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="typeName">
            <Form.Label>ชื่อประเภทยา</Form.Label>
            <Form.Control
              type="text"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>คำอธิบาย</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            บันทึกการเปลี่ยนแปลง
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          ปิด
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Medicationtype_edit;
