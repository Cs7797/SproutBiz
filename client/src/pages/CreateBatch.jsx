import { apiFetch } from "../lib/api";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateBatch = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amountRequired: "",
    timeRequired: "",
    filesURL: "",
  });

  const [invalidFilesUrl, setInvalidFilesUrl] = useState(false);

  const params = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "filesURL") {
      setInvalidFilesUrl(!isValidFilesUrl(value));

      // Reset invalid files URL flag on change
    }
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!isValidFilesUrl(formData.filesURL)) {
      setInvalidFilesUrl(true);
      valid = false;
    }
    if (valid) {
      try {
        const res = await apiFetch(`/api/champaign/createBatches/${params.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success == false) {
          console.log(data.message);
        } else {
          navigate(`/detailedChamapaign/${params.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isValidFilesUrl = (url) => {
    // Regular expression to match URL format

    if (url !== "") {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      return urlRegex.test(url);
    }
    return true;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Batch Title"
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            required
            onChange={handleChange}
            placeholder="Enter Description"
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amountRequired" className="block mb-1">
            Amount Required:
          </label>
          <input
            type="number"
            id="amountRequired"
            name="amountRequired"
            value={formData.amountRequired}
            required
            onChange={handleChange}
            placeholder="Enter Amount Required"
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="timeRequired" className="block mb-1">
            Time Required:
          </label>
          <input
            type="number"
            id="timeRequired"
            required
            name="timeRequired"
            value={formData.timeRequired}
            onChange={handleChange}
            placeholder="Enter Time Required in months"
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="filesURL" className="block mb-1">
            Files URL (Optional):
          </label>
          <input
            type="url"
            id="filesURL"
            name="filesURL"
            value={formData.filesURL}
            onChange={handleChange}
            placeholder="Enter Files URL"
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          {invalidFilesUrl && (
            <p className="text-red-500">
              Invalid files URL. Please enter a valid URL for the project
              details.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateBatch;
