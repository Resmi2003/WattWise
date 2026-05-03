import { useAppContext } from "../context/AppContext";
import AccessDenied from "../auth/pages/AccessDenied";

function AdminProtect({ children }) {

    const { user, userLoading } = useAppContext();

    console.log("ADMIN CHECK USER:", user);
    console.log("USER LOADING:", userLoading);

    // Wait until user is loaded
    if (userLoading) {
        return <h1 className="text-center mt-10 dark:text-white">Loading...</h1>;
    }

    // Block if not admin
    if (!user || user.role?.toLowerCase() !== "admin") {
        return (
            <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
                <AccessDenied />
            </div>
        );
    }
    // Allow admin
    return children;
}

export default AdminProtect;