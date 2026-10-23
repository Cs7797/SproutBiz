/* eslint-disable react/prop-types */

import './style.css';

const ProgressBar = ({ value }) => {

  return (
    <div className='py-4 px-1'>
      <progress
        value={value}
        max="100"
        style={{ '--value': `${value}`, '--max': '100' }}
      ></progress>
    </div>
  );
};

export default ProgressBar;
