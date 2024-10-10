import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App'; // Adjust as necessary

const EditTypeBlogModal = ({ show, onClose, typeBlog, onTypeBlogUpdated }) => {
  const [blogstypename, setBlogstypename] = useState('');

  useEffect(() => {
    if (typeBlog) {
      setBlogstypename(typeBlog.blogstypename);
    }
  }, [typeBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isToken = localStorage.getItem('token');
      const form = new FormData();
      form.append('token', isToken);
      form.append('type_name', blogstypename);
      form.append('typeblog_id', typeBlog.blogstypeID);

      const res = await axios.post(`${URIAPI}update_typeblogs.php`, form);
      onTypeBlogUpdated(); // Refresh the typeblogs list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating type blog:', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Type Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Type Name</Form.Label>
            <Form.Control type="text" value={blogstypename} onChange={(e) => setBlogstypename(e.target.value)} required />
          </Form.Group>
          <Button type="submit" className="mt-3">Update</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditTypeBlogModal;
