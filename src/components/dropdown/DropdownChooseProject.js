import React, { useState } from 'react'
import Button from '../button/Button'
import { IconChevronDown } from '../icons'

import ShowModalSearchProject from './ShowModalSearchProject';

export default function DropdownChooseProject({ project, handleChooseProject }) {
  const [showDropdow, setShowDropdown] = useState(false);
  return (
    <>
      <Button
        onClick={() => setShowDropdown(true)}
        className="w-full">
        <div className='flex items-center justify-between p-3 mt-2 border rounded-md border-graycustom'>
          <p>{project ? project.title : "Choose Project"}</p>
          <IconChevronDown></IconChevronDown>
        </div>
      </Button>
      {project === null ? (
        <span className='block mb-2 text-xs italic font-medium text-red-500'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, earum!</span>
      ) : (
        <span className='block mb-2'></span>
      )}
      {showDropdow && <ShowModalSearchProject showDropdow={showDropdow} setShowDropdown={setShowDropdown} handleChooseProject={handleChooseProject}></ShowModalSearchProject>
      }
    </>
  )
}
