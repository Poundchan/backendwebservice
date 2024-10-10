import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App';

const Medicationcate_edit = ({ show, handleClose, categoryData, fetchData }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (categoryData) {
      setCategoryName(categoryData.CategoryName);
      setDescription(categoryData.Description);
    }
  }, [categoryData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isToken = localStorage.getItem('token');
    const form = new FormData();
    form.append('token', isToken);
    form.append('CategoryID', categoryData.CategoryID);
    form.append('CategoryName', categoryName);
    form.append('Description', description);

    try {
      const res = await axios.post(URIAPI + 'update_categories.php', form);
      console.log(res.data);
      fetchData(); // Refresh data after editing
      handleClose(); // Close modal
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>แก้ไขหมวดหมู่</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="categoryName">
            <Form.Label>ชื่อหมวดหมู่</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
            บันทึก
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

export default Medicationcate_edit;
