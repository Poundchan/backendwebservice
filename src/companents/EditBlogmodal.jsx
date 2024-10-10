import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App'; // Assuming you have URIAPI defined in App.js for your API base URL

const EditBlogModal = ({ show, onClose, blog, onBlogUpdated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [blogstypeID, setBlogstypeID] = useState('');
  const [img, setImg] = useState(null); // For handling image
  const [typeBlogs, setTypeBlogs] = useState([]); // For typeblogs data

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setStatus(blog.status);
      setBlogstypeID(blog.blogstypeID);
      setImg(blog.img); // Assuming blog has an 'img' field with the image URL
    }
  }, [blog]);

  useEffect(() => {
    if (show) {
      fetchTypeBlogs(); // Fetch typeblogs when the modal opens
    }
  }, [show]);

  // Fetch typeblogs data from API
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
      const isToken = localStorage.getItem('token');
      const form = new FormData();
      form.append('id', blog.id); // Blog ID to be updated
      form.append('title', title);
      form.append('content', content);
      form.append('status', status);
      form.append('blogstypeID', blogstypeID);
      form.append('token', isToken);

      // If an image was uploaded, include it
      if (img instanceof File) {
        form.append('image', img);
      }

      // Make API request to update the blog
      const res = await axios.post(`${URIAPI}update_blogs.php`, form);
      if(res.status === "success"){
        console.log(res.data);

      }
      else{
        console.log(res.data);
      }
      onBlogUpdated(); // Refresh blog list after update
      onClose(); // Close modal
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Blog</Modal.Title>
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
              onChange={(e) => setImg(e.target.files[0])} // Update image if a new file is selected
            />
            {img && !(img instanceof File) && (
              <div>
                <img
                  src={img}
                  alt="Current"
                  style={{ width: '100px', marginTop: '10px' }}
                />
              </div>
            )}
          </Form.Group>
          <Button type="submit" variant="primary">
            Update Blog
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditBlogModal;
