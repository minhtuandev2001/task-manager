import React, { useRef, useState } from 'react'
import { IconCalender } from '../icons'
import Portal from '../portal/Portal'
import { DateRange } from 'react-date-range'

const InputRangeDate = ({ stateDate, handleSelectDate }) => {
  const inputDateRef = useRef(null);
  const [showPickerDate, setShowPickerDate] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
  });
  const clickDatePicker = (e) => {
    setCoords(inputDateRef.current.getBoundingClientRect());
    setShowPickerDate(true)
  }
  return (
    <>
      <div
        ref={inputDateRef}
        onClick={clickDatePicker}
        className='flex items-center border border-graycustom h-10 rounded-md justify-between px-[10px] cursor-pointer'>
        <span className='text-sm font-medium text-[#787486] tracking-wider'>{
          (stateDate[0].startDate.getFullYear() === stateDate[0].endDate.getFullYear()) ?
            // cung nam
            (stateDate[0].startDate.getMonth() === stateDate[0].endDate.getMonth()) ?
              (stateDate[0].startDate.getDate() + '-' + stateDate[0].endDate.getDate() + '/' + (stateDate[0].endDate.getMonth() + 1) + '/' + stateDate[0].endDate.getFullYear())
              : (stateDate[0].startDate.getDate() + '/' + (stateDate[0].startDate.getMonth() + 1) + '-' + stateDate[0].endDate.getDate() + '/' + (stateDate[0].endDate.getMonth() + 1) + '/' + stateDate[0].endDate.getFullYear())
            :
            // khac nam
            stateDate[0].startDate.getDate() + "/" + stateDate[0].startDate.getMonth() + "/" + stateDate[0].startDate.getFullYear() + " - " + stateDate[0].endDate.getDate() + "/" + stateDate[0].endDate.getMonth() + "/" + stateDate[0].endDate.getFullYear()
        }</span>
        <IconCalender></IconCalender>
      </div>
      <Portal
        visible={showPickerDate}
        overlay={true}
        containerClassName="fixed inset-0 z-[9999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[332px] absolute"
        contentStyle={{
          left: coords.left,
          top: coords.top + coords.height || "0px",
        }}
        onClose={() => setShowPickerDate(false)}
        classOverlay="bg-transparent z-40"
      >
        <div className="w-auto shadow-md max-w-[332px] rounded-md overflow-hidden">
          <DateRange
            editableDateInputs={true}
            onChange={handleSelectDate}
            moveRangeOnFirstSelection={false}
            ranges={stateDate}
          />
        </div>
      </Portal>
    </>
  )
}
export default InputRangeDate;
