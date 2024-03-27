import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";

const UserHomePage = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(
        "https://note-management-system-backend-3.onrender.com/api/v1/note/getAllNotes",
        { headers }
      );
      setNotes(response.data.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showErrorToast("Error fetching notes");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.delete(
        `https://note-management-system-backend-3.onrender.com/api/v1/note/deleteNote/${noteId}`,
        { headers }
      );

      showSuccessToast("Delete Success");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting note:", error);
      showErrorToast("Error deleting note");
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "pending":
        return "text-white bg-green-500"; // Green color for pending
      case "duetoday":
        return "text-white bg-orange-500"; // Orange color for due today
      case "expired":
        return "text-white bg-red-500"; // Red color for expired
      default:
        return "text-gray-500 bg-gray-200"; // Default gray color
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
          <Link
            to="/AddNotePage"
            className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Add New Note
          </Link>
        </div>
        {notes.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">No notes found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note: any) => (
              <div
                key={note._id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-4">{note.title}</h2>
                  <p className="text-gray-600 mb-6">{note.content}</p>
                  {note.document && (
                    <p className="text-gray-500 mb-4">
                      <a
                        href={note.document}
                        className="text-blue-500 hover:underline"
                        download
                      >
                        Download Document
                      </a>
                    </p>
                  )}
                </div>
                {note.reminders && (
                  <h4
                    className={`mb-2 ml-5 mr-5 ${getStatusColor(
                      note.reminders.status
                    )} border-2 rounded-lg px-4 py-2 text-center`}
                  >
                    {note.reminders.status}
                  </h4>
                )}
                <div className="p-4 bg-gray-100 flex justify-end">
                  <Link
                    to={`/EditNotePage/${note._id}`}
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 ease-in-out"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHomePage;
