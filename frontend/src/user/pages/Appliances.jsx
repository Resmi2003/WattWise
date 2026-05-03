import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Trash2, Pencil } from "lucide-react";
import { updateApplianceAPI } from "../../services/allAPI";

import {
  getAppliancesAPI,
  addApplianceAPI,
  deleteApplianceAPI
} from "../../services/allAPI";

function Appliances() {
  const { appliances, setAppliances } = useAppContext();

  const [name, setName] = useState("");
  const [power, setPower] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔽 ADD THIS
  const [loading, setLoading] = useState(true);

  // LOAD FROM BACKEND
  useEffect(() => {
    const fetchAppliances = async () => {

      // 🔽 ADD THIS
      setLoading(true);

      const token = sessionStorage.getItem("token");

      const reqHeader = {
        Authorization: `Bearer ${token}`
      };

      const result = await getAppliancesAPI(reqHeader);

      if (result.status === 200) {
        setAppliances(result.data);
      }

      // 🔽 ADD THIS
      setLoading(false);
    };

    fetchAppliances();
  }, [setAppliances]);

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !power) return;

    const token = sessionStorage.getItem("token");

    const reqHeader = {
      Authorization: `Bearer ${token}`
    };

    if (editId) {
      await updateApplianceAPI(editId, { name, power }, reqHeader);
      setEditId(null);
    } else {
      await addApplianceAPI({ name, power }, reqHeader);
    }

    const result = await getAppliancesAPI(reqHeader);
    if (result.status === 200) {
      setAppliances(result.data);
    }

    setName("");
    setPower("");
  };

  // DELETE
  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");

    const reqHeader = {
      Authorization: `Bearer ${token}`
    };

    await deleteApplianceAPI(id, reqHeader);

    const result = await getAppliancesAPI(reqHeader);
    if (result.status === 200) {
      setAppliances(result.data);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPower(item.power);
    setEditId(item._id);
  };

  return (
    <div className="space-y-8">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-xl p-6 shadow-sm
        transition-colors duration-200"
      >
        <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
          {editId ? "Edit Appliance" : "Add Appliance"}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Appliance Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border rounded-lg
            bg-gray-50 dark:bg-gray-700
            text-gray-800 dark:text-white
            border-gray-300 dark:border-gray-600
            transition-colors duration-200"
          />

          <input
            type="number"
            placeholder="Power (W)"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            className="p-3 border rounded-lg
            bg-gray-50 dark:bg-gray-700
            text-gray-800 dark:text-white
            border-gray-300 dark:border-gray-600
            transition-colors duration-200"
          />

          <button
            className="bg-blue-600 hover:bg-blue-700
            text-white rounded-lg px-4 py-2 transition"
          >
            {editId ? "Update" : "Add"}
          </button>

        </div>
      </form>

      {/* 🔽 ONLY THIS PART CHANGED */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      ) : appliances.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No appliances added yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {appliances.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-xl p-5
              shadow-sm hover:shadow-md
              transition-all duration-200 hover:-translate-y-0.5
              text-gray-800 dark:text-white"
            >
              <h3 className="font-semibold text-lg">{item.name}</h3>

              <p className="text-gray-500 dark:text-gray-300 mt-1">
                {item.power} W
              </p>

              <div className="flex gap-4 mt-4">

                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 hover:scale-110 transition"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Appliances;