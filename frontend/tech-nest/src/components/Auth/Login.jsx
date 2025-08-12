import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { UserContext } from "../../context/userContext" // Fixed: changed from 'userContext' to 'UserContext'
import AUTH_IMG  from '../../assets/authImage.png'

const Login = ({setCurrentPage}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("null");

    const { updateUser, setOpenAuthForm } = useContext(UserContext); // Fixed: changed from 'userContext' to 'UserContext'
    const navigate = useNavigate();

    // Handle login form submit
    const handleLogin = async (e) => {
      e.preventDefault();
  };
  
  return (
    <div className="flex items-center">
      <div className="w-[90vw] md:w-[33vw] p-7 flex-col justify-center">
        <h3 className="text-lg font-semibold">Welcome Back</h3>
        <p className="">
          Please enter your details to login
        </p>
        <form onSubmit={handleLogin}>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="">
            LOGIN
          </button>
          <p className="">
            Don't have an account?{" "}
            <button
              className=""
              onClick={() => {
                setCurrentPage("signup");
              }}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
      <div className="">
        <img src = {AUTH_IMG} alt="Login" className="" />
        </div>
    </div>
  );
};

export default Login
