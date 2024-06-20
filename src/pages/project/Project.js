import React, { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
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
import { IconThink } from '../../components/icons';
import axios from 'axios';
import { BASE_URL } from '../../constans/url';
import { statusList } from '../../constans/status';
import { AuthContext } from "../../context/authContext"
import { toast } from 'react-toastify';
import lodash from "lodash"
import noResultImage from "../../asset/images/noResult.png"
import AlertWarning from '../../components/alert/AlertWarning';
import { useSocket } from '../../context/socketContext';

export default function Project() {
  const socket = useSocket()
  const { currentUser } = useContext(AuthContext)
  const [showModalJoinProject, setShowModalJoinProject] = useState(false);
  const [showModalCreateProject, setShowModalCreateProject] = useState(false);
  const [nameProject, setNameProject] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("")
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date("10/06/2024"),
      endDate: new Date("11/06/2024"),
      key: 'selection'
    }
  ]);
  const [userListAdd, setUserListAdd] = useState({
    client: [],
    leader: [],
    member: [],
  })
  const [showAlertCancelCreate, setShowAlertCancelCreate] = useState(false)
  const [statusProject, setStatusProject] = useState("going");
  const [projectList, setProjectList] = useState([])
  const [searchProject, setSearchProject] = useState("")
  const [loading, setLoading] = useState(true)

  // chon ngay thang
  const handleSelectDate = (ranges) => {
    setStateDate([ranges.selection])
  }
  // ket thuc chon ngay thang

  // them client, leader, member vào du an
  const handleAddUser = (nameItemList, data) => {
    setUserListAdd(preData => {
      let userExist = preData[nameItemList].some((item) => item.id === data.id)
      return { ...preData, [nameItemList]: userExist ? preData[nameItemList] : [...preData[nameItemList], { id: data.id.toString(), email: data.email }] }
    })
  }

  const handleRemoveUser = (nameItemList, id) => {
    setUserListAdd(preData => ({ ...preData, [nameItemList]: preData[nameItemList].filter((item) => item.id !== id) }))
  }
  // ket thuc them client, leader, member vào du an

  // xử lý dừng tạo project
  const handleCancel = () => {
    setShowAlertCancelCreate(false)
    setShowModalCreateProject(false)
  }
  // kết thúc xử lý dừng tạo project

  // xử lý trạng thái project
  const handleStatusProject = (status) => {
    switch (status) {
      case "going":
        // chuyển sáng pause
        setStatusProject("pause") // cập nhật ngay
        break;
      case "pause":
        // chuyển sáng done
        setStatusProject("done")
        break;
      case "done":
        // chuyển sáng going
        setStatusProject("going")
        break;
      default:
        break;
    }
  }
  // kết thúc xử lý trạng thái project

  // xử lý việc tạo project 
  const handleCreateProject = () => {
    console.log("check ", userListAdd.client)
    let timeStart = (stateDate[0].startDate.getMonth() + 1) + "/" + stateDate[0].startDate.getDate() + "/" + stateDate[0].startDate.getFullYear()
    let timeEnd = (stateDate[0].endDate.getMonth() + 1) + "/" + stateDate[0].endDate.getDate() + "/" + stateDate[0].endDate.getFullYear()

    axios.post(`${BASE_URL}/project/create`, {
      title: nameProject,
      status: statusProject,
      date: {
        timeStart: timeStart,
        timeEnd: timeEnd,
      },
      description: descriptionProject,
      client: userListAdd.client,
      leader: userListAdd.leader,
      member: userListAdd.member,
      keyProject: uuidv4(),
      createdBy: { user_id: currentUser.id }
    }, {
      headers: {
        'Authorization': `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      const regex = new RegExp(searchProject, 'i')
      // project vừa tạo có title khớp với keyword người dùng đang search thì cho hiển thị
      if (regex.test(res.data.data.title)) {
        setProjectList(prevData => [res.data.data, ...prevData])
      }
      setShowModalCreateProject(false)
      toast.success("Create project success")
    }).catch((err) => {
      toast.error(err.response.data.messages)
    })
  }
  // kết thúc xử lý việc tạo project

  // xử lý lấy danh sách project
  useEffect(() => {
    const getProject = () => {
      setLoading(true)
      axios.get(`${BASE_URL}/project?keyword=${searchProject}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      }).then((res) => {
        setProjectList(res.data?.data);
        setLoading(false)
      }).catch((err) => {
        toast.error(err)
        setLoading(false)
      })
    }
    getProject()
  }, [searchProject, currentUser.token])
  // kết thúc xử lý lấy danh sách project

  // xử lý tìm kiếm project
  const handleSearchProject = lodash.debounce((e) => {
    setSearchProject(e.target.value)
  }, 500)
  // kết thúc xử lý tìm kiếm project

  // xử lý xóa project
  const handleRemoveProject = (id) => {
    axios.delete(`${BASE_URL}/project/delete/${id}`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      setProjectList(preve => preve.filter((item) => item._id !== id))
      toast.success("Deleted project success")
    }).catch((err) => {
      toast.error(err.response.data.messages)
    })
  }
  const [valueInputKeyProject, setValueInputKeyProject] = useState("");
  const [loadingJoinProject, setLoadingJoinProject] = useState(false);
  const handleJoinProject = () => {
    setLoadingJoinProject(true)
    axios.patch(`${BASE_URL}/project/join-project`, {
      key: valueInputKeyProject
    }, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      const regex = new RegExp(searchProject, 'i')
      // project vừa join có title khớp với keyword người dùng đang search thì cho hiển thị
      if (regex.test(res?.data?.data.title)) {
        setProjectList(prevData => [res.data.data, ...prevData])
      }
      setLoadingJoinProject(false)
      toast.success("Join project success")
      setValueInputKeyProject("")
      setShowModalJoinProject(false)
    }).catch((err) => {
      toast.error(err.response?.data.messages)
      setLoadingJoinProject(false)
      setValueInputKeyProject("")
    })
  }
  // kết thúc xử lý xóa project

  // nhận project từ socket
  useEffect(() => {
    socket.on("CREATE PROJECT", (project, noti, chat) => {
      if (project?.createdBy?.user_id !== currentUser.id) {
        console.log("check trong project")
        const regex = new RegExp(searchProject, 'i')
        // kiểm tra dữ liệu input search có trùng với project vừa được thêm vào ko
        if (regex.test(project.title)) {
          setProjectList(prevData => [project, ...prevData])
        }
      }
    })
  }, [socket, searchProject, currentUser.id])
  // kết thúc nhận project từ socket
  return (
    <>
      <div className='bg-white rounded-md pt-6 px-4 min-h-[calc(100vh-56px-24px)] dark:bg-bgDark'>
        <div className="flex justify-end gap-2 box-search">
          <Input
            onChange={handleSearchProject}
            type='text'
            name='search'
            className='w-full h-10 phone:h-8 phone:min-w-[150px] tablet:h-10 p-3 max-w-[246px] border rounded-md border-graycustom bg-input focus:border-bluecustom dark:bg-gray-100/50 dark:placeholder-white'
            placeholder="Search"
          ></Input>
          <Button
            onClick={() => setShowModalCreateProject(true)}
            className="button-default h-10 phone:h-8 tablet:h-10  bg-button max-w-[110px] text-white font-medium"
          ><span>+ Create</span></Button>
          <Button
            onClick={() => setShowModalJoinProject(true)}
            className="button-default h-10 phone:h-8 tablet:h-10 bg-button max-w-[110px] text-white font-medium"
          ><span>Join</span></Button>
        </div>
        {loading ? (<div className='w-10 h-10 mx-auto my-2 border-4 border-r-4 border-blue-500 rounded-full border-r-transparent animate-spin'></div>) :
          (projectList.length > 0 ?
            <div className="grid gap-4 project-content phone:grid-cols-1
            phone2:grid-cols-2 laptop:grid-cols-3 laptop2:grid-cols-4 laptop3:grid-cols-5
            ">
              {projectList.map((item, index) => <CardProject key={item._id} data={item} handleRemoveProject={handleRemoveProject}></CardProject>)}
            </div> :
            <div className='flex justify-center items-center w-full min-h-[600px] '>
              <img src={noResultImage} alt="" />
            </div>
          )}
      </div>
      <Portal
        visible={showModalJoinProject}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[439px]"
        onClose={() => setShowModalJoinProject(false)}
      >
        <motion.div
          animate={{
            opacity: [0, 1],
            scale: [0.7, 1]
          }}
          key="showmodalJoinProject"
          exit={{
            opacity: [1, 0],
            scale: [1, 0.5]
          }}
          transition={{ duration: 0.2 }}
          className='px-6 py-4 bg-white rounded-md dark:text-white dark:bg-bgDarkItem'>
          <Label className="text-base font-medium" >Key project</Label>
          <Input
            onChange={(e) => setValueInputKeyProject(e.target.value)}
            placeholder="Enter key project"
            className="w-full h-12 p-3 mt-4 border rounded-md border-graycustom bg-input focus:border-bluecustom dark:bg-bgDarkItem/50"></Input>
          <Button
            onClick={handleJoinProject}
            className="font-medium text-white button-default bg-button mt-7">
            {loadingJoinProject && <div className='w-5 h-5 rounded-full border-4 border-white border-r-4 border-r-transparent animate-spin'></div>}
            Join Project</Button>
        </motion.div>
      </Portal>
      <Portal
        visible={showModalCreateProject}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[588px] phone:max-w-[370px] phone2:max-w-[588px]"
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
          className='w-full p-6 bg-white rounded-md dark:text-white dark:bg-bgDarkItem'>
          <div className='flex items-start justify-between w-full mb-2'>
            <div className='flex items-center flex-1 gap-2'>
              <div className='flex flex-col w-full'>
                <input type="text"
                  onChange={(e) => setNameProject(e.target.value)}
                  className='w-full phone:max-w-[250px] phone2:max-w-[380px] p-2 text-base font-semibold border rounded-md border-graycustom'
                  placeholder='Enter your name project'
                  value={nameProject}
                />
                {nameProject.length <= 0 && <span className='text-xs italic font-medium text-red-500'>* You must provide a title</span>}
              </div>
            </div>
            <Button
              onClick={() => setShowAlertCancelCreate(true)}
            ><span className='text-base font-semibold text-blue-500'>Cancel</span></Button>
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
          <div className='grid  gap-8 mb-3 '>
            <div className="">
              <p className='mb-3 text-base font-medium'>Due Date</p>
              <InputRangeDate stateDate={stateDate} handleSelectDate={handleSelectDate}></InputRangeDate>
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
          <AddUser nameItemList="client" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRemoveUser={handleRemoveUser}></AddUser>
          <AddUser nameItemList="leader" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRemoveUser={handleRemoveUser}></AddUser>
          <AddUser nameItemList="member" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRemoveUser={handleRemoveUser}></AddUser>
          <Button
            onClick={handleCreateProject}
            className="mt-5 mb-0 font-medium text-white button-default bg-button">Create Project</Button>
        </motion.div>
      </Portal>
      <AlertWarning
        toggleShow={showAlertCancelCreate}
        messages="Do you want to continue creating the project?"
        handleCancel={handleCancel}
        handleContinue={() => setShowAlertCancelCreate(false)}
      ><IconThink className='block w-12 h-12'></IconThink></AlertWarning>
    </>
  )
}

