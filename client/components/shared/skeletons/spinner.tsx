const Spinner = ({size,color} : {size:number, color?: string}) => {
  return (
      <div className="w-full h-full my-auto mx-auto flex items-center justify-center bg-transparent bg-opacity-60 z-50">
        <div className="text-center text-white">
          <svg
            className={`animate-spin h-[${size}px] w-[${size}px] text-blue-900 dark:text-blue-100`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              r="35"
              strokeDasharray="164.93361431346415 56.97787143782138"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="0 50 50;360 50 50"
              ></animateTransform>
            </circle>
          </svg>
        </div>
      </div>
    );
}

export default Spinner