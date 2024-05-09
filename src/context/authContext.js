import axios from 'axios'
import { createContext, useEffect, useState } from "react";
import { URL } from "../constans/url";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

function AuthoProvider(props) {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const navigate = useNavigate()

  const login = ({ email, password }) => {
    // await axios.get("http://localhost:4000")
    axios.post(`http://localhost:4000/user/login`, {
      email: email,
      password: password
    })
      .then((res) => {
        console.log("check ", res)
        setCurrentUser(res.data.data);
        toast.success("Login Success")
        navigate("/project")
      }).catch((err) => {
        console.log("check ", err.response)
        toast.error(err.response.data.messages)
      })
  }
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser))
  }, [currentUser])

  return <AuthContext.Provider value={{ currentUser, login }} {...props}></AuthContext.Provider>
}

export { AuthContext, AuthoProvider };