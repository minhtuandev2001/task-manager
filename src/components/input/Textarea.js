import React, { useEffect, useRef } from 'react';

const Textarea = ({ className, value, setValue, ...props }) => {
  const textareaRef = useRef(null);
  const handleChangeText = (e) => {
    textareaRef.current.style.height = 'auto';
    setValue(e.target.value)
  }
  useEffect(() => {
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
  }, [value])
  return (
    <textarea
      ref={textareaRef}
      className={className}
      defaultValue={value}
      onChange={handleChangeText}
      {...props}
    >
    </textarea>
  );
}

export default Textarea;
