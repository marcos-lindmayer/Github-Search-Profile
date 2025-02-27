const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d={
          filled
            ? "M10 15.77L16.18 19.5L14.54 12.47L20 7.74L12.81 7.13L10 0.5L7.19 7.13L0 7.74L5.46 12.47L3.82 19.5L10 15.77Z"
            : "M20 7.74L12.81 7.12L10 0.5L7.19 7.13L0 7.74L5.46 12.47L3.82 19.5L10 15.77L16.18 19.5L14.55 12.47L20 7.74ZM10 13.9L6.24 16.17L7.24 11.89L3.92 9.01L8.3 8.63L10 4.6L11.71 8.64L16.09 9.02L12.77 11.9L13.77 16.18L10 13.9Z"
        }
        fill={filled ? "#F2C94C" : "black"}
        fillOpacity={filled ? 1 : 0.54}
      />
    </svg>
  );
};

export default StarIcon;
