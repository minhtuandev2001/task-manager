import React, { useState } from 'react'
import Button from '../button/Button'
import { IconChevronDown } from '../icons'

import ShowModalSearchProject from './ShowModalSearchProject';

export default function DropdownChooseProject({ project, handleChooseProject, toogleChoose = true }) {
  const [showDropdow, setShowDropdown] = useState(false);
  return (
    <>
      <Button
        onClick={() => toogleChoose ? setShowDropdown(true) : {}}
        className="w-full">
        <div className='flex items-center justify-between p-3 mt-2 border rounded-md border-graycustom'>
          <p>{project ? project.title : "Choose Project"}</p>
          <IconChevronDown></IconChevronDown>
        </div>
      </Button>
      {project === null ? (
        <span className='block mb-2 text-xs italic font-medium text-red-500'>You must choose the project first</span>
      ) : (
        <span className='block mb-2'></span>
      )}
      {showDropdow && <ShowModalSearchProject showDropdow={showDropdow} setShowDropdown={setShowDropdown} handleChooseProject={handleChooseProject}></ShowModalSearchProject>}
    </>
  )
}
