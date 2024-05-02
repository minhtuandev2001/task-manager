import React, { useEffect } from 'react'
import { createPortal } from "react-dom"

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
  useEffect(() => {
    document.body.appendChild(portalWrapperEle);
  }, [])
  const renderContent = (
    <div className={`${containerClassName} ${visible ? "" : "opacity-0 invisible"}`}
      style={containerStyle}
    >
      {overlay && <div className={`absolute inset-0 bg-black bg-opacity-50 overlay ${classOverlay}`} onClick={onClose}></div>}
      <div className={contentClassName}
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  )
  return createPortal(renderContent, portalWrapperEle)
}
