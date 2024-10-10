import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { URIAPI } from '../App';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

const Medication_add = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        Name: '',
        CategoryID: '',
        TypeID: '',
        Description: '',
        Dosage: '',
        Precautions: '',
        SideEffects: '',
        StorageInstructions: '',
        Contraindications: '',
        DrugInteractions: '',
        Usages: '',
        image: null,
    });
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        const token = localStorage.getItem("token");
        const form = new FormData();
        form.append("token", token);
    
        try {
            const response = await axios.post(URIAPI + "categories.php", form);
            setCategories(response.data);
            if(response.data.status === "error"){
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
        } catch (error) {
            setError("Error fetching categories");
            console.error("Error fetching categories:", error);
        }
    };
    
    const fetchTypes = async () => {
        const token = localStorage.getItem('token');
        const form = new FormData();
        form.append("token", token);
    
        try {
            const response = await axios.post(URIAPI + "medicationtypes.php", form);
            setTypes(response.data);
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
        } catch (error) {
            setError("Error fetching medication types");
            console.error("Error fetching medication types:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchCategories(), fetchTypes()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        formDataToSend.append('token', localStorage.getItem("token")); // Use the actual JWT token

        try {
            const response = await axios.post(URIAPI + 'add_medications.php', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.success || response.data.error);
            handleClose();
            console.log(response.data)
            setFormData({
                Name: '',
                CategoryID: '',
                TypeID: '',
                Description: '',
                Dosage: '',
                Precautions: '',
                SideEffects: '',
                StorageInstructions: '',
                Contraindications: '',
                DrugInteractions: '',
                Usages: '',
                image: null,
            });
        } catch (error) {
            console.error("Error submitting form", error);
            alert("ไม่สามารถบันทึกข้อมูลได้.");
        }
    };

    if (loading) {
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>เพิ่มข้อมูลยา</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Spinner animation="border" />
                    <span> กำลังโหลดข้อมูล...</span>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>เพิ่มข้อมูลยา</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>ชื่อยา</Form.Label>
                        <Form.Control
                            type="text"
                            name="Name"
                            value={formData.Name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formCategoryName">
                        <Form.Label>หมวดหมู่ยา</Form.Label>
                        <Form.Control
                        as="select"
                        name="CategoryID"
                        value={formData.CategoryID || ""}
                        onChange={handleChange}
                    >
                        <option value="">เลือกหมวดหมู่</option>
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <option key={category.CategoryID} value={category.CategoryID}>
                                    {category.CategoryName}
                                </option>
                            ))
                        ) : null}
                    </Form.Control>

                    </Form.Group>
            
                    <Form.Group controlId="formTypeName">
                        <Form.Label>ประเภทยา</Form.Label>
                        <Form.Control
                            as="select"
                            name="TypeID"
                            value={formData.TypeID || ""}
                            onChange={handleChange}
                        >
                            <option value="">เลือกประเภทยา</option>
                            {types.map(type => (
                                <option key={type.TypeID} value={type.TypeID}>
                                    {type.TypeName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>คำอธิบาย</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDosage">
                        <Form.Label>ขนาดยา</Form.Label>
                        <Form.Control
                            type="text"
                            name="Dosage"
                            value={formData.Dosage}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrecautions">
                        <Form.Label>ข้อควรระวัง</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Precautions"
                            value={formData.Precautions}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formSideEffects">
                        <Form.Label>ผลข้างเคียง</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="SideEffects"
                            value={formData.SideEffects}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formStorageInstructions">
                        <Form.Label>การเก็บรักษา</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="StorageInstructions"
                            value={formData.StorageInstructions}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formContraindications">
                        <Form.Label>ผู้ที่ไม่ควรใช้</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Contraindications"
                            value={formData.Contraindications}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDrugInteractions">
                        <Form.Label>สิ่งที่ไม่ควรใช้ร่วม</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="DrugInteractions"
                            value={formData.DrugInteractions}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formUsages">
                        <Form.Label>การใช้งาน</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Usages"
                            value={formData.Usages}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formFile">
                        <Form.Label>อัปโหลดรูปภาพ</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        บันทึก
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Medication_add;
