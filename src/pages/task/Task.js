import React, { useEffect, useRef, useState } from 'react';
import CardTask from '../../components/card/cardTask';
import Button from '../../components/button/Button';
import { v4 as uuidv4 } from 'uuid';
import { IconCancel, IconCol, IconFile, IconFilter, IconImage, IconList, IconStarFill, IconThink } from '../../components/icons';
import Input from '../../components/input/Input';
import Portal from '../../components/portal/Portal';
import { motion } from "framer-motion";
import InputRangeDate from '../../components/input/InputRangeDate';
import AddUser from '../../components/modal/AddUser';
import DropdownChooseProject from '../../components/dropdown/DropdownChooseProject';
import Label from '../../components/label/Label';
import Alert from '../../components/alert/Alert';
import Textarea from '../../components/input/Textarea';
import ThumbnailFile from '../../components/thumbnail/ThumbnailFile';
import { severtyList, statusTaskList } from '../../constans/status';

const Task = () => {
  const [showModalTask, setShowModalTask] = useState(false);
  const [nameTask, setNameTask] = useState("")
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [descriptionTask, setDescriptionTask] = useState("");
  const [statusTask, setStatusTask] = useState("going");
  const [severity, setSeverity] = useState("medium");
  const [userListAdd, setUserListAdd] = useState({
    client: [],
    leader: [],
    member: [],
  })
  const [showAlertCancelCreate, setShowAlertCancelCreate] = useState(false)
  const [imagesUpload, setImageUpload] = useState(null);
  const [filesUpload, setFilesUpload] = useState(null);
  const [timeTask, setTimeTask] = useState({
    timeStart: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()),
    timeEnd: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()),
  })
  const [errorTime, setErrorTime] = useState("");
  const [taskItem, setTaskItem] = useState([]);

  const [showModalFilterProject, setShowModalFilterProject] = useState(false);
  const buttonFilterRef = useRef(null)
  const [coordsModalFilter, setCoordsModalFilter] = useState({
    left: 0,
    top: 0,
  })

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
  const handleStatusTask = (status) => {
    switch (status) {
      case "going":
        // chuyển sáng pause
        setStatusTask("pause") // cập nhật ngay
        break;
      case "pause":
        // chuyển sáng done
        setStatusTask("done")
        break;
      case "done":
        // chuyển sáng going
        setStatusTask("going")
        break;
      default:
        break;
    }
  }
  // kết thúc xử lý thay đổi trạng thái task

  // xử lý thay đổi level task
  const handleSevertyTask = (severty) => {
    switch (severty) {
      case "low":
        // chuyển sáng medium
        setSeverity("medium")
        break;
      case "medium":
        // chuyển sáng high
        setSeverity("high")
        break;
      case "high":
        // chuyển sáng low
        setSeverity("low")
        break;
      default:
        break;
    }
  }
  // kết thúc xử lý thay đổi level task

  // them member vào du an
  const handleAddUser = (nameItemList, data) => {
    setUserListAdd(preData => {
      let userExist = preData[nameItemList].some((item) => item.id === data.id)
      return { ...preData, [nameItemList]: userExist ? preData[nameItemList] : [...preData[nameItemList], data] }
    })
  }

  const handleRemoveUser = (nameItemList, id) => {
    setUserListAdd(preData => ({ ...preData, [nameItemList]: preData[nameItemList].filter((item) => item.id !== id) }))
  }
  // ket thuc them member vào du an


  const handleUpdateTask = () => {
    console.log("check ", taskItem)
  }
  const handleRemoveTask = () => {
    console.log("check delete",)
  }
  const handleCancel = () => {
    setShowAlertCancelCreate(false)
    setShowModalTask(false)
  }
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

  // xử lý filter project
  const clickButtonFilter = () => {
    console.log("check ", buttonFilterRef.current.getBoundingClientRect())
    setCoordsModalFilter(buttonFilterRef.current.getBoundingClientRect())
    setShowModalFilterProject(true)
  }
  useEffect(() => {
    const handleOffFilter = () => {
      setShowModalFilterProject(false)
    }
    window.addEventListener("resize", handleOffFilter)
    return () => {
      window.removeEventListener("resize", handleOffFilter)
    }
  }, [])
  // kết thúc xử lý filter project
  return (
    <>
      <div className='bg-white rounded-md pt-6 px-4 min-h-[calc(100vh-56px-24px)]'>
        <div className="flex items-start justify-between">
          <div className='flex gap-8'>
            <div>
              <span className='mb-2 text-base font-medium'>All Task</span>
              <div className='w-full h-[2px] bg-black'></div>
            </div>
            <div>
              <span className='mb-2 text-base font-medium'>All Task</span>
              <div className='w-full h-[2px] bg-black'></div>
            </div>
            <div>
              <span className='mb-2 text-base font-medium'>All Task</span>
              <div className='w-full h-[2px] bg-black'></div>
            </div>
            <div>
              <span className='mb-2 text-base font-medium'>All Task</span>
              <div className='w-full h-[2px] bg-black'></div>
            </div>
          </div>
          <div className='flex gap-3'>
            <Button
              className='button-default bg-[#F6F7F9] w-10 h-10 text-white rounded-md font-medium mb-0'><IconList></IconList></Button>
            <Button
              className='button-default bg-[#F6F7F9] w-10 h-10 text-white rounded-md font-medium mb-0'><IconCol></IconCol></Button>
            <button
              type='button'
              ref={buttonFilterRef}
              onClick={clickButtonFilter}
              className='button-default bg-[#F6F7F9] w-10 h-10 text-white rounded-md font-medium mb-0'><IconFilter></IconFilter></button>
          </div>
        </div>
        <div className='flex items-center justify-end gap-2 mt-3'>
          <Input
            placehoder="Search..."
            className="w-full max-w-[252px] h-10 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom"
          ></Input>
        </div>
        <div className="grid gap-4 project-content sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-3">
          <div className='w-full'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-4'>
                <div className='w-4 h-4 rounded-md bg-[#2384FF]'></div>
                <span className='font-medium text-base text-[#717279]'>On going</span>
              </div>
              <button
                onClick={() => setShowModalTask(true)}
                type="button" className='text-[#2384FF] font-medium'>+ new</button>
            </div>
            {/* list */}
            <CardTask></CardTask>
            <CardTask></CardTask>
            <CardTask></CardTask>
          </div>
          <div className='w-full'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-4'>
                <div className='w-4 h-4 rounded-md bg-[#E80000]'></div>
                <span className='font-medium text-base text-[#717279]'>Paused</span>
              </div>
            </div>
            {/* list */}
            <CardTask></CardTask>
            <CardTask></CardTask>
            <CardTask></CardTask>
          </div>
          <div className='w-full'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-4'>
                <div className='w-4 h-4 rounded-md bg-[#00C271]'></div>
                <span className='font-medium text-base text-[#717279]'>Done</span>
              </div>
            </div>
            {/* list */}
            <CardTask></CardTask>
            <CardTask></CardTask>
            <CardTask></CardTask>
          </div>
        </div>
      </div>
      <Portal
        visible={showModalTask}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[588px] overflow-y-scroll no-scrollbar max-h-[100vh] scroll-"
        onClose={() => setShowAlertCancelCreate(true)}
      >
        <motion.div
          animate={{
            opacity: [0, 1],
            scale: [0.7, 1]
          }}
          key="taskShow"
          exit={{
            opacity: [1, 0],
            scale: [1, 0.5]
          }}
          transition={{ duration: 0.2 }}
          className='w-full p-6 bg-white rounded-md'>
          <div className='flex items-start justify-between w-full mb-2'>
            <div className='flex items-center flex-1 gap-2'>
              <input type="text"
                onChange={(e) => setNameTask(e.target.value)}
                className='w-full max-w-[380px] p-2 text-base font-semibold border rounded-md border-graycustom'
                defaultValue={nameTask}
              />
              <button type='button'>
                <IconStarFill></IconStarFill>
              </button>
            </div>
            <Button
              onClick={() => setShowAlertCancelCreate(true)}
            ><span className='text-base font-semibold text-blue-500'>Cancel</span></Button>
          </div>
          <div className='flex gap-2'>
            {statusTaskList.map((item, index) => {
              return (
                statusTask === item.id &&
                <Button
                  key={item.id}
                  onClick={() => handleStatusTask(item.id)}
                  className={`button-default w-auto bg-${item.id} text-sm text-${item.id} h-auto px-4 py-[6px] rounded-full font-medium self-start`}>{item.title}
                </Button>)
            })}
            {severtyList.map((item, index) => {
              return (
                severity === item.id &&
                <Button
                  key={item.id}
                  onClick={() => handleSevertyTask(item.id)}
                  className={`button-default w-auto bg-${item.id} text-sm text-white h-auto px-4 py-[6px] rounded-full font-medium self-start`}>{item.title}
                </Button>)
            })}
          </div>
          <div className='grid grid-cols-2 gap-4 mb-3'>
            <div className="">
              <p className='mb-3 text-base font-medium'>Due Date</p>
              <InputRangeDate stateDate={stateDate} handleSelectDate={handleSelectDate}></InputRangeDate>
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
            <Textarea
              className="text-sm text-[#717279] border rounded-md border-graycustom resize-none overflow-hidden transition-all w-full p-2"
              placeholder="enter description your project"
              value={descriptionTask}
              setValue={setDescriptionTask}
            ></Textarea>
          </div>
          <AddUser nameItemList="member" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRemoveUser={handleRemoveUser}></AddUser>
          <div className='flex items-center gap-3 mt-3'>
            <p className='mb-3 text-base font-medium'>Task</p>
            <Button
              onClick={addTaskItem}
              className="button-default w-auto bg-button h-auto px-4 py-[6px] text-white font-medium">+ add</Button>
          </div>
          <div className='flex flex-col gap-2'>
            {taskItem.length > 0 && taskItem.map((item, index) => {
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
                </div>
              )
            })}
          </div>
          <DropdownChooseProject></DropdownChooseProject>
          <div className="flex items-center gap-4 mt-3">
            <Label htmlFor='image' className='flex items-center justify-center w-10 h-10 rounded-md bg-graycustom bg-opacity-10'><IconImage></IconImage></Label>
            <Label className="text-sm font-medium">Add Image</Label>
          </div>

          <div className='flex flex-wrap gap-3 my-2'>
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
            <Label htmlFor='files' className='flex items-center justify-center w-10 h-10 rounded-md bg-graycustom bg-opacity-10'><IconFile></IconFile></Label>
            <Label className="text-sm font-medium">Add File</Label>
          </div>
          <input
            hidden
            onChange={handleUploadFile}
            type="file" id="files" multiple />
          <div className='flex flex-wrap gap-2 mt-3'>
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
          <Button
            onClick={handleUpdateTask}
            className="mt-5 mb-0 font-medium text-white button-default bg-button">Create</Button>
        </motion.div>
      </Portal>
      <Alert
        showAlert={showAlertCancelCreate}
      >
        <div
          transition={{ type: "spring", duration: 0.15 }}
          className='flex flex-col items-center w-full h-full gap-3 p-6 bg-white rounded-md'>
          <IconThink className='block w-12 h-12'></IconThink>
          <p className='text-base font-semibold text-center'>Do you want to continue creating the task?</p>
          <div className='flex items-center justify-between w-full mt-3'>
            <Button onClick={() => setShowAlertCancelCreate(false)} className="px-4 py-2 font-medium text-white rounded-md bg-button">Continue</Button>
            <Button onClick={handleCancel} className="px-4 py-2 font-medium text-[#E80000] rounded-md bg-gray-300 bg-opacity-50">Cancel</Button>
          </div>
        </div>
      </Alert>
      <Portal
        visible={showModalFilterProject}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="w-full h-full"
        onClose={() => setShowModalFilterProject(false)}
      >
        <div className='relative px-6 py-3 bg-white rounded-md shadow-md w-[430px] -translate-x-full mt-2'
          style={{
            left: coordsModalFilter.left + coordsModalFilter.width,
            top: coordsModalFilter.top + coordsModalFilter.height
          }}
        >
          <Label className="text-base font-medium" >Filter Project</Label>
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
  );
}

export default Task;
