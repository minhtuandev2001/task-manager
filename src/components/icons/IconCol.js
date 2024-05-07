import React from 'react';

const IconCol = ({ className = "", onClick = () => { }, selected = false }) => {
  return (
    <span className={className} onClick={onClick}>
      <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H17C18.1046 19 19 18.1046 19 17V3C19 1.89543 18.1046 1 17 1Z"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 5H5V14H8V5Z"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 5H12V10H15V5Z"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg> </span>
  );
}

export default IconCol;
