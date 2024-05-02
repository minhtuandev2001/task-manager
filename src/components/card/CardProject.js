import React from 'react'
import Button from '../button/Button'
import { IconCalender, IconDelete, IconEdit, IconStarFill } from '../icons'

export default function CardProject({ onShow }) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-md shadow-md cursor-pointer card-project" onClick={onShow}>
      <div className='flex'>
        <h2 className='text-base font-semibold line-clamp-1'>Create a Design System for Enum Workspace.</h2>
        <button type='button'>
          <IconStarFill></IconStarFill>
        </button>
      </div>
      <Button className='button-default w-auto bg-button bg-opacity-30 text-[#3754DB] h-auto px-4 py-2 rounded-full font-medium self-start'>On going</Button>
      <div className='flex items-center gap-3'>
        <IconCalender></IconCalender>
        <span className='text-sm font-normal text-[#717279]'>20/2 - 20/3/2024</span>
      </div>
      <div className="text-sm font-normal text-[#717279]">
        <p className='line-clamp-3'>Lorem ipsum dolor sit amet consectetur. A cursus arcu dui blandit. Aliquam malesuada adipiscing consectetur habitant sem erat egestas vestibulum arcu. At adipiscing id laoreet.</p>
      </div>
      <div className='flex gap-4'>
        <Button className='button-default bg-[#00C271] text-white rounded-md font-medium mb-0'>Done</Button>
        <Button className='button-default bg-[#FFF0F0] w-full max-w-12 h-12 text-white rounded-md font-medium mb-0'><IconDelete></IconDelete></Button>
        <Button className='button-default bg-[#F6F8FD] w-full max-w-12 h-12 text-white rounded-md font-medium mb-0'><IconEdit></IconEdit></Button>
      </div>
    </div>
  )
}
