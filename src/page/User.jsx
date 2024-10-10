import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import { URIAPI } from '../App';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 15;
    const token = localStorage.getItem('token');

    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const formData = new FormData();
                formData.append('token', token);

                const response = await axios.post(URIAPI + 'users.php', formData);
                if (response.data.status === "error") {
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

                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                    setFilteredUsers(response.data);
                } else {
                    setError('Unexpected response format');
                }
            } catch (err) {
                setError('Failed to fetch users: ' + err.message);
            }
        };

        fetchUsers();
    }, [token]);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user =>
                user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setCurrentPage(1); // Reset to the first page when search term changes
    }, [users, searchTerm]);

    const toggleRole = (userId, currentRole) => {
        const newRole = currentRole === 'user' ? 'admin' : 'user';
        try {
            MySwal.fire({
                title: "คุณแน่ใจหรือไม่",
                text: "ยืนยันเพื่อเปลี่ยนแปลง Admin",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก"
            }).then((result) => {
                if (result.isConfirmed) {
                    const formData = new FormData();
                    formData.append('token', token);
                    formData.append('UserID', userId);
                    formData.append('role', newRole);

                    axios.post(URIAPI + 'update_users.php', formData)
                        .then((res) => {
                            MySwal.fire({
                                title: "เสร็จสิน!",
                                text: "ดำเนินการเสร็จสิ้น!",
                                icon: "success"
                            });
                            setUsers(users.map(user => user.UserID === userId ? { ...user, role: newRole } : user));
                        });
                }
            });
        } catch (err) {
            setError('Failed to update user role');
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>User Management</h2>

            <Form.Control
                type="text"
                placeholder="ค้นหาผู้ใช้..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>UserID</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map(user => (
                            <tr key={user.UserID}>
                                <td>{user.UserID}</td>
                                <td>{user.email}</td>
                                <td>{user.fname}</td>
                                <td>{user.lname}</td>
                                <td>{user.role}</td>
                                <td>
                                    <Button
                                        variant={user.role === 'admin' ? 'danger' : 'success'}
                                        onClick={() => toggleRole(user.UserID, user.role)}
                                    >
                                        {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No users found</td>
                        </tr>
                    )}
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
        </div>
    );
};

export default UserTable;
