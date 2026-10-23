/* eslint-disable react/prop-types */
import './style.css';

const StatusIndicator = ({ item }) => {
  const statusClass = {
    'Not Started': 'bg-red-500 text-white px-2 py-2 rounded-full mr-2',
    'Ongoing': 'bg-yellow-500 h-4 text-black px-2 py-1 rounded-full  mr-2',
    'Completed': 'bg-green-500 h-4 text-white px-2 py-1 rounded-full mr-2',
  };

  return (
    <span className="flex items-center">
      <span className={`${statusClass[item]} blink`}></span>
      {item}
    </span>
  );
};

export default StatusIndicator;
