import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import IconStarFill from '../icons/IconStarFill';
import IconStarOutline from '../icons/IconStarOutline';
import Button from '../button/Button';
import IconCalender from '../icons/IconCalender';
import { IconCancel, IconDownload, IconFile, IconImage, IconProject, IconThink } from '../icons';
import Portal from '../portal/Portal';
import { motion } from "framer-motion"
import InputRangeDate from '../input/InputRangeDate';
import Textarea from '../input/Textarea';
import AddUser from '../modal/AddUser';
import Alert from '../alert/Alert';
import Label from '../label/Label';
import ThumbnailFile from '../thumbnail/ThumbnailFile';
import DropdownChooseProject from '../dropdown/DropdownChooseProject';
import { severtyList, statusList } from '../../constans/status';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../../constans/url';
import { AuthContext } from "../../context/authContext"

const CardTask = ({ data }) => {
  const { currentUser } = useContext(AuthContext);
  const [showModalTask, setShowModalTask] = useState(false);
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(data.date.timeStart),
      endDate: new Date(data.date.timeEnd),
      key: 'selection'
    }
  ]);
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [nameTask, setNameTask] = useState(data.title)
  const [descriptionTask, setDescriptionTask] = useState(data.description);
  const [statusTask, setStatusTask] = useState(data.status);
  const [severityTask, setSeverityTask] = useState(data.severity);
  const [userListAdd, setUserListAdd] = useState({
    member: data.member,
  })
  const [showAlertCancelUpdate, setShowAlertCancelUpdate] = useState(false)
  const [imagesUpload, setImageUpload] = useState(null);
  const [filesUpload, setFilesUpload] = useState(null);
  const [timeTask, setTimeTask] = useState({
    timeStart: data.time.timeStart,
    timeEnd: data.time.timeEnd,
  })
  const [errorTime, setErrorTime] = useState("");
  const [taskItem, setTaskItem] = useState(data.taskList);
  const [dateLimit, setDateLimit] = useState({
    minDate: new Date(data.date.timeStart),
    maxDate: new Date(data.date.timeEnd)
  });
  const [project, setProject] = useState(data.infoProject);
  const [images, setImages] = useState(data.images)
  const [files, setFiles] = useState(data.files)

  // chon ngay thang
  const handleSelectDate = (ranges) => {
    setStateDate([ranges.selection])
  }
  // ket thuc chon ngay thang

  // chon gio
  const handleTimeTask = (e) => {
    setErrorTime("")
    if (e.target.name === "timeStart") {
      let timeStartNew = new Date(`2024-05-03T${e.target.value}Z`);
      let timeEnd = new Date(`2024-05-03T${timeTask.timeEnd}Z`);
      if (timeEnd - timeStartNew < 0) { // thời gian bắt đầu không được lớn hơn thời gian kết thúc
        setErrorTime("Start time must be before end time")
      } else {
        setTimeTask(preTime => ({ ...preTime, [e.target.name]: e.target.value }))
      }
    } else {
      let timeEndNew = new Date(`2024-05-03T${e.target.value}Z`);
      let timeStart = new Date(`2024-05-03T${timeTask.timeStart}Z`);
      if (timeEndNew - timeStart < 0) { // thời gian bắt đầu không được lớn hơn thời gian kết thúc
        setErrorTime("Start time must be before end time")
      } else {
        setTimeTask(preTime => ({ ...preTime, [e.target.name]: e.target.value }))
      }
    }
  }
  // ket thuc chon gio 

  // xử lý thay đổi trạng thái task
  const handleStatusProject = (status) => {
    switch (status) {
      case "going":
        // chuyển sáng pause
        setStatusTask("pause") // cập nhật ngay
        break;
      case "pause":
        // chuyển sáng done
        setStatusTask("done") // cập nhật ngay
        break;
      case "done":
        // chuyển sáng going
        setStatusTask("going") // cập nhật ngay
        break;
      default:
        break;
    }
  }
  // kết thúc xử lý thay đổi trạng thái task

  // xử lý thay đổi severty
  const handleSeverityTask = (status) => {
    switch (status) {
      case "low":
        setSeverityTask("medium")
        break;
      case "medium":
        setSeverityTask("high")
        break;
      case "high":
        setSeverityTask("low")
        break;
      default:
        break;
    }
  }
  // kết thúc xử lý thay đổi severty

  // them member vào du an
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
  // ket thuc them member vào du an
  const [submiting, setSubmiting] = useState(false);
  const handleUpdateTask = () => {
    if (!submiting) { // chưa nhấn create
      if (!project) {
        toast.error("You must enter information")
        return
      }
      if (nameTask.length === 0) {
        return
      }
      let timeStart = (stateDate[0].startDate.getMonth() + 1) + "/" + stateDate[0].startDate.getDate() + "/" + stateDate[0].startDate.getFullYear()
      let timeEnd = (stateDate[0].endDate.getMonth() + 1) + "/" + stateDate[0].endDate.getDate() + "/" + stateDate[0].endDate.getFullYear()
      const formData = new FormData();
      formData.append("title", nameTask)
      formData.append("status", statusTask)
      formData.append("severity", severityTask)
      formData.append("project_id", project._id)
      formData.append("date", JSON.stringify({
        timeStart: timeStart,
        timeEnd: timeEnd
      }))
      formData.append("time", JSON.stringify({
        timeStart: timeTask.timeStart,
        timeEnd: timeTask.timeEnd,
      }))
      formData.append("description", descriptionTask)
      formData.append("member", JSON.stringify(userListAdd.member))
      formData.append("taskList", JSON.stringify(taskItem))
      if (imagesUpload) {
        for (let i = 0; i < imagesUpload.length; i++) {
          formData.append("images", imagesUpload[i])
        }
      }
      if (filesUpload) {
        for (let i = 0; i < filesUpload.length; i++) {
          formData.append("files", filesUpload[i])
        }
      }
      formData.append("imagesOld", JSON.stringify(images))
      formData.append("filesOld", JSON.stringify(files))
      setSubmiting(true)
      axios.patch(`${BASE_URL}/task/update/${data._id}`, formData, {
        headers: {
          "Authorization": `Bearer ${currentUser.token}`,
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        // cập nhật lại task vừa tạo vào đúng trường
        toast.success("Update task success")
        setSubmiting(false)
        setShowModalTask(false)
        setToggleUpdate(false)
        handleReset()// sửa lại handle reset (tai từ database về)
      }).catch((err) => {
        toast.error(err.response.data.messages)
        setToggleUpdate(false)
        setSubmiting(false)
      })
    }
  }
  const handleRemoveTask = () => {
    console.log("check delete",)
  }
  const handleCancel = () => {
    setShowAlertCancelUpdate(false)
    handleReset()
    setShowModalTask(false)
    setToggleUpdate(false)
  }
  // reset lại data của task
  const handleReset = () => {
    axios.get(`${BASE_URL}/task/detail/${data._id}`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      console.log("check ", res.data?.data)
      let data = res.data?.data;
      setNameTask(data.title)
      setStatusTask(data.status)
      setSeverityTask(data.severity)
      setProject(data.infoProject)
      setStateDate([{
        startDate: new Date(data.date.timeStart),
        endDate: new Date(data.date.timeEnd),
        key: 'selection'
      }])
      setTimeTask({
        timeStart: data.time.timeStart,
        timeEnd: data.time.timeEnd,
      })
      setDescriptionTask(data.description)
      setUserListAdd({
        member: data.member,
      })
      setTaskItem(data.taskList)
      setImages(data.images)
      setFiles(data.files)
      setFilesUpload(null)
      setImageUpload(null)
    }).catch((err) => {
      toast.error(err.response.data.messages)
    })
  }
  // kết thúc reset lại data của task

  // xử lý việc upload, preview, remove image
  const handleUploadImage = (e) => {
    setImageUpload(prevImage => {
      if (prevImage !== null) {
        const dt = new DataTransfer();
        for (let i = 0; i < prevImage.length; i++) {
          const file = prevImage[i];
          dt.items.add(file)
        }
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          dt.items.add(file)
        }
        return dt.files;
      }
      return e.target.files
    })
  }
  const handleRemoveImageUpload = (index) => {
    const dt = new DataTransfer();
    for (let i = 0; i < imagesUpload.length; i++) {
      const file = imagesUpload[i];
      if (index !== i) {
        dt.items.add(file)
      }
    }
    setImageUpload(dt.files)
  }
  // xử lý việc upload, preview, remove image

  // tiền xử lý việc Upload file
  const handleUploadFile = (e) => {
    setFilesUpload(prevFiles => {
      if (prevFiles !== null) {
        const dt = new DataTransfer();
        for (let i = 0; i < prevFiles.length; i++) {
          const file = prevFiles[i];
          dt.items.add(file)
        }
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          dt.items.add(file)
        }
        return dt.files;
      }
      return e.target.files
    })
  }
  const handleRemoveFilesUpload = (index) => {
    const dt = new DataTransfer();
    for (let i = 0; i < filesUpload.length; i++) {
      const file = filesUpload[i];
      if (index !== i) {
        dt.items.add(file)
      }
    }
    setFilesUpload(dt.files)
  }
  // kết thúc tiền xử lý việc Upload file driver

  // xử lý xóa các item ảnh từ database trả về
  const handleRemoveImageDatabase = (item) => {
    setImages(prevImages => prevImages.filter((image) => image !== item))
  }
  // kết thúc xử lý xóa các item ảnh từ database trả về

  // xử lý xóa các item file từ database trả về
  const handleRemoveFileDatabase = (id) => {
    setFiles(prevFiles => prevFiles.filter((file) => file.id !== id))
  }
  // kết thúc xử lý xóa các item file từ database trả về

  // thêm, xóa , sửa task item
  const addTaskItem = () => {
    setTaskItem(prevTask => [...prevTask, {
      id: uuidv4(),
      content: "Task",
      checked: false,
    }])
  }
  const handleChangeContentTask = (e, index) => {
    let newTaskItem = taskItem;
    newTaskItem[index].content = e.target.value;
    setTaskItem(newTaskItem)
  }
  const handleChangeCheckTask = (e, index) => {
    let newTaskItem = taskItem;
    newTaskItem[index].checked = e.target.checked;
    setTaskItem(newTaskItem)
  }
  const removeTaskItem = (id) => {
    setTaskItem(prev => prev.filter((item, index) => item.id !== id))
  }
  // kết thúc thêm, xóa , sửa task item

  const handleChooseProject = (item) => {
    // danh sách member luôn phải reset khi mới chọn project
    setUserListAdd({
      member: [],
    })
    setProject(item)
    setDateLimit({
      minDate: new Date(item.date.timeStart),
      maxDate: new Date(item.date.timeEnd)
    }
    )
    setStateDate([
      {
        startDate: new Date(item.date.timeStart),
        endDate: new Date(item.date.timeEnd),
        key: 'selection'
      }
    ])
  }

  return (
    <>
      <div className="flex flex-col gap-3 p-4 py-3 mb-3 rounded-md shadow-md card-project">
        <div className='flex gap-2 justify-between'>
          <h2 className='text-base font-semibold line-clamp-1'>{nameTask}</h2>
          <button type='button'
            className='w-full max-w-[20px]'
          // onClick={() => handleStarProject(true ? 1 : 0)}
          >
            {true ?
              <IconStarFill></IconStarFill>
              :
              <IconStarOutline></IconStarOutline>
            }
          </button>
        </div>
        <div className='flex gap-2'>
          {statusList.map((item, index) => {
            return (
              statusTask === item.id &&
              <Button
                key={item.id}
                className={`button-default w-auto bg-${item.id} text-sm text-${item.id} h-auto px-4 py-[6px] rounded-full font-medium self-start mb-0`}>{item.title}
              </Button>)
          })}
          {severtyList.map((item, index) => {
            return (
              severityTask === item.id &&
              <Button
                key={item.id}
                className={`button-default w-auto bg-${item.id} text-sm text-white h-auto px-4 py-[6px] rounded-full font-medium self-start mb-0`}>{item.title}
              </Button>)
          })}
        </div>
        <div
          onClick={() => setShowModalTask(true)}
          className='flex flex-col gap-2 cursor-pointer'>
          <div className="text-sm font-normal text-[#717279]">
            <p className='line-clamp-3'>{descriptionTask}</p>
          </div>
          <div className='flex items-center gap-3'>
            <IconCalender></IconCalender>
            <span className='text-sm font-medium text-[#717279] tracking-widest'>
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
          <div className='flex items-center gap-3'>
            <IconProject></IconProject>
            <span className='text-sm font-medium text-[#717279] line-clamp-1'>{project?.title}</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-full rounded-full bg-[#D9D9D9] h-2'>
            </div>
            <span className='text-sm font-medium text-[#717279]'>80%</span>
          </div>
        </div>
      </div>
      <Portal
        visible={showModalTask}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[588px] overflow-y-scroll no-scrollbar max-h-[100vh] scroll-"
        onClose={() => toggleUpdate ? setShowAlertCancelUpdate(true) : setShowModalTask(false)}
      >
        <motion.div
          animate={{
            opacity: [0, 1],
            scale: [0.7, 1]
          }}
          key="taskShow"
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
                  onChange={(e) => setNameTask(e.target.value)}
                  className='w-full max-w-[380px] p-2 text-base font-semibold border rounded-md border-graycustom'
                  defaultValue={nameTask}
                />
              ) : (
                <h2 className='text-base font-semibold line-clamp-3 w-full max-w-[380px]'>{nameTask}</h2>
              )}
              <button type='button'>
                <IconStarFill></IconStarFill>
              </button>
            </div>
            {toggleUpdate ? (
              <Button
                onClick={() => setShowAlertCancelUpdate(true)}
              ><span className='text-base font-semibold text-blue-500'>Cancel</span></Button>)
              : (<Button
                onClick={handleRemoveTask}
              ><span className='text-[#E80000] text-base font-medium'>Delete</span></Button>)}
          </div>
          <div className='flex gap-2'>
            {statusList.map((item, index) => {
              return (
                statusTask === item.id &&
                <Button
                  key={item.id}
                  onClick={() => toggleUpdate ? handleStatusProject(item.id) : {}}
                  className={`button-default w-auto bg-${item.id} text-sm text-${item.id} h-auto px-4 py-[6px] rounded-full font-medium self-start`}>{item.title}
                </Button>)
            })}
            {severtyList.map((item, index) => {
              return (
                severityTask === item.id &&
                <Button
                  key={item.id}
                  onClick={() => toggleUpdate ? handleSeverityTask(item.id) : {}}
                  className={`button-default w-auto bg-${item.id} text-sm text-white h-auto px-4 py-[6px] rounded-full font-medium self-start`}>{item.title}
                </Button>)
            })}
          </div>
          <DropdownChooseProject project={project} handleChooseProject={handleChooseProject} toogleChoose={toggleUpdate}></DropdownChooseProject>
          <div className='grid grid-cols-2 gap-4 mb-3'>
            <div className="">
              <p className='mb-3 text-base font-medium'>Due Date</p>
              <InputRangeDate stateDate={stateDate} handleSelectDate={handleSelectDate} dateLimit={dateLimit} toogleChoose={toggleUpdate}></InputRangeDate>
            </div>
            <div className="">
              <p className='mb-3 text-base font-medium'>Time</p>
              <div className="flex items-center gap-1">
                <div htmlFor='timeStart' className='flex items-center justify-center h-10 px-2 border rounded-md cursor-pointer border-graycustom'>
                  <input
                    onChange={handleTimeTask}
                    defaultValue={timeTask.timeStart}
                    type="time" id="timeStart" name="timeStart" className='text-sm font-medium text-[#787486] tracking-wider' />
                </div>
                <span>-</span>
                <div className='flex items-center justify-center h-10 px-2 border rounded-md cursor-pointer border-graycustom'>
                  <input
                    onChange={handleTimeTask}
                    defaultValue={timeTask.timeEnd}
                    type="time" id="timeEnd" name="timeEnd" className='text-sm font-medium text-[#787486] tracking-wider' />
                </div>
              </div>
              {errorTime && <span className='text-xs italic font-medium text-red-500'>*{errorTime}</span>}
            </div>
          </div>
          <div className="mb-3">
            <p className='mb-2 text-base font-medium'>Description</p>
            {toggleUpdate ? (
              <Textarea
                className="text-sm text-[#717279] border rounded-md border-graycustom resize-none overflow-hidden transition-all w-full p-2"
                placeholder="enter description your project"
                value={descriptionTask}
                setValue={setDescriptionTask}
              ></Textarea>)
              : (<p className='text-sm text-[#717279]'>{descriptionTask}</p>)}
          </div>
          <AddUser nameItemList="member" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRemoveUser={handleRemoveUser} toggleChoose={toggleUpdate}></AddUser>
          <div className='flex items-center gap-3 mt-3'>
            <p className='mb-3 text-base font-medium'>Task</p>
            {toggleUpdate &&
              <Button
                onClick={addTaskItem}
                className="button-default w-auto bg-button h-auto px-4 py-[6px] text-white font-medium">+ add</Button>
            }
          </div>
          <div className='flex flex-col gap-2'>
            {toggleUpdate ? (
              taskItem.length > 0 && taskItem.map((item, index) => {
                return (
                  <div key={item.id} className='flex items-center justify-between w-full gap-4'>
                    <input type="checkbox" defaultChecked={item.checked} onChange={(e) => handleChangeCheckTask(e, index)} />
                    <input
                      onChange={(e) => handleChangeContentTask(e, index)}
                      type="text"
                      className="flex-1 px-2 py-1 text-sm border rounded-md border-graycustom"
                      defaultValue={item.content}
                    />
                    <Button onClick={() => removeTaskItem(item.id)} className='w-4'>
                      <IconCancel></IconCancel>
                    </Button>
                  </div>)
              })
            ) : (
              taskItem.length > 0 && taskItem.map((item, index) => {
                return (
                  <div key={item.id} className='flex items-center justify-between w-full gap-4'>
                    <p className='text-sm'> - {item.content}</p>
                  </div>)
              })
            )}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <Label htmlFor={toggleUpdate ? "image" : ""} className='flex items-center justify-center w-10 h-10 rounded-md bg-graycustom bg-opacity-10'><IconImage></IconImage></Label>
            <Label className="text-sm font-medium">Add Image</Label>
          </div>

          <div className='flex flex-wrap gap-3 my-2'>
            {images.length > 0 && images.map((item, index) => {
              return (
                <div key={item} className='relative w-[100px] h-[100px]'>
                  <img className='object-cover w-full h-full' src={item} alt="" />
                  {toggleUpdate && <Button
                    onClick={() => handleRemoveImageDatabase(item)}
                    className="w-5 absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-300 p-[2px] h-5 rounded-full flex justify-center items-center"><IconCancel></IconCancel></Button>}
                </div>
              )
            })}
            {imagesUpload !== null && Array(imagesUpload.length).fill(null).map((item, index) => {
              return (
                <div key={index} className='relative w-[100px] h-[100px]'>
                  <img className='object-cover w-full h-full' src={URL.createObjectURL(imagesUpload[index])} alt="" />
                  <Button
                    onClick={() => handleRemoveImageUpload(index)}
                    className="w-5 absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-300 p-[2px] h-5 rounded-full flex justify-center items-center"><IconCancel></IconCancel></Button>
                </div>
              )
            })}
          </div>
          <input
            hidden
            onChange={handleUploadImage}
            type="file" id="image" accept="image/png, image/jpeg" multiple />
          <div className="flex items-center gap-4 mt-3">
            <Label htmlFor={toggleUpdate ? "files" : ""} className='flex items-center justify-center w-10 h-10 rounded-md bg-graycustom bg-opacity-10'><IconFile></IconFile></Label>
            <Label className="text-sm font-medium">Add File</Label>
          </div>
          <input
            hidden
            onChange={handleUploadFile}
            type="file" id="files" multiple />
          <div className='flex flex-wrap gap-2 mt-3'>
            {files.length > 0 && files.map((item, index) => {
              return (
                <div
                  key={item.id} className='w-[calc(50%-8px)] flex items-center justify-between rounded-md p-2 bg-gray-200'>
                  <a href={item.link_view} target='_blank' rel="noreferrer" className='flex items-center gap-2 w-[calc(100%-25px)]'>
                    <div className='min-w-[22px] min-h-[29px]'>
                      <ThumbnailFile fileExtension={item.nameFile.split(".")[1]}></ThumbnailFile>
                    </div>
                    <span className='flex-1 text-sm font-medium line-clamp-1'>{item.nameFile}</span>
                  </a>
                  {toggleUpdate ?
                    (<Button
                      onClick={() => handleRemoveFileDatabase(item.id)}
                      className="flex items-center justify-center w-full h-full max-w-4 max-h-4"><IconCancel></IconCancel></Button>)
                    : (<a href={item.link_download} target='_blank' rel="noreferrer" className="flex items-center justify-center w-full h-full max-w-4 max-h-4"><IconDownload></IconDownload></a>)}
                </div>
              )
            })}
            {filesUpload !== null && Array(filesUpload.length).fill(null).map((item, index) => {
              return (
                <div key={index} className='w-[calc(50%-8px)] flex items-center gap-2 rounded-md p-2 bg-gray-200'>
                  <div className='min-w-[22px] min-h-[29px]'>
                    <ThumbnailFile fileExtension={filesUpload[index].name.split(".")[1]}></ThumbnailFile>
                  </div>
                  <span className='flex-1 text-sm font-medium line-clamp-1'>{filesUpload[index].name}</span>
                  <Button
                    onClick={() => handleRemoveFilesUpload(index)}
                    className="flex items-center justify-center w-full h-full max-w-4 max-h-4"><IconCancel></IconCancel></Button>
                </div>
              )
            })}
          </div>
          {toggleUpdate ?
            (<Button
              onClick={handleUpdateTask}
              className="mt-5 mb-0 font-medium text-white button-default bg-button">{submiting && <div className='w-4 h-4 border-4 border-white rounded-full border-r-4 border-r-transparent animate-spin'></div>}Save</Button>)
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
            <Button onClick={handleUpdateTask} className="px-4 py-2 font-medium text-white rounded-md bg-button">Save</Button>
            <Button onClick={handleCancel} className="px-4 py-2 font-medium text-[#E80000] rounded-md bg-gray-300 bg-opacity-50">Cancel</Button>
          </div>
        </div>
      </Alert>
    </>
  );
}

export default CardTask;
