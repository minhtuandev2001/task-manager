import React, { useRef, useState } from 'react'
import Input from '../../components/input/Input'
import Button from '../../components/button/Button'
import CardProject from '../../components/card/CardProject'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Portal from '../../components/portal/Portal';
import Label from '../../components/label/Label';
import { motion } from "framer-motion"
import InputRangeDate from '../../components/input/InputRangeDate';
import Textarea from '../../components/input/Textarea';
import AddUser from '../../components/modal/AddUser';
import Alert from '../../components/alert/Alert';
import { IconThink } from '../../components/icons';

export default function Project() {
  const [showModalJoinProject, setShowModalJoinProject] = useState(false);
  const [showModalCreateProject, setShowModalCreateProject] = useState(false);
  const [nameProject, setNameProject] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("")
  const [showPickerDate, setShowPickerDate] = useState(false);
  const inputDateRef = useRef(null);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
  });
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [userListAdd, setUserListAdd] = useState({
    client: [],
    leader: [],
    member: [],
  })
  const [showAlertCancelCreate, setShowAlertCancelCreate] = useState(false)
  // chon ngay thang
  const clickDatePicker = (e) => {
    setCoords(inputDateRef.current.getBoundingClientRect());
    setShowPickerDate(true)
  }
  const handleSelectDate = (ranges) => {
    setStateDate([ranges.selection])
  }
  // ket thuc chon ngay thang

  // them client, leader, member vào du an
  const handleAddUser = (nameItemList, data) => {
    setUserListAdd(preData => {
      let userExist = preData[nameItemList].some((item) => item.id === data.id)
      return { ...preData, [nameItemList]: userExist ? preData[nameItemList] : [...preData[nameItemList], data] }
    })
  }

  const handleRmoveUser = (nameItemList, id) => {
    setUserListAdd(preData => ({ ...preData, [nameItemList]: preData[nameItemList].filter((item) => item.id !== id) }))
  }
  // ket thuc them client, leader, member vào du an

  // xử lý dừng tạo project
  const handleCancel = () => {
    setShowAlertCancelCreate(false)
    setShowModalCreateProject(false)
  }
  // kết thúc xử lý dừng tạo project
  const handleCreateProject = () => { }
  return (
    <>
      <div className='bg-white rounded-md pt-6 px-4 min-h-[calc(100vh-56px-24px)]'>
        <div className="flex justify-end gap-2 box-search">
          <Input
            type='text'
            name='search'
            className='w-full h-11 p-3 max-w-[246px] border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder="Search"
          ></Input>
          <Button
            onClick={() => setShowModalCreateProject(true)}
            className="button-default h-11 bg-button max-w-[110px] text-white font-medium"
          ><span>+ Create</span></Button>
          <Button
            onClick={() => setShowModalJoinProject(true)}
            className="button-default h-11 bg-button max-w-[110px] text-white font-medium"
          ><span>Join</span></Button>
        </div>
        <div className="grid gap-4 project-content sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <CardProject></CardProject>
        </div>
      </div>
      <Portal
        visible={showModalJoinProject}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[439px]"
        onClose={() => setShowModalJoinProject(false)}
      >
        <div className='px-6 py-4 bg-white rounded-md'>
          <Label className="text-base font-medium" >Key project</Label>
          <Input
            placeholder="Enter key project"
            className="w-full h-12 p-3 mt-4 border rounded-md border-graycustom bg-input focus:border-bluecustom"></Input>
          <Button className="font-medium text-white button-default bg-button mt-7">Join Project</Button>
        </div>
      </Portal>
      <Portal
        visible={showModalCreateProject}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[588px]"
        onClose={() => setShowAlertCancelCreate(true)}
      >
        <motion.div
          animate={{
            opacity: [0, 1],
            scale: [0.7, 1]
          }}
          key="projectShow"
          exit={{
            opacity: [1, 0],
            scale: [1, 0.5]
          }}
          transition={{ duration: 0.2 }}
          className='w-full p-6 bg-white rounded-md'>
          <div className='flex items-start justify-between w-full mb-2'>
            <div className='flex items-center flex-1 gap-2'>
              <input type="text"
                onChange={(e) => setNameProject(e.target.value)}
                className='w-full max-w-[380px] p-2 text-base font-semibold border rounded-md border-graycustom'
                placeholder='Enter your name project'
                value={nameProject}
              />
            </div>
            <Button
              onClick={() => setShowAlertCancelCreate(true)}
            ><span className='text-base font-semibold text-blue-500'>Cancel</span></Button>
          </div>
          <Button
            className='button-default w-auto bg-button bg-opacity-30 text-[#3754DB] h-auto px-4 py-2 rounded-full font-medium self-start'>On going
          </Button>
          {/* <Button
              disabled={isStatusRequest}
              onClick={() => handleStatusProject(statusProject)}
              className='button-default w-auto bg-[#00C271] bg-opacity-30 text-[#00C271] h-auto px-4 py-2 rounded-full font-medium self-start'>Done
            </Button>) */}
          <div className='grid grid-cols-2 gap-8 mb-3'>
            <div className="">
              <p className='mb-3 text-base font-medium'>Due Date</p>
              <InputRangeDate ref={inputDateRef} onClick={clickDatePicker} coords={coords} showPickerDate={showPickerDate} setShowPickerDate={setShowPickerDate} stateDate={stateDate} handleSelectDate={handleSelectDate}></InputRangeDate>
            </div>
          </div>
          <div className="mb-3">
            <p className='mb-2 text-base font-medium'>Description</p>
            <Textarea
              className="text-sm text-[#717279] border rounded-md border-graycustom resize-none overflow-hidden transition-all w-full p-2"
              placeholder="enter description your project"
              value={descriptionProject}
              setValue={setDescriptionProject}
            ></Textarea>
          </div>
          <AddUser nameItemList="client" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRmoveUser={handleRmoveUser}></AddUser>
          <AddUser nameItemList="leader" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRmoveUser={handleRmoveUser}></AddUser>
          <AddUser nameItemList="member" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRmoveUser={handleRmoveUser}></AddUser>
          <Button
            onClick={handleCreateProject}
            className="mt-5 mb-0 font-medium text-white button-default bg-button">Create Project</Button>
        </motion.div>
      </Portal>
      <Alert
        showAlert={showAlertCancelCreate}
      >
        <div
          transition={{ type: "spring", duration: 0.15 }}
          className='flex flex-col items-center w-full h-full gap-3 p-6 bg-white rounded-md'>
          <IconThink className='block w-12 h-12'></IconThink>
          <p className='text-base font-semibold text-center'>Do you want to continue creating the project?</p>
          <div className='flex items-center justify-between w-full mt-3'>
            <Button onClick={() => setShowAlertCancelCreate(false)} className="px-4 py-2 font-medium text-white rounded-md bg-button">continue</Button>
            <Button onClick={handleCancel} className="px-4 py-2 font-medium text-[#E80000] rounded-md bg-gray-300 bg-opacity-50">Cancel</Button>
          </div>
        </div>
      </Alert>
    </>
  )
}

