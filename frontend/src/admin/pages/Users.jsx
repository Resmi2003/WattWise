import React, { useEffect, useState } from "react";
import {
    getAllUsersAPI,
    deleteUserAPI,
    toggleBlockUserAPI,
} from "../../services/allAPI";
import { toast } from "react-toastify";

function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);

            const result = await getAllUsersAPI();

            if (result.status === 200) {
                setUsers(result.data);
            }

        } catch (err) {
            console.log(err);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // delete user
    const handleDelete = async (id) => {
        try {
            const res = await deleteUserAPI(id);
            toast.success(res.data);
            fetchUsers();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // block / unblock user
    const handleBlockToggle = async (id) => {
        try {
            const res = await toggleBlockUserAPI(id);
            toast.success(res.data.message);
            fetchUsers();
        } catch (err) {
            toast.error("Action failed");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>

            <h1 className="text-xl font-bold mb-4">User Management</h1>

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
            ) : (

                <div className="overflow-x-auto">
                    <table className="w-full border rounded-lg overflow-hidden">

                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-t dark:border-gray-700">

                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3 capitalize">{user.role}</td>

                                    <td className="p-3">
                                        {user.isBlocked ? (
                                            <span className="text-red-500 font-semibold">Blocked</span>
                                        ) : (
                                            <span className="text-green-500 font-semibold">Active</span>
                                        )}
                                    </td>

                                    <td className="p-3">

                                        {user.role !== "admin" && (
                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() => handleBlockToggle(user._id)}
                                                    className={`px-3 py-1 rounded text-white ${user.isBlocked
                                                            ? "bg-green-500"
                                                            : "bg-yellow-500"
                                                        }`}
                                                >
                                                    {user.isBlocked ? "Unblock" : "Block"}
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        )}

                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            )}

        </div>
    );
}

export default Users;