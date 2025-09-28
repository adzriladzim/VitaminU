export default function ManageClass() {
  const dummy = [
    { id: 1, name: "Lab Komputer 1", status: "Available" },
    { id: 2, name: "Lab Komputer 2", status: "Booked" },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-teal-700">Manage Classes</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {dummy.map((cls) => (
          <div
            key={cls.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg">{cls.name}</h2>
            <p className="text-gray-600 mb-2">Status: {cls.status}</p>
            <div className="space-x-2">
              <button className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600">
                Edit
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
