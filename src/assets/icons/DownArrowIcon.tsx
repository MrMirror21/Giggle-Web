type Props = {
  isMarked: boolean;
};

const DownArrowIcon = ({ isMarked }: Props) => {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Iconography">
        <path
          id="Path 5"
          d="M15.875 6.375L9.5 12.75L3.125 6.375"
          stroke={isMarked ? '#695F96' : '#BDBDBD'}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default DownArrowIcon;
