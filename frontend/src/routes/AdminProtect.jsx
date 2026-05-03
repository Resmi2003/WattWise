import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function AdminProtect({ children }) {

    const { user, userLoading } = useAppContext();

    console.log("ADMIN CHECK USER:", user);
    console.log("USER LOADING:", userLoading);

    // Wait until user is loaded
    if (userLoading) {
        return <h1>Loading...</h1>;
    }

    // Block if not admin
    if (!user || user.role?.toLowerCase() !== "admin") {
        return <Navigate to="/login" />;
    }

    // Allow admin
    return children;
}

export default AdminProtect;