import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import CampaignCard from '../components/CampaignCard';

const SearchResult = () => {

    const params = useParams();
    const queryTerm = params.searchTerm;

    const [data, setData] = useState();
   


    useEffect(() => {
        const getSearchRes = async (queryTerm) => {
          try {
            const res = await fetch(`/api/champaign/search?searchTerm=${queryTerm}`);
            const resdata = await res.json();
            setData(resdata);
          } catch (error) {
           console.log(error)
          }
        };
        getSearchRes(queryTerm);
      }, [queryTerm]);

      
      if(!data) return <div className=""> <Loader/> </div>
  return (
    <div className='md:mx-20'>
       <div className="my-6 px-6 ">
        <h1 className="text-center mb-6 font-semibold  text-4xl capitalize">
         Search Results for : {queryTerm}
        </h1>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          { data.length>0 ? data.map((item) => (
            <div key={item._id} className="">
              <CampaignCard item={item} />
            </div>
          )):"No Data found for you search" }
        </div>
      </div>
    </div>
  )
}

export default SearchResult