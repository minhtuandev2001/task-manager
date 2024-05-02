import React from 'react'

export default function IconMoon({ className = "", onClick = () => { }, selected = false }) {
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
          d="M18.9618 10.79C18.8045 12.4922 18.1657 14.1144 17.1201 15.4668C16.0744 16.8192 14.6653 17.8458 13.0575 18.4265C11.4497 19.0073 9.7098 19.1181 8.04132 18.7461C6.37283 18.3741 4.84481 17.5345 3.63604 16.3258C2.42727 15.117 1.58775 13.589 1.21572 11.9205C0.843691 10.252 0.954531 8.51208 1.53528 6.9043C2.11602 5.29651 3.14265 3.88737 4.49503 2.84175C5.84741 1.79614 7.46961 1.15731 9.17182 1C8.17523 2.34827 7.69566 4.00945 7.82035 5.68141C7.94503 7.35338 8.66568 8.92506 9.85122 10.1106C11.0368 11.2961 12.6084 12.0168 14.2804 12.1415C15.9524 12.2662 17.6135 11.7866 18.9618 10.79Z"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

// stroke={selected ? "white" : "#717279"}