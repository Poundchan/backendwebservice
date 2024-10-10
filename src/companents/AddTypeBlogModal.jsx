import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App'; // Adjust as necessary

const AddTypeBlogModal = ({ show, onClose, onTypeBlogAdded }) => {
  const [blogstypename, setBlogstypename] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isToken = localStorage.getItem('token');
      const form = new FormData();
      form.append('token', isToken);
      form.append('type_name', blogstypename);

      const res =  await axios.post(`${URIAPI}add_typeblogs.php`, form);
      onTypeBlogAdded(); // Refresh the typeblogs list
      onClose(); // Close the modal
      console.log(res.data)
    } catch (error) {
      console.error('Error adding type blog:', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Type Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Type Name</Form.Label>
            <Form.Control type="text" value={blogstypename} onChange={(e) => setBlogstypename(e.target.value)} required />
          </Form.Group>
          <Button type="submit" className="mt-3">Add</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTypeBlogModal;
