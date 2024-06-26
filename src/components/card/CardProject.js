import React, { useContext, useState } from 'react'
import Button from '../button/Button'
import { IconCalender, IconDelete, IconEdit, IconStarFill, IconStarOutline, IconThink, IconWarning } from '../icons'
import AddUser from '../modal/AddUser'
import InputRangeDate from '../input/InputRangeDate'
import Portal from '../portal/Portal'
import Textarea from '../input/Textarea'
import { motion } from "framer-motion"
import { toast } from 'react-toastify';
import axios from 'axios'
import { AuthContext } from "../../context/authContext"
import { BASE_URL } from "../../constans/url"
import { statusList } from '../../constans/status'
import AlertWarning from '../alert/AlertWarning'

export default function CardProject({ data, handleRemoveProject }) {
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
  const [showAlertWarningDelete, setShowAlertWarningDelete] = useState(false)
  // chon ngay thang
  const handleSelectDate = (ranges) => {
    setStateDate([ranges.selection])
  }
  // ket thuc chon ngay thang

  // them client, leader, member vào du an
  const handleAddUser = (nameItemList, data) => {
    setUserListAdd(preData => {
      console.log("check ", preData[nameItemList])
      console.log("check ", data)
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
      await axios.patch(`${BASE_URL}/project/update/${data._id}`, {
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
      toast.error(err.response.data.messages)
      handleResetData();
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
    axios.get(`${BASE_URL}/project/detail/${data._id}`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      let data = res.data.data
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
    }).catch((err) => {
      toast.error(err.response.data.messages)
    })
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
    axios.patch(`${BASE_URL}/project/done-project/${data._id}`, {
      status: "done"
    }, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      toast.success("Done project success")
      setStatusProject("done")
    }).catch((err) => {
      setStatusProject(data.status)
      toast.error(err.response.data.messages)
    })
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
      <div className="flex flex-col gap-3 p-6 rounded-md shadow-md cursor-pointer card-project dark:bg-bgDarkItem">
        <div className='flex justify-between gap-2'>
          <h2 className='text-base font-semibold line-clamp-1 dark:text-white'>{nameProject}</h2>
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
        {statusList.map((item, index) => {
          return (
            statusProject === item.id &&
            <Button
              key={item.id}
              className={`button-default w-auto bg-${item.id} text-sm text-${item.id} h-auto px-4 py-[6px] rounded-full font-medium self-start mb-0`}>{item.title}
            </Button>)
        })}
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
            className='button-default  phone:h-10 bg-[#00C271] text-white rounded-md font-medium mb-0'>Done</Button>
          <Button
            onClick={() => setShowAlertWarningDelete(true)}
            className='button-default phone:h-10 phone:max-w-10 bg-[#FFF0F0] dark:bg-[#FFF0F0]/80 w-full max-w-12 h-12 text-white rounded-md font-medium mb-0'><IconDelete></IconDelete></Button>
          <Button
            onClick={() => setShowProject(true)}
            className='button-default phone:h-10 phone:max-w-10 bg-[#F6F8FD] dark:bg-[#F6F8FD]/80  w-full max-w-12 h-12 text-white rounded-md font-medium mb-0'><IconEdit></IconEdit></Button>
        </div>
      </div>
      <Portal
        visible={showProject}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[588px] phone:max-w-[370px] phone2:max-w-[588px]"
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
          className='w-full p-6 bg-white rounded-md dark:text-white dark:bg-bgDarkItem'>
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
                onClick={() => setShowAlertWarningDelete(true)}
              ><span className='text-[#E80000] text-base font-medium'>Delete</span></Button>)}
          </div>
          {statusList.map((item, index) => {
            return (
              statusProject === item.id &&
              <Button
                key={item.id}
                onClick={() => toggleUpdate ? handleStatusProject(item.id) : {}}
                className={`button-default w-auto bg-${item.id} text-sm text-${item.id} h-auto px-4 py-[6px] rounded-full font-medium self-start`}>{item.title}
              </Button>)
          })}
          <div className='grid gap-8 mb-3'>
            <div className="">
              <p className='mb-3 text-base font-medium'>Due Date</p>
              <InputRangeDate stateDate={stateDate} handleSelectDate={handleSelectDate} toogleChoose={toggleUpdate}></InputRangeDate>
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
          <AddUser nameItemList="client" userListAdd={userListAdd} handleAddUser={handleAddUser} toggleChoose={toggleUpdate} handleRemoveUser={handleRemoveUser}></AddUser>
          <AddUser nameItemList="leader" userListAdd={userListAdd} handleAddUser={handleAddUser} toggleChoose={toggleUpdate} handleRemoveUser={handleRemoveUser}></AddUser>
          <AddUser nameItemList="member" userListAdd={userListAdd} handleAddUser={handleAddUser} toggleChoose={toggleUpdate} handleRemoveUser={handleRemoveUser}></AddUser>
          {toggleUpdate ?
            (<Button
              onClick={handleUpdateProject}
              className="mt-5 mb-0 font-medium text-white button-default bg-button">Save</Button>)
            : (<Button
              onClick={() => setToggleUpdate(true)}
              className="mt-5 mb-0 font-medium text-white button-default bg-button">Update</Button>)}
        </motion.div>
      </Portal>
      <AlertWarning
        toggleShow={showAlertCancelUpdate}
        messages="You definitely don't save ?"
        handleCancel={handleCancel}
        handleContinue={() => setShowAlertCancelUpdate(false)}
      ><IconThink className='block w-12 h-12'></IconThink></AlertWarning>
      <AlertWarning
        toggleShow={showAlertWarningDelete}
        messages="Do you want to delete the project?"
        handleCancel={() => setShowAlertWarningDelete(false)}
        handleContinue={() => handleRemoveProject(data._id)}
      ><IconWarning className='block w-12 h-12'></IconWarning></AlertWarning>
    </>
  )
}
