import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Container } from 'react-bootstrap';
import { URIAPI } from '../App';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const ConsultList = () => {
    const [consults, setConsults] = useState([]);
    const [error, setError] = useState(null);

    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    const fetchConsults = async () => {
        try {
            const token = localStorage.getItem('token');
            const form = new FormData();
            form.append('token',token)
            const response = await axios.post(URIAPI+'consult.php',form)
            if(response.error){
                MySwal.fire({
                    title: 'เชสชันหมดอายุ!',
                    icon: 'error',
                    text: 'กรุณาล็อคอินอีกครั้ง'
                  }).then(() => {
                    localStorage.removeItem('token');
                  }).then(() =>{
                    navigate('/');
                    window.location.reload();
                  });
            }
            setConsults(response.data);
        } catch (err) {
            setError(err.response.data.error || 'An error occurred');
        }
    };

    const handleDelete = async (consultID) => {
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
                const token = localStorage.getItem('token');
                const form = new FormData();
                form.append('token', token);
                form.append('consultID', consultID); 
                await axios.post(URIAPI + 'delete_consult.php', form)
                .then((res) => {
                  if (result.isConfirmed) {
                    MySwal.fire({
                      title: "เสร็จสิน!",
                      text: "ดำเนินการเสร็จสิ้น!",
                      icon: "success"
                    }).then(() => {
                    fetchConsults(); 
                    });
                  }
                });
              });
        
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete consult record'); 
        }
    };
    
    useEffect(() => {
        fetchConsults();
    }, []);

    return (
        <Container className="mt-4">
            <h2>ข้อมูลคำปรึกษา</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Consult ID</th>
                        <th>Chat ID</th>
                        <th>Consult Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {consults.length > 0 ? (
                        consults.map(consult => (
                            <tr key={consult.consultID}>
                                <td>{consult.consultID}</td>
                                <td>{consult.chatid}</td>
                                <td>{consult.consultName}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(consult.consultID)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No consult records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default ConsultList;
