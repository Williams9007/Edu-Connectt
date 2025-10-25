import { useState } from "react";

export default function AssignSubjectModal({ users, subjects, isOpen, onClose }) {
  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const handleAssign = async () => {
    if (!teacherId || !subjectId) return;
    await fetch("/api/admin/assign-subject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId, subjectId }),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-semibold mb-3">Assign Subject to Teacher</h2>
        <select
          className="w-full border p-2 rounded mb-2"
          value={teacherId}
          onChange={e => setTeacherId(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
        <select
          className="w-full border p-2 rounded mb-2"
          value={subjectId}
          onChange={e => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleAssign}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
