import React, { useState } from 'react'
import Button from '../button/Button'
import { IconChevronDown } from '../icons'
import Portal from '../portal/Portal';
import Input from '../input/Input';
import Label from '../label/Label';

export default function DropdownChooseProject() {
  const [showDropdow, setShowDropdown] = useState(false);
  return (
    <>
      <Button
        onClick={() => setShowDropdown(true)}
        className="w-full">
        <div className='flex items-center justify-between p-3 mt-3 border rounded-md border-graycustom'>
          <p>Choose Project</p>
          <IconChevronDown></IconChevronDown>
        </div>
      </Button>
      <Portal
        visible={showDropdow}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[439px]"
        onClose={() => setShowDropdown(false)}
        classOverlay="bg-opacity-10"
      >
        <div className='w-full h-full px-6 py-3 bg-white rounded-md shadow-md'>
          <Label className="text-base font-medium" >Choose Project</Label>
          <Input
            placeholder="Enter name project"
            className="w-full h-10 p-3 my-3 border rounded-md border-graycustom bg-input focus:border-bluecustom"></Input>
          <div className='flex flex-col items-start gap-1 h-full overflow-y-scroll no-scrollbar max-h-[300px]'>

            <Button className="flex items-center w-full px-2 transition-all rounded-md hover:bg-gray-100 min-h-10 max-h-10">
              <span className='text-sm font-medium line-clamp-1'>Create a Design System for Enum Workspace.
              </span>
            </Button>

          </div>
        </div>
      </Portal>
    </>
  )
}
