import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { URIAPI } from "../App";

const MedicationEdit = ({ show, handleClose, medication }) => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", token);

    try {
      const response = await axios.post(URIAPI + "categories.php", form);
      setCategories(response.data);
    } catch (error) {
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
    } catch (error) {
      console.error("Error fetching medication types:", error);
    }
  };

  useEffect(() => {
    if (medication) {
      setFormData(medication);
      setImagePreview(medication.img);
      fetchTypes();
      fetchCategories();
    }
  }, [medication]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const isToken = localStorage.getItem("token");
    const form = new FormData();
    form.append("token", isToken);
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });
    if (imageFile) {
      form.append("image", imageFile);
    } else {
      form.append("old_image", formData.img);
    }

    try {
      const response = await axios.post(URIAPI + "update_medications.php", form);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        handleClose();
      }
    } catch (error) {
      console.error("Error updating medication:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>แก้ไขข้อมูลยา</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formMedicationID">
            <Form.Label>รหัสยา</Form.Label>
            <Form.Control
              type="text"
              name="MedicationID"
              value={formData.MedicationID || ""}
              onChange={handleChange}
              readOnly
            />
          </Form.Group>
          <Form.Group controlId="formMedicationName">
            <Form.Label>ชื่อยา</Form.Label>
            <Form.Control
              type="text"
              name="Name"
              value={formData.Name || ""}
              onChange={handleChange}
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
              {categories.map(category => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </option>
              ))}
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
              type="text"
              name="Description"
              value={formData.Description || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDosage">
            <Form.Label>ขนาดยา</Form.Label>
            <Form.Control
              type="text"
              name="Dosage"
              value={formData.Dosage || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPrecautions">
            <Form.Label>ข้อควรระวัง</Form.Label>
            <Form.Control
              type="text"
              name="Precautions"
              value={formData.Precautions || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formSideEffects">
            <Form.Label>ผลข้างเคียง</Form.Label>
            <Form.Control
              type="text"
              name="SideEffects"
              value={formData.SideEffects || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formStorageInstructions">
            <Form.Label>การเก็บรักษา</Form.Label>
            <Form.Control
              type="text"
              name="StorageInstructions"
              value={formData.StorageInstructions || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formContraindications">
            <Form.Label>ผู้ที่ไม่ควรทานยาชนิดนี้</Form.Label>
            <Form.Control
              type="text"
              name="Contraindications"
              value={formData.Contraindications || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDrugInteractions">
            <Form.Label>สิ่งที่ไม่ควรใช้ร่วม</Form.Label>
            <Form.Control
              type="text"
              name="DrugInteractions"
              value={formData.DrugInteractions || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formUsages">
            <Form.Label>การใช้งาน</Form.Label>
            <Form.Control
              type="text"
              name="Usages"
              value={formData.Usages || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formImageUpload">
            <Form.Label>อัปโหลดรูปภาพ</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
          {imagePreview && (
            <div className="mt-3">
              <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          ปิด
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          บันทึกการเปลี่ยนแปลง
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicationEdit;
