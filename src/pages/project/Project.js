import React, { useRef, useState } from 'react'
import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import CardProject from '../../components/card/CardProject'
import Portal from '../../components/portal/Portal'
import { IconCancel, IconStarFill } from '../../components/icons'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import InputRangeDate from '../../components/input/InputRangeDate'
import AddUser from '../../components/modal/AddUser'
import ModalAddUser from '../../components/modal/ModalAddUser'

export default function Project() {
  const [showProject, setShowProject] = useState(false);
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showPickerDate, setShowPickerDate] = useState(false);
  const inputDateRef = useRef(null);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
  });
  const [timeProject, setTimeProject] = useState({
    timeStart: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()),
    timeEnd: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()),
  })
  const [errorTime, setErrorTime] = useState("");

  const clickChooseDate = (e) => {
    setCoords(inputDateRef.current.getBoundingClientRect());
    setShowPickerDate(true)
    console.log("check ", stateDate)
  }
  const handleTimeProject = (e) => {
    console.log("check ", e)
    setErrorTime("")
    if (e.target.name === "timeStart") {
      let timeStartNew = new Date(`2024-05-03T${e.target.value}Z`);
      let timeEnd = new Date(`2024-05-03T${timeProject.timeEnd}Z`);
      if (timeEnd - timeStartNew < 0) { // thời gian bắt đầu không được lớn hơn thời gian kết thúc
        setErrorTime("Start time must be before end time")
      } else {
        setTimeProject(preTime => ({ ...preTime, [e.target.name]: e.target.value }))
      }
    } else {
      let timeEndNew = new Date(`2024-05-03T${e.target.value}Z`);
      let timeStart = new Date(`2024-05-03T${timeProject.timeStart}Z`);
      if (timeEndNew - timeStart < 0) { // thời gian bắt đầu không được lớn hơn thời gian kết thúc
        setErrorTime("Start time must be before end time")
      } else {
        setTimeProject(preTime => ({ ...preTime, [e.target.name]: e.target.value }))
      }
    }
  }
  const handleSelectDate = (ranges) => {
    setStateDate([ranges.selection])
  }
  const [userListAdd, setUserListAdd] = useState({
    client: [],
    leader: [],
    member: [],
  })

  const handleAddUser = (nameItemList, data) => {
    console.log("check ", data)
    console.log("check ", nameItemList)
    setUserListAdd(preData => {
      let userExist = preData[nameItemList].some((item) => item.id === data.id)
      return { ...preData, [nameItemList]: userExist ? preData[nameItemList] : [...preData[nameItemList], data] }
    })
  }
  const handleRmoveUser = (nameItemList, id) => {
    setUserListAdd(preData => ({ ...preData, [nameItemList]: preData[nameItemList].filter((item) => item.id !== id) }))
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
              <p className='mb-3 text-base font-medium'>Due Date</p>
              <InputRangeDate ref={inputDateRef} onClick={clickChooseDate} coords={coords} showPickerDate={showPickerDate} setShowPickerDate={setShowPickerDate} stateDate={stateDate} setStateDate={setStateDate} handleSelectDate={handleSelectDate}></InputRangeDate>
            </div>
            <div className="">
              <p className='mb-3 text-base font-medium'>Time</p>
              <div className="flex items-center gap-1">
                <div htmlFor='timeStart' className='flex items-center border border-[#787486] h-10 rounded-md px-2 justify-center cursor-pointer'>
                  <input
                    onChange={handleTimeProject}
                    defaultValue={timeProject.timeStart}
                    type="time" id="timeStart" name="timeStart" className='text-sm font-medium text-[#787486] tracking-wider' />
                </div>
                <span>-</span>
                <div className='flex items-center border border-[#787486] h-10 rounded-md px-2 justify-center cursor-pointer'>
                  <input
                    onChange={handleTimeProject}
                    defaultValue={timeProject.timeEnd}
                    type="time" id="timeEnd" name="timeEnd" className='text-sm font-medium text-[#787486] tracking-wider' />
                </div>
              </div>
              {errorTime && <span className='text-xs italic font-medium text-red-500'>*{errorTime}</span>}
            </div>
          </div>
          <div className="mb-3">
            <p className='mb-2 text-base font-medium'>Description</p>
            <p className='text-sm text-[#717279]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto veritatis et aspernatur ducimus temporibus repellat eos possimus esse ea, error, in, quidem debitis enim alias nemo eum quam voluptate fugiat sequi quae consequuntur quo voluptates sapiente! Veritatis blanditiis dicta sunt, impedit atque dolorem accusantium nemo quas corporis harum magnam adipisci!</p>
          </div>
          <AddUser nameItemList="client" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRmoveUser={handleRmoveUser}></AddUser>
          <AddUser nameItemList="leader" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRmoveUser={handleRmoveUser}></AddUser>
          <AddUser nameItemList="member" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRmoveUser={handleRmoveUser}></AddUser>
          <Button className="button-default bg-button mb-0 text-white font-medium mt-5">Update</Button>
        </div>
      </Portal>
    </div>
  )
}

