import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react'
import { createPortal } from "react-dom"
import { useDarkMode } from '../../context/darkModeContext';

function portalWrapper() {
  const element = document.createElement('div');
  element.id = "portal-wrapper";
  return element;
}

const portalWrapperEle = portalWrapper();

export default function Portal({
  visible = true,
  overlay = true,
  children,
  onClose = () => { },
  containerClassName = "",
  containerStyle = {},
  contentClassName = "",
  contentStyle = {},
  classOverlay = ''
}) {
  const { darkMode, setDarkMode } = useDarkMode();
  useEffect(() => {
    document.body.appendChild(portalWrapperEle);
  }, [])
  const renderContent = (
    <AnimatePresence>
      {visible ?
        (<div
          className={`${containerClassName} ${visible ? "" : "opacity-0 invisible"} ${darkMode ? 'dark' : 'light'}`}
          style={containerStyle}
        >
          {overlay && <div className={`absolute inset-0 bg-black bg-opacity-50 overlay ${classOverlay}`} onClick={onClose}></div>}
          <div className={contentClassName}
            style={contentStyle}
          >
            {children}
          </div>
        </div>)
        : null}
    </AnimatePresence>
  )
  return createPortal(renderContent, portalWrapperEle)
}
