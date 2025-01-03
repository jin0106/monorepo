import { useState } from "react";

const useSideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return { isExpanded, toggleExpanded };
};

export default useSideBar;
