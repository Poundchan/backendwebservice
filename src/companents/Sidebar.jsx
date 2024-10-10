import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from 'react-router-dom';


const Sidebar = () => {
    const MySwal = withReactContent(Swal);

    const logout = () => {
        MySwal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            MySwal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            }).then(() => {
              localStorage.removeItem("token");
            }).then(() => {
              window.location.reload();
            });
          }
        })
      };
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/Dashboard">จัดการเว็บไชต์ยาเเละสุขภาพ</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Dashboard">หน้าแรก</Nav.Link>
            <NavDropdown title="จัดการข้อมูลยา" id="collapsible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/Medications">ข้อมูลยา</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Medicationtype">ประเภทยา</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Categories">หมวดหมูยา</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Link">Link</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="จัดการบทความ" id="collapsible-nav-dropdown">
              <NavDropdown.Item  as={Link} to="/BlogManager">จัดการบทความ</NavDropdown.Item>
              <NavDropdown.Item  as={Link} to="/TypeblogManager">จัดการหมวดหมู่บทความ</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="คำปรึกษา" id="collapsible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/Chat">จัดการแชท</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ConsultList">จัดการคำถามที่พบบ่อย</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link  as={Link} to="/Comments">จัดการคอมเม้น</Nav.Link>
            <Nav.Link  as={Link} to="/User">จัดการผู้ดูเเล</Nav.Link>
          </Nav>
          <Nav>
          <NavDropdown title="ข้อมูลผู้ใช้" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">ข้อมูลยา</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>
                ออกจากระบบ
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
};

export default Sidebar;
