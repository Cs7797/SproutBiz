import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    coverImage: null,
    title: "",
    description: "",
    amountRequired: "",
    filesURL: "",
    equity:""
  });

  const navigate=useNavigate()

  const [invalidImageUrl, setInvalidImageUrl] = useState(false);
  const [invalidFilesUrl, setInvalidFilesUrl] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "coverImage") {
      setInvalidImageUrl(false); // Reset invalid image flag on change
    }
    if (name === "filesURL") {
      setInvalidFilesUrl(false); // Reset invalid files URL flag on change
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    let valid = true;
    if (!formData.coverImage  || invalidImageUrl) {
      setInvalidImageUrl(true);
      valid = false;
    }
    if (!formData.filesURL || !isValidFilesUrl(formData.filesURL)) {
      setInvalidFilesUrl(true);
      valid = false;
    }
    if (valid) {
     try {
      const res=await fetch('/api/champaign/create',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })
      const data=await res.json()
      if(data.success==false){
        console.log(data.message)
      }else{
        navigate(`/detailedChamapaign/${data._id}`)
        console.log(data)
      }
     } catch (error) {
      console.log(error)
     }
    }
  };

  const handleImageError = () => {
    setInvalidImageUrl(true);
  };

  const isValidFilesUrl = (url) => {
    // Regular expression to match URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  return (
    <div className="">
      <h1 className="text-center text-3xl font-bold mb-8">Create Campaign</h1>
      <div className="md:w-[65%] mx-auto p-6 bg-gray-100 shadow-md rounded-md">
      <div className="flex  justify-center">
        {formData.coverImage && !invalidImageUrl && (
          <img
            src={formData.coverImage}
            alt="Cover Image"
            onError={handleImageError}
            className="rounded-md mb-8"
          />
        )}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="coverImage" className="block mb-2">
            Cover Image URL:
          </label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            placeholder="Enter a Valid Image URL Relevant to your campaign"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-2 w-full mb-2"
          />
           {invalidImageUrl && (
          <p className="text-red-500 mb-2">Invalid image URL. Please enter a valid URL for the cover image.</p>
        )}
          <label htmlFor="title" className="block mb-2">
            Title:
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter Title for your Project"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            required
          />
          <label htmlFor="description" className="block mb-2">
            Description:
          </label>
          <textarea
            id="description"
          
            placeholder="Enter detailed description for your project, which can help investors to understand your project"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          ></textarea>
          <label htmlFor="amountRequired" className="block mb-2">
            Amount Required ( in USD ):
          </label>
          <input
            type="number"
            id="amountRequired"
            required
            
            placeholder="Enter Amount Required for Your project in USD"
            name="amountRequired"
            value={formData.amountRequired}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <label htmlFor="equity" className="block mb-2">
            Equity ( in % ):
          </label>
          <input
            type="number"
            id="equity"
            required
            
            placeholder="Equity You Want to Share"
            name="equity"
            value={formData.equity}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <label htmlFor="filesURL" className="block mb-2">
            Files URL:
          </label>
          <input
            type="url"
            id="filesURL"
            name="filesURL"
            required
            placeholder="Enter drive link for your project details"
            value={formData.filesURL}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
           {invalidFilesUrl && (
            <p className="text-red-500">Invalid files URL. Please enter a valid URL for the project details.</p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
