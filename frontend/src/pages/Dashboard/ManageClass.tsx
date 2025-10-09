import { useClasses } from "../../hooks/useClasses";


type ClassStatus = "Available" | "Booked" | "In Use" | "Pending";

export default function ManageClass() {
  // Panggil hook untuk mendapatkan semua yang kita butuhkan dalam satu baris!
  const {
    classes,
    editingId,
    currentStatus,
    setCurrentStatus,
    handleApprove,
    handleEditClick,
    handleCancel,
    handleSave,
  } = useClasses();

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-teal-700">Manage Classes</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="font-semibold text-lg mb-2">{cls.name}</h2>

            {editingId === cls.id ? (
              <div className="space-y-3">
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as ClassStatus)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="In Use">In Use</option>
                  <option value="Pending">Pending</option>
                </select>
                <div className="space-x-2">
                  <button onClick={() => handleSave(cls.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Save
                  </button>
                  <button onClick={handleCancel} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Status: <span className="font-medium">{cls.status}</span>
                </p>
                <div className="space-x-2">
                  {cls.status === 'Available' && (
                    <button onClick={() => handleApprove(cls.id)} className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600">
                      Approve
                    </button>
                  )}
                  <button onClick={() => handleEditClick(cls)} className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600">
                    Edit Status
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
