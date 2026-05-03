import React, { useEffect, useState } from "react";
import { getAllUsersAPI, deleteUserAPI } from "../../services/allAPI";

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
        } finally {
            setLoading(false);
        }
    };

    // delete user
    const handleDelete = async (id) => {
        try {
            await deleteUserAPI(id);
            fetchUsers();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>

            <h1 className="text-xl font-bold mb-4">All Users</h1>

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
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-t dark:border-gray-700">

                                    <td className="p-3">
                                        {user.username}
                                    </td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>

                                    <td className="p-3">

                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
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