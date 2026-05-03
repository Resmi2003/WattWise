import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAPI } from "../../services/allAPI";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { setToken, setUser } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    setLoading(true);

    try {
      const result = await loginAPI({ email, password });

      console.log("LOGIN RESPONSE:", result.data);

      if (result.status === 200) {

        sessionStorage.setItem("token", result.data.token);
        setToken(result.data.token);
        setUser(result.data.user);

        toast.success("Login successful");

        if (result.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false); 
    }


  };

  return (

    <div className="min-h-screen flex items-center justify-center 
bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6">

      <div className="w-full max-w-md backdrop-blur-lg bg-white/70 
rounded-2xl shadow-2xl p-10 border border-white/40">


        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Access your energy insights dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div className="flex items-center bg-white/80 border border-gray-200 px-4 py-3 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <Mail size={18} className="mr-3" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center bg-white/80 border border-gray-200 px-4 py-3 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <Lock size={18} className="mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 
  text-white py-3 rounded-lg shadow-md hover:scale-[1.02] 
  transition-all duration-200 hover:shadow-lg active:scale-95
  disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;