import { User, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { validatePassword } from "../../utils/passwordValidator";
import { registerAPI } from "../../services/allAPI";
import { toast } from "react-toastify";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please enter all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    const check = validatePassword(password);

    if (!check.isValid) {
      const errors = [];

      if (!check.rules.minLength)
        errors.push("At least 8 characters");

      if (!check.rules.hasUpper)
        errors.push("At least one uppercase letter");

      if (!check.rules.hasLower)
        errors.push("At least one lowercase letter");

      if (!check.rules.hasNumber)
        errors.push("At least one number");

      if (!check.rules.hasSpecial)
        errors.push("At least one special character");

      toast.error("Password must contain:\n- " + errors.join("\n- "));
      return;
    }

    setLoading(true);

    try {
      const result = await registerAPI({
        username: name,
        email,
        password
      });

      if (result.status === 200) {
        toast.success("Registration successful");
        navigate("/login");
      } else {
        toast.error(result.response?.data || "Registration failed");
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong"
      );
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen flex items-center justify-center 
bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6">

      <div className="w-full max-w-md backdrop-blur-lg bg-white/70 
rounded-2xl shadow-2xl p-10 border border-white/40">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-sm text-gray-500">
            Start monitoring your energy usage
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">

          {/* name */}
          <div className="flex items-center bg-white/80 border border-gray-200 px-4 py-3 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <User size={18} className="mr-3" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent w-full outline-none"
            />
          </div>

          {/* email */}
          <div className="flex items-center bg-white/80 border border-gray-200 px-4 py-3 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <Mail size={18} className="mr-3" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none"
            />
          </div>

          {/* password */}
          <div className="flex items-center bg-white/80 border border-gray-200 px-4 py-3 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <Lock size={18} className="mr-3" />
            <input
              type="password"
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full outline-none"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 
text-white py-3 rounded-lg shadow-md hover:scale-[1.02] 
transition-all duration-200 hover:shadow-lg active:scale-95
disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;