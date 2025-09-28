export default function Request() {
  const requests = [
    { id: 1, user: "Ahmad", class: "Lab Komputer 1" },
    { id: 2, user: "Siti", class: "Lab Komputer 2" },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-cyan-700">Booking Requests</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-teal-100">
            <th className="border p-2 text-left">User</th>
            <th className="border p-2 text-left">Class</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border p-2">{r.user}</td>
              <td className="border p-2">{r.class}</td>
              <td className="border p-2 text-center space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
