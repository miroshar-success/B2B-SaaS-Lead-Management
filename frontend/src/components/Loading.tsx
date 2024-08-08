import React from "react";

const Loading: React.FC = () => {
  return (
    <div
      className={`animate-spin rounded-full w-10 h-10 border-t-2 border-solid border-primary `}
    />
  );
};

export default Loading;
