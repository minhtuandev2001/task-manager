import React from 'react';
import { IconCSV, IconDOC, IconFILE1, IconJPG, IconMP4, IconPDF, IconRAR, IconXSL, IconZIP } from '../icons';

const ThumbnailFile = ({ fileExtension }) => {
  switch (fileExtension) {
    case "docx":
      return <IconDOC></IconDOC>
    case "pdf":
      return <IconPDF></IconPDF>
    case "xlsx":
      return <IconXSL></IconXSL>
    case "mp4":
      return <IconMP4></IconMP4>
    case "rar":
      return <IconRAR></IconRAR>
    case "csv":
      return <IconCSV></IconCSV>
    case "zip":
      return <IconZIP></IconZIP>
    case "png":
      return <IconJPG></IconJPG>
    case "jpg":
      return <IconJPG></IconJPG>
    default:
      return <IconFILE1></IconFILE1>
  }
}

export default ThumbnailFile;
