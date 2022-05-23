import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const handleWindowResize = (event) => {
      let timer;
      clearTimeout(timer);
      timer = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 300);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  return width || window.innerWidth;
};

export default useWindowSize;
