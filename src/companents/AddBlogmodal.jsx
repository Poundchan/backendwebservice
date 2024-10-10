import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App'; // Assuming you have URIAPI defined in App.js

const AddBlogModal = ({ show, onClose, onBlogAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [blogstypeID, setBlogstypeID] = useState('');
  const [img, setImg] = useState(null); // To handle image file
  const [typeBlogs, setTypeBlogs] = useState([]); // For typeblogs data

  // Fetch typeblogs data when the modal is opened
  useEffect(() => {
    if (show) {
      fetchTypeBlogs();
    }
  }, [show]);

  const fetchTypeBlogs = async () => {
    try {
      const isToken = localStorage.getItem('token'); // Retrieve token
      const form = new FormData();
      form.append('token', isToken);

      const response = await axios.post(`${URIAPI}typeblogs.php`, form);
      setTypeBlogs(response.data); // Set the typeblogs data
    } catch (error) {
      console.error('Error fetching typeblogs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isToken = localStorage.getItem('token'); // Retrieve token
      const form = new FormData();
      form.append('title', title);
      form.append('content', content);
      form.append('status', status);
      form.append('blogstypeID', blogstypeID);
      form.append('token', isToken);

      if (img) {
        form.append('image', img); // Add image if provided
      }

      // Make API request to add the blog
      await axios.post(`${URIAPI}add_blogs.php`, form)
      .then((res) =>{
        console.log(res.data)
      })

      onBlogAdded(); // Refresh blog list after addition
      onClose(); // Close modal after submission
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              value={blogstypeID}
              onChange={(e) => setBlogstypeID(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              {typeBlogs.map((type) => (
                <option key={type.blogstypeID} value={type.blogstypeID}>
                  {type.blogstypename}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Add Blog
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBlogModal;
