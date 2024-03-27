import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";

const AddNotePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [category, setCategory] = useState("general");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }

      const formData = new FormData();
      formData.append("category", category);
      formData.append("title", title);
      formData.append("content", content);
      if (documentFile) {
        formData.append("document", documentFile);
      }

      if (reminderDate && category === "reminder") {
        formData.append("reminders[date]", reminderDate.toISOString());
        formData.append("reminders[status]", "pending");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      //https://note-management-system-backend-3.onrender.com
      await axios.post(
        "https://note-management-system-backend-3.onrender.com/api/v1/note/createNote",
        formData,
        {
          headers,
        }
      );

      showSuccessToast("Data Add successful!");
      setTimeout(() => {
        navigate("/userHome");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error creating note:", error);
      showErrorToast("Error creating note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Note</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-gray-700 font-bold mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="general">General</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-bold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter note title"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-gray-700 font-bold mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter note content"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="document"
              className="block text-gray-700 font-bold mb-2"
            >
              Document
            </label>
            <input
              type="file"
              id="document"
              onChange={(e) =>
                setDocumentFile(e.target.files ? e.target.files[0] : null)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="reminderDate"
              className="block text-gray-700 font-bold mb-2"
            >
              Reminder Date
            </label>
            <input
              type="datetime-local"
              id="reminderDate"
              onChange={(e) => setReminderDate(new Date(e.target.value))}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                category !== "reminder" ? "bg-gray-300" : ""
              }`}
              disabled={category !== "reminder"}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Note
            </button>
            <button
              type="button"
              onClick={() => navigate("/userHome")}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotePage;
