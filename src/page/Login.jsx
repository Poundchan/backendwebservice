import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { URIAPI } from "../App";
import { Form, Button } from 'react-bootstrap';

function Login() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    Email: "",
    Password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('rememberedUser');
    if (storedUser) {
      const { email, password } = JSON.parse(atob(storedUser));
      setUser({ Email: email, Password: password });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', user.Email);
    formData.append('password', user.Password);

    try {
      const response = await axios.post(URIAPI + "login.php", formData);
      console.log('Login successful:', response.data);

      if (response.data.status === 'success') {
        if (rememberMe) {
          const userDataToStore = btoa(JSON.stringify({ email: user.Email, password: user.Password }));
          localStorage.setItem('rememberedUser', userDataToStore);
        } else {
          localStorage.removeItem('rememberedUser');
        }

        MySwal.fire({
          title: 'Login Successful!',
          icon: 'success',
        }).then(() => {
          localStorage.setItem('token', response.data.token);
        }).then(() =>{
          navigate('/Dashboard')
        }).then(() => {
          window.location.reload();
        });
      } else {
        MySwal.fire({
          title: 'Login Failed!',
          text: response.data.message,
          icon: 'error',
        });
      }
    } catch (err) {
      console.error('Login failed:', err);
      MySwal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            name="Email" 
            value={user.Email} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Enter password" 
            name="Password" 
            value={user.Password} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check 
            type="checkbox" 
            label="Remember me" 
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Login;