import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { UserContext } from "../../context/userContext" // Fixed: changed from 'userContext' to 'UserContext'
import AUTH_IMG  from '../../assets/authImage.png'

const Login = ({setCurrentPage}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { updateUser, setOpenAuthForm } = useContext(UserContext); // Fixed: changed from 'userContext' to 'UserContext'
    const navigate = useNavigate();

    // Handle login form submit
    const handleLogin = async (e) => {
      e.preventDefault();
  };
  
  return (
    <div className="flex items-center">
      <div className="w-[90vw] md:w-[33vw] p-7 flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[2px] mb-6">
          Please enter your details to login
        </p>
        <form onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button
            type="submit"
            className="btn-primary flex justify-center items-center w-full"
          >
            LOGIN
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <button
              className="font-medium text-primary underline cursor-pointer"
              onClick={() => {
                setCurrentPage("signup");
              }}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
      <div className="hidden md:block">
        <img src={AUTH_IMG} alt="Login" className="h-[400px]" />
      </div>
    </div>
  );
};

export default Login
