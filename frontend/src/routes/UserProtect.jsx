import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Oval } from "react-loader-spinner";

function UserProtect({ children }) {

    const { user, userLoading } = useAppContext();

    // show spinner while loading
    if (userLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <Oval
                    height={50}
                    width={50}
                    color="#3b82f6"
                    secondaryColor="#94a3b8"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                />
            </div>
        );
    }

    // if not logged in → go to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // allow access
    return children;
}

export default UserProtect;