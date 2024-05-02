import React, { forwardRef } from 'react'
import { IconCalender } from '../icons'
import Portal from '../portal/Portal'
import { DateRange } from 'react-date-range'

const InputRangeDate = forwardRef(({ onClick = () => { }, coords, showPickerDate, setShowPickerDate, stateDate, setStateDate }, inputDateRef) => {
  return (
    <>
      <div
        ref={inputDateRef}
        onClick={onClick}
        className='flex items-center border border-[#787486] h-10 rounded-md justify-between px-[10px] cursor-pointer'>
        <span className='text-sm font-medium text-[#787486]'>05/02/2024</span>
        <IconCalender></IconCalender>
      </div>
      <Portal
        visible={showPickerDate}
        overlay={true}
        containerClassName="fixed inset-0 z-[9999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[332px] absolute"
        contentStyle={{
          left: coords.left,
          top: coords.top + coords.height + window.scrollY,
        }}
        onClose={() => setShowPickerDate(false)}
        classOverlay="bg-transparent z-40"
      >
        <div className="w-auto shadow-md max-w-[332px] rounded-md overflow-hidden">
          <DateRange
            editableDateInputs={true}
            onChange={item => setStateDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={stateDate}
          />
        </div>
      </Portal>

    </>
  )
})
export default InputRangeDate;