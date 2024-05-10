import React, { useContext, useState } from 'react'
import Button from '../button/Button'
import { IconCalender, IconDelete, IconEdit, IconStarFill, IconStarOutline, IconThink } from '../icons'
import AddUser from '../modal/AddUser'
import InputRangeDate from '../input/InputRangeDate'
import Portal from '../portal/Portal'
import Textarea from '../input/Textarea'
import Alert from '../alert/Alert'
import { motion } from "framer-motion"
import { toast } from 'react-toastify';
import axios from 'axios'
import { AuthContext } from "../../context/authContext"
import { BASE_URL } from "../../constans/url"
import { statusList } from '../../constans/status'
export default function CardProject({ data }) {
  const { currentUser } = useContext(AuthContext)
  const [showProject, setShowProject] = useState(false);
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(data.date.timeStart),
      endDate: new Date(data.date.timeEnd),
      key: 'selection'
    }
  ]);

  const [userListAdd, setUserListAdd] = useState({
    client: data.client,
    leader: data.leader,
    member: data.member,
  })
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [nameProject, setNameProject] = useState(data.title);
  const [descriptionProject, setDescriptionProject] = useState(data.description)
  const [statusProject, setStatusProject] = useState(data.status);
  const [showAlertCancelUpdate, setShowAlertCancelUpdate] = useState(false)
  const [starProject, setStarProject] = useState(data.star);

  // chon ngay thang
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

  const handleRemoveUser = (nameItemList, id) => {
    setUserListAdd(preData => ({ ...preData, [nameItemList]: preData[nameItemList].filter((item) => item.id !== id) }))
  }
  // ket thuc them client, leader, member vào du an

  const handleUpdateProject = async () => {
    setShowAlertCancelUpdate(false)
    let timeStart = (stateDate[0].startDate.getMonth() + 1) + "/" + stateDate[0].startDate.getDate() + "/" + stateDate[0].startDate.getFullYear()
    let timeEnd = (stateDate[0].endDate.getMonth() + 1) + "/" + stateDate[0].endDate.getDate() + "/" + stateDate[0].endDate.getFullYear()
    try {
      const response = await axios.patch(`${BASE_URL}/project/update/${data._id}`, {
        title: nameProject,
        star: starProject,
        status: statusProject,
        date: {
          timeStart: timeStart,
          timeEnd: timeEnd
        },
        description: descriptionProject,
        client: userListAdd.client,
        leader: userListAdd.leader,
        member: userListAdd.member,
      }, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      })
      toast.success("Update project success")
    } catch (err) {
      handleResetData();
      toast.error(err.response.data.messages)
    }
    // cập nhật project xong thì bắt đầu mới chuyển về lại chế độ xem
    setToggleUpdate(false)
  }
  const handleCancel = () => {
    setShowAlertCancelUpdate(false)
    setShowProject(false)
    handleResetData()
    setToggleUpdate(false)
  }

  const handleResetData = () => {
    setStateDate([
      {
        startDate: new Date(data.date.timeStart),
        endDate: new Date(data.date.timeEnd),
        key: 'selection'
      }
    ])
    setUserListAdd({
      client: data.client,
      leader: data.leader,
      member: data.member,
    })
    setNameProject(data.title)
    setDescriptionProject(data.description)
    setStatusProject(data.status)
    setStarProject(data.star)
  }

  // xử lý trạng thái project
  const handleStatusProject = (status) => {
    switch (status) {
      case "going":
        // chuyển sáng pause
        setStatusProject("pause") // cập nhật ngay
        break;
      case "pause":
        setStatusProject("done") // cập nhật ngay
        // chuyển sáng done
        break;
      case "done":
        setStatusProject("going") // cập nhật ngay
        // chuyển sáng going
        break;
      default:
        break;
    }
  }
  // kết thúc xử lý trạng thái project
  const handleDoneProject = () => {
    console.log("check done",)
  }
  const handleRemoveProject = () => {
    console.log("check delete",)
  }
  const handleStarProject = () => {
    let newStar = starProject === 0 ? 1 : 0;
    // call api , lỗi thì trở về state ban đầu
    axios.patch(`${BASE_URL}/project/change-star/${data._id}`, {
      star: newStar,
    }, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      toast.success(`${newStar === 0 ? "Unstar" : "Star"} project success`)
      setStarProject(newStar)
    }).catch((err) => {
      toast.error(err.response.data.messages)
    })
  }
  return (
    <>
      <div className="flex flex-col gap-3 p-6 rounded-md shadow-md cursor-pointer card-project">
        <div className='flex justify-between gap-2'>
          <h2 className='text-base font-semibold line-clamp-1'>{nameProject}</h2>
          <button type='button'
            className='w-full max-w-[20px]'
            onClick={handleStarProject}>
            {starProject !== 0 ?
              <IconStarFill></IconStarFill>
              :
              <IconStarOutline></IconStarOutline>
            }
          </button>
        </div>
        {statusProject === "going" && (
          <Button
            className='button-default w-auto bg-button bg-opacity-30 text-sm text-[#3754DB] h-auto px-4 py-[6px] rounded-full font-medium self-start mb-0'>On going
          </Button>)}
        {statusProject === "pause" && (
          <Button
            className='button-default w-auto bg-[#ED3159] bg-opacity-30 text-sm text-[#ED3159] h-auto px-4 py-[6px] rounded-full font-medium self-start mb-0'>Pause
          </Button>)}
        {statusProject === "done" && (
          <Button
            className='button-default w-auto bg-[#00C271] bg-opacity-30 text-sm text-[#00C271] h-auto px-4 py-[6px] rounded-full font-medium self-start mb-0'>Done
          </Button>)}
        <div className='flex items-center gap-3'>
          <IconCalender></IconCalender>
          <span className='text-base font-medium text-[#717279] tracking-widest'>
            {
              (stateDate[0].startDate.getFullYear() === stateDate[0].endDate.getFullYear()) ?
                // cung nam
                (stateDate[0].startDate.getMonth() === stateDate[0].endDate.getMonth()) ?
                  (stateDate[0].startDate.getDate() + '-' + stateDate[0].endDate.getDate() + '/' + (stateDate[0].endDate.getMonth() + 1) + '/' + stateDate[0].endDate.getFullYear())
                  : (stateDate[0].startDate.getDate() + '/' + (stateDate[0].startDate.getMonth() + 1) + '-' + stateDate[0].endDate.getDate() + '/' + (stateDate[0].endDate.getMonth() + 1) + '/' + stateDate[0].endDate.getFullYear())
                :
                // khac nam
                stateDate[0].startDate.getDate() + "/" + stateDate[0].startDate.getMonth() + "/" + stateDate[0].startDate.getFullYear() + " - " + stateDate[0].endDate.getDate() + "/" + stateDate[0].endDate.getMonth() + "/" + stateDate[0].endDate.getFullYear()
            }
          </span>
        </div>
        <div className="text-sm font-normal text-[#717279]">
          <p className='line-clamp-3'>{descriptionProject}</p>
        </div>
        <div className='flex gap-4 mt-auto'>
          <Button
            onClick={handleDoneProject}
            className='button-default bg-[#00C271] text-white rounded-md font-medium mb-0'>Done</Button>
          <Button
            onClick={handleRemoveProject}
            className='button-default bg-[#FFF0F0] w-full max-w-12 h-12 text-white rounded-md font-medium mb-0'><IconDelete></IconDelete></Button>
          <Button
            onClick={() => setShowProject(true)}
            className='button-default bg-[#F6F8FD] w-full max-w-12 h-12 text-white rounded-md font-medium mb-0'><IconEdit></IconEdit></Button>
        </div>
      </div>
      <Portal
        visible={showProject}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[588px]"
        onClose={() => toggleUpdate ? setShowAlertCancelUpdate(true) : setShowProject(false)}
      >
        <motion.div
          animate={{
            opacity: [0, 1],
            scale: [0.7, 1]
          }}
          key="projectShow"
          exit={{
            opacity: [1, 0],
            scale: [1, 0.9]
          }}
          transition={{ duration: 0.2 }}
          className='w-full p-6 bg-white rounded-md'>
          <div className='flex items-start justify-between w-full mb-2'>
            <div className='flex items-center flex-1 gap-2'>
              {toggleUpdate ? (
                <input type="text"
                  onChange={(e) => setNameProject(e.target.value)}
                  className='w-full max-w-[380px] p-2 text-base font-semibold border rounded-md border-graycustom'
                  defaultValue="Create a Design System for Enum Workspace."
                />
              ) : (
                <h2 className='text-base font-semibold line-clamp-3 w-full max-w-[380px]'>{nameProject}</h2>
              )}
              {toggleUpdate ? (
                <button type='button'
                  className='w-full max-w-[20px]'
                  onClick={handleStarProject}>
                  {starProject !== 0 ?
                    <IconStarFill></IconStarFill>
                    :
                    <IconStarOutline></IconStarOutline>
                  }
                </button>) :
                (<button type='button'
                  className='w-full max-w-[20px]'>
                  {starProject !== 0 ?
                    <IconStarFill></IconStarFill>
                    :
                    <IconStarOutline></IconStarOutline>
                  }
                </button>)}
            </div>
            {toggleUpdate ? (
              <Button
                onClick={() => setShowAlertCancelUpdate(true)}
              ><span className='text-base font-semibold text-blue-500'>Cancel</span></Button>)
              : (<Button
                onClick={handleRemoveProject}
              ><span className='text-[#E80000] text-base font-medium'>Delete</span></Button>)}
          </div>
          {statusList.map((item, index) => {
            return (
              statusProject === item.id &&
              <Button
                key={item.id}
                onClick={() => handleStatusProject(item.id)}
                className={`button-default w-auto bg-${item.id} text-sm text-${item.id} h-auto px-4 py-[6px] rounded-full font-medium self-start`}>{item.title}
              </Button>)
          })}
          <div className='grid grid-cols-2 gap-8 mb-3'>
            <div className="">
              <p className='mb-3 text-base font-medium'>Due Date</p>
              <InputRangeDate stateDate={stateDate} handleSelectDate={handleSelectDate}></InputRangeDate>
            </div>
          </div>
          <div className="mb-3">
            <p className='mb-2 text-base font-medium'>Description</p>
            {toggleUpdate ? (
              <Textarea
                className="text-sm text-[#717279] border rounded-md border-graycustom resize-none overflow-hidden transition-all w-full p-2"
                placeholder="enter description your project"
                value={descriptionProject}
                setValue={setDescriptionProject}
              ></Textarea>)
              : (<p className='text-sm text-[#717279]bg-red-200'>{descriptionProject}</p>)}
          </div>
          <div className="mb-3">
            <p className='mb-2 text-base font-medium'>Key Project</p>
            <p className='text-sm font-medium text-blue-500'>{data.keyProject}</p>
          </div>
          <AddUser nameItemList="client" userListAdd={userListAdd} handleAddUser={handleAddUser} toggleUpdate={toggleUpdate} handleRemoveUser={handleRemoveUser}></AddUser>
          <AddUser nameItemList="leader" userListAdd={userListAdd} handleAddUser={handleAddUser} toggleUpdate={toggleUpdate} handleRemoveUser={handleRemoveUser}></AddUser>
          <AddUser nameItemList="member" userListAdd={userListAdd} handleAddUser={handleAddUser} toggleUpdate={toggleUpdate} handleRemoveUser={handleRemoveUser}></AddUser>
          {toggleUpdate ?
            (<Button
              onClick={handleUpdateProject}
              className="mt-5 mb-0 font-medium text-white button-default bg-button">Save</Button>)
            : (<Button
              onClick={() => setToggleUpdate(true)}
              className="mt-5 mb-0 font-medium text-white button-default bg-button">Update</Button>)}
        </motion.div>
      </Portal>
      <Alert
        showAlert={showAlertCancelUpdate}
      >
        <div
          transition={{ type: "spring", duration: 0.15 }}
          className='flex flex-col items-center w-full h-full gap-3 p-6 bg-white rounded-md'>
          <IconThink className='block w-12 h-12'></IconThink>
          <p className='text-base font-semibold'>You definitely don't save ?</p>
          <div className='flex items-center justify-between w-full mt-3'>
            <Button onClick={handleUpdateProject} className="px-4 py-2 font-medium text-white rounded-md bg-button">Save</Button>
            <Button onClick={handleCancel} className="px-4 py-2 font-medium text-[#E80000] rounded-md bg-gray-300 bg-opacity-50">Cancel</Button>
          </div>
        </div>
      </Alert>
    </>
  )
}
