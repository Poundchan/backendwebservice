// CommentsChart.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { URIAPI } from "../App";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  // Separate error states for each data source
  const [commentsError, setCommentsError] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [likesError, setLikesError] = useState(null);
  const [usersError, setUsersError] = useState(null);

  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsersData = async () => {
    try {
      const formData = new FormData();
      formData.append("token", token);

      const response = await axios.post(URIAPI + "graph_users.php", formData);
      if (response.error) {
        MySwal.fire({
          title: "เชสชันหมดอายุ!",
          icon: "error",
          text: "กรุณาล็อคอินอีกครั้ง",
        })
          .then(() => {
            localStorage.removeItem("token");
          })
          .then(() => {
            navigate("/");
            window.location.reload();
          });
      }

      const fetchedData = response.data;

      const chartData = fetchedData.map((item) => ({
        date: item.registration_date,
        count: item.user_count,
      }));

      setUsersData(chartData);
      setUsersError(null); // Clear previous error if successful
    } catch (err) {
      setUsersError("Failed to fetch users data");
    }
  };

  const fetchLikesData = async () => {
    try {
      const formData = new FormData();
      formData.append("token", token);

      const response = await axios.post(URIAPI + "graph_likes.php", formData);
      const fetchedData = response.data;

      const chartData = fetchedData.map((item) => ({
        date: item.like_date,
        count: item.like_count,
      }));

      setLikesData(chartData);
      setLikesError(null); // Clear previous error if successful
    } catch (err) {
      setLikesError("Failed to fetch likes data");
    }
  };

  const fetchChatData = async () => {
    try {
      const formData = new FormData();
      formData.append("token", token);
  
      const response = await axios.post(URIAPI + "graph_chat.php", formData);
      const fetchedData = response.data;
  
      console.log(fetchedData); // Inspect the response to confirm its format
  
      if (Array.isArray(fetchedData)) {
        const transformedData = fetchedData.map((item) => ({
          date: item.chat_date,
          count: item.chat_count,
        }));
  
        setChatData(transformedData);
        setChatError(null); // Clear previous error if successful
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.log(err);
      setChatError("Failed to fetch chat data");
    }
  };
  

  const fetchComments = async () => {
    try {
      const formData = new FormData();
      formData.append("token", token);

      const response = await axios.post(URIAPI + "graph_comment.php", formData);
      const commentsData = response.data;

      const chartData = commentsData.map((item) => ({
        date: item.comment_date,
        count: item.comment_count,
      }));

      setData(chartData);
      setCommentsError(null); // Clear previous error if successful
    } catch (err) {
      setCommentsError("Failed to fetch comments data");
    }
  };

  const checktoken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const form = new FormData();
      form.append("token", token);
      const respons = await axios.post(
        "https://student.crru.ac.th/651463045/drugapi/protected_data.php",
        form
      );

      if (respons.data.status === "error") {
        MySwal.fire({
          title: "เชสชันหมดอายุ!",
          icon: "error",
          text: "กรุณาล็อคอินอีกครั้ง",
        })
          .then(() => {
            localStorage.removeItem("token");
          })
          .then(() => {
            navigate("/");
            window.location.reload();
          });
      }
    }
  };
  useEffect(() => {
    checktoken();
    fetchLikesData();
    fetchComments();
    fetchChatData();
    fetchUsersData();
  }, [token]);

  return (
    <div>
  <div>
    <div className="graph d-flex">
      <div>
        <h2>การคอมเม้นท์ในเเต่ละวัน</h2>
        {commentsError ? (
          <div>{commentsError}</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h2>การเเชทปรึกษาในเเต่ละวัน</h2>
        {chatError ? (
          <div>{chatError}</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chatData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>

    <div className="graph d-flex">
      <div>
        <h2>การไลค์ในแต่ละวัน</h2>
        {likesError ? (
          <div>{likesError}</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={likesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h2>การสมัครเข้าใช้งานในเเต่ละวัน</h2>
        {usersError ? (
          <div>{usersError}</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={usersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default Dashboard;
