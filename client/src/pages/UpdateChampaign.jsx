import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

const UpdateChampaign = () => {
  const [champaignData, setChampaignData] = useState();

  useEffect(() => {
    fetchData();
  }, []);
  const params = useParams();
  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/champaign/getSpecChampaign/${params.id}`
      ); // replace with your backend endpoint
      const data = await response.json();
      setChampaignData(data);
    } catch (error) {
      console.error("Error fetching champaign data:", error);
    }
  };
// console.log(champaignData)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setChampaignData({ ...champaignData, [name]: value });
  };

  const handleBatchChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBatches = [...champaignData.batches];
    updatedBatches[index][name] = value;
    setChampaignData({ ...champaignData, batches: updatedBatches });
  };
const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const res= await fetch(`/api/champaign/updateChampaign/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...champaignData}),
     }); 
     const data=await res.json()
     console.log(data)
      alert("Champaign data updated successfully!");
      navigate(`/detailedChamapaign/${params.id}`)
    } catch (error) {
      console.error("Error updating champaign data:", error);
    }
  };
  if (!champaignData)
    return (
      <div className="">
        <Loader />
      </div>
    );
  return (
    <div className="container   py-8">
      <h1 className="text-2xl font-bold text-center mb-4">Edit Champaign</h1>
      <form className=" md:w-[70%] mx-auto bg-white p-8 shadow-md rounded-md" onSubmit={handleSubmit}>
        <div className="mb-6">
        <div className="flex justify-center">
    <img 
        src={champaignData.coverImage} 
        className="h-64 shadow-lg" // Adding shadow class here
        alt="" 
    />
</div>

          <label className="block  mb-6 font-semibold">
            Cover Image:
            <input
              type="text"
              className="w-full font-normal border border-gray-300 rounded px-3 mt-3 py-2 focus:outline-none focus:border-blue-500"
              name="coverImage"
              value={champaignData.coverImage}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Title:
          <input
            className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            type="text"
            name="title"
            value={champaignData.title}
            onChange={handleChange}
          />
        </label></div>
        <div className="mb-4">
        <label className="block font-semibold mb-2">
          Description:
          <textarea
            name="description"
            className="w-full border mt-3 font-normal border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            rows={6}
            value={champaignData.description}
            onChange={handleChange}
          />
        </label></div>
        <div className="mb-4">
        <label className="block font-semibold mb-2">
          Amount Required:
          <input
            type="number"
            name="amountRequired"
            className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={champaignData.amountRequired}
            onChange={handleChange}
          />
        </label></div>
        <div className="mb-4">
        <label className="block font-semibold mb-2">
          Equity:
          <input
            type="number"
            name="equity"
            className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={champaignData.equity}
            onChange={handleChange}
          />
        </label></div>
        <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Files URL:
          <input
            type="text"
            className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            name="filesURL"
            value={champaignData.filesURL}
            onChange={handleChange}
          />
        </label></div>
        <h1 className="font-bold text-center text-2xl mb-2">Batch Information</h1>
        {champaignData.batches.map((batch, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md mb-6">
          <div className="mb-4">
          <h1 className="font-bold text-center">Batch Number {batch.batchNumber}</h1>
            <label className="block font-semibold mb-2">
              Batch Title:
              <input
                type="text"
                name="title"
                className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={batch.title}
                onChange={(e) => handleBatchChange(index, e)}
              />
            </label></div>
            <div className="mb-4">
            <label className="block font-semibold mb-2">
              Batch Description:
              <textarea
              rows={5}
                type="text"
                className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                name="description"
                value={batch.description}
                onChange={(e) => handleBatchChange(index, e)}
              />
            </label></div>
            <div className="mb-4">
            <label className="block font-semibold mb-2">
              Batch TimeRequired:
              <input
                type="number"
                name="timeRequired"
                value={batch.timeRequired}
                className="w-full mt-3 border font-normal border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                onChange={(e) => handleBatchChange(index, e)}
              />
            </label></div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Batch amountRequired:
                <input
                  type="number"
                  name="amountRequired"
                  className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={batch.amountRequired}
                  onChange={(e) => handleBatchChange(index, e)}
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Status:
                <select
                  name="status"
                  value={batch.status}
                  onChange={(e) => handleBatchChange(index, e)}
                  className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"

                >
                  <option value="Not Started">Not Started</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Files URL:
                <input
                  className="w-full mt-3 font-normal border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"

                  type="text"
                  name="filesURL"
                  value={batch.filesURL}
                  onChange={(e) => handleBatchChange(index, e)}
                />
              </label>
            </div>
          </div>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Update Champaign
        </button>
      </form>
    </div>
  );
};

export default UpdateChampaign;
