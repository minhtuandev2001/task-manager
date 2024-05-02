import React, { useRef, useState } from 'react'
import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import CardProject from '../../components/card/CardProject'
import Portal from '../../components/portal/Portal'
import { IconStarFill } from '../../components/icons'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import InputRangeDate from '../../components/input/InputRangeDate'

export default function Project() {
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);
  const [showProject, setShowProject] = useState(false);
  const [showPickerDate, setShowPickerDate] = useState(false);
  const inputDateRef = useRef(null);
  const [coords, setCoords] = useState({
    left: 0,
    top: 0
  });
  const clickChooseDate = (e) => {
    setCoords(inputDateRef.current.getBoundingClientRect());
    setShowPickerDate(true)
  }
  const handleDoneProjecy = (id) => { }
  return (
    <div className='bg-white rounded-md pt-6 px-4 min-h-[calc(100vh-56px-24px)]'>
      <div className="flex justify-end gap-2 box-search">
        <Input
          type='text'
          name='search'
          className='w-full h-11 p-3 max-w-[246px] border rounded-md border-graycustom bg-input focus:border-bluecustom'
          placeholder="Search"
        ></Input>
        <Button
          className="button-default h-11 bg-button max-w-[110px] text-white font-medium"
        ><span>+ Create</span></Button>
        <Button
          className="button-default h-11 bg-button max-w-[110px] text-white font-medium"
        ><span>Join</span></Button>
      </div>
      <div className="grid gap-4 project-content sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
        <CardProject onShow={() => setShowProject(true)}></CardProject>
      </div>
      <Portal
        visible={showProject}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[588px]"
        onClose={() => setShowProject(false)}
      >
        <div className='w-full p-6 bg-white rounded-md'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start gap-2'>
              <h2 className='text-base font-semibold line-clamp-3'>Create a Design System for Enum Workspace.</h2>
              <button type='button'>
                <IconStarFill></IconStarFill>
              </button>
            </div>
            <Button><span className='text-[#E80000] text-base font-medium'>Delete</span></Button>
          </div>
          <Button className='button-default w-auto bg-button bg-opacity-30 text-[#3754DB] h-auto px-4 py-2 rounded-full font-medium self-start'>On going</Button>
          <div className='grid grid-cols-2 gap-8 mb-3'>
            <div className="">
              <p className='mb-3 text-sm font-medium'>Due Date</p>
              <InputRangeDate ref={inputDateRef} onClick={clickChooseDate} coords={coords} showPickerDate={showPickerDate} setShowPickerDate={setShowPickerDate} stateDate={stateDate} setStateDate={setStateDate}></InputRangeDate>
            </div>
            <div className="">
              <p className='mb-3 text-sm font-medium'>Time</p>
              <div className="flex items-center gap-5 ">
                <div className='flex items-center border border-[#787486] h-10 rounded-md justify-center px-[10px] cursor-pointer'>
                  <span className='text-sm font-medium text-[#787486]'>11:00 AM</span>
                </div>
                <span>-</span>
                <div className='flex items-center border border-[#787486] h-10 rounded-md justify-center px-[10px] cursor-pointer'>
                  <span className='text-sm font-medium text-[#787486]'>11:00 AM</span>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <p className='mb-3 text-sm font-medium'>Description</p>
            <p className='text-sm text-[#717279]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto veritatis et aspernatur ducimus temporibus repellat eos possimus esse ea, error, in, quidem debitis enim alias nemo eum quam voluptate fugiat sequi quae consequuntur quo voluptates sapiente! Veritatis blanditiis dicta sunt, impedit atque dolorem accusantium nemo quas corporis harum magnam adipisci!</p>
          </div>
        </div>
      </Portal>
    </div>
  )
}
