import { useEffect, useRef, useState } from "react";

export default function useClickOutSide() {
  const nodeRef = useRef(null);
  const [show, setShow] = useState(false)
  useEffect(() => {
    const handelClickOutSide = (e) => {
      // console.log(e.target) e.target đối tượng đang được nhấn
      if (nodeRef.current && !nodeRef.current.contains(e.target)) {
        setShow(false);
      }
    }
    document.addEventListener("click", handelClickOutSide)
    return () => {
      document.removeEventListener("click", handelClickOutSide)
    };
  }, []);

  return {
    nodeRef,
    show,
    setShow
  }
}