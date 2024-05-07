import React, { useRef, useState } from 'react';
import IconStarFill from '../icons/IconStarFill';
import IconStarOutline from '../icons/IconStarOutline';
import Button from '../button/Button';
import IconCalender from '../icons/IconCalender';
import { IconCancel, IconChevronDown, IconDOC, IconFile, IconImage, IconProject, IconThink } from '../icons';
import Portal from '../portal/Portal';
import { motion } from "framer-motion"
import InputRangeDate from '../input/InputRangeDate';
import Textarea from '../input/Textarea';
import AddUser from '../modal/AddUser';
import Alert from '../alert/Alert';
import Input from '../input/Input';
import Label from '../label/Label';
import ThumbnailFile from '../thumbnail/ThumbnailFile';

const task = [
  {
    id: 0,
    content: "Create a Design System 1",
    checked: false
  },
  {
    id: 1,
    content: "Create a Design System 2",
    checked: true
  },
  {
    id: 2,
    content: "Create a Design System 3",
    checked: false
  },
]
const CardTask = () => {
  const [showModalTask, setShowModalTask] = useState(false);
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
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [nameTask, setNameTask] = useState("Create a Design System for Enum Workspace.")
  const [descriptionTask, setDescriptionTask] = useState("Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi error explicabo omnis perferendis repellat, harum soluta aliquam fugiat obcaecati! Ea perferendis magni est amet hic consequatur, eveniet repellendus impedit facere.");
  const [statusTask, setStatusTask] = useState("going");
  const [isStatusRequest, setIsStatusRequest] = useState(false);
  const [project, setProject] = useState("high");
  const [userListAdd, setUserListAdd] = useState({
    client: [],
    leader: [],
    member: [],
  })
  const [showAlertCancelUpdate, setShowAlertCancelUpdate] = useState(false)
  const [imagesUpload, setImageUpload] = useState(null);
  const [filesUpload, setFilesUpload] = useState(null);
  const [timeTask, setTimeTask] = useState({
    timeStart: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()),
    timeEnd: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()),
  })
  const [errorTime, setErrorTime] = useState("");

  // chon ngay thang
  const clickDatePicker = (e) => {
    setCoords(inputDateRef.current.getBoundingClientRect());
    setShowPickerDate(true)
  }
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
    setIsStatusRequest(true)
    switch (status) {
      case "going":
        // chuyển sáng pause
        setStatusTask("pause") // cập nhật ngay
        setTimeout(() => { // call api // lỗi thì chuyển trạng thái về cái trước đó
          console.log("check ",)
          setIsStatusRequest(false);
        }, 5000);
        break;
      case "pause":
        // chuyển sáng done
        break;
      case "done":
        // chuyển sáng going
        break;
      default:
        break;
    }
  }
  // kết thúc xử lý thay đổi trạng thái task

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
  const handleUpdateTask = () => { }
  const handleRemoveTask = () => {
    console.log("check delete",)
  }
  const handleCancel = () => {
    setShowAlertCancelUpdate(false)
    setShowModalTask(false)
    setToggleUpdate(false)
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
  return (
    <>
      <div className="flex flex-col gap-3 p-4 py-3 rounded-md shadow-md card-project">
        <div className='flex gap-2'>
          <h2 className='text-base font-semibold line-clamp-1'>{nameTask}</h2>
          <button type='button'
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
          <Button
            // disabled={isStatusRequest}
            // onClick={() => handleStatusProject(statusTask)}
            className='button-default w-auto bg-button bg-opacity-30 text-sm text-[#3754DB] h-auto px-4 py-[6px] rounded-full font-medium self-start mb-0'>On going
          </Button>
          <Button
            // disabled={isStatusRequest}
            // onClick={() => handleStatusProject(statusTask)}
            className='button-default w-auto text-sm bg-[#ED3159] text-white h-auto px-4 py-[6px] rounded-full font-medium self-start mb-0'>High
          </Button>
        </div>
        {/* {statusTask === "going" && (
          <Button
            disabled={isStatusRequest}
            onClick={() => handleStatusProject(statusTask)}
            className='button-default w-auto bg-button bg-opacity-30 text-[#3754DB] h-auto px-4 py-2 rounded-full font-medium self-start'>On going
          </Button>)}
        {statusTask === "pause" && (
          <Button
            disabled={isStatusRequest}
            onClick={() => handleStatusProject(statusTask)}
            className='button-default w-auto bg-[#ED3159] bg-opacity-30 text-[#ED3159] h-auto px-4 py-2 rounded-full font-medium self-start'>Pause
          </Button>)}
        {statusTask === "done" && (
          <Button
            disabled={isStatusRequest}
            onClick={() => handleStatusProject(statusTask)}
            className='button-default w-auto bg-[#00C271] bg-opacity-30 text-[#00C271] h-auto px-4 py-2 rounded-full font-medium self-start'>Done
          </Button>)} */}
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
            <span className='text-sm font-medium text-[#717279]'>Asan Website</span>
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
                  defaultValue="Create a Design System for Enum Workspace."
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
          {statusTask === "going" && (
            <Button
              disabled={isStatusRequest}
              onClick={() => handleStatusProject(statusTask)}
              className='button-default w-auto bg-button bg-opacity-30  text-sm text-[#3754DB] h-auto px-4 py-[6px] rounded-full font-medium self-start'>On going
            </Button>)}
          {statusTask === "pause" && (
            <Button
              // disabled={isStatusRequest}
              // onClick={() => handleStatusProject(statusTask)}
              className='button-default w-auto bg-[#ED3159] bg-opacity-30 text-sm text-[#ED3159] h-auto px-4 py-[6px] rounded-full font-medium self-start'>Pause
            </Button>)}
          {statusTask === "done" && (
            <Button
              // disabled={isStatusRequest}
              // onClick={() => handleStatusProject(statusTask)}
              className='button-default w-auto bg-[#00C271] bg-opacity-30 text-sm text-[#00C271] h-auto px-4 py-[6px] rounded-full font-medium self-start'>Done
            </Button>)}
          <div className='grid grid-cols-2 gap-4 mb-3'>
            <div className="">
              <p className='mb-3 text-base font-medium'>Due Date</p>
              <InputRangeDate ref={inputDateRef} onClick={clickDatePicker} coords={coords} showPickerDate={showPickerDate} setShowPickerDate={setShowPickerDate} stateDate={stateDate} handleSelectDate={handleSelectDate}></InputRangeDate>
            </div>
            <div className="">
              <p className='mb-3 text-base font-medium'>Time</p>
              <div className="flex items-center gap-1">
                <div htmlFor='timeStart' className='flex items-center border border-graycustom h-10 rounded-md px-2 justify-center cursor-pointer'>
                  <input
                    onChange={handleTimeTask}
                    defaultValue={timeTask.timeStart}
                    type="time" id="timeStart" name="timeStart" className='text-sm font-medium text-[#787486] tracking-wider' />
                </div>
                <span>-</span>
                <div className='flex items-center border border-graycustom h-10 rounded-md px-2 justify-center cursor-pointer'>
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
          <AddUser nameItemList="member" userListAdd={userListAdd} handleAddUser={handleAddUser} handleRemoveUser={handleRemoveUser}></AddUser>
          <div className='flex gap-3 items-center mt-3'>
            <p className='mb-3 text-base font-medium'>Task</p>
            <Button
              className="button-default w-auto bg-button h-auto px-4 py-[6px] text-white font-medium">+ add</Button>
          </div>
          <div className='flex flex-col gap-2'>
            {task.length > 0 && task.map((item) => {
              return (
                <div key={item.id} className='flex gap-4 items-center'>
                  <Input type='checkbox' checked={true} onChange={() => { }}></Input>
                  <Label className="text-sm">{item.content}</Label>
                  <Button className='w-4'>
                    <IconCancel></IconCancel>
                  </Button>
                </div>
              )
            })}
          </div>
          <Button className="w-full">
            <div className='flex justify-between items-center border border-graycustom p-3 rounded-md mt-3'>
              <p>Choose Project</p>
              <IconChevronDown></IconChevronDown>
            </div>
          </Button>
          <div className="flex items-center gap-4 mt-3">
            <Label htmlFor='image' className='w-10 h-10 flex justify-center items-center bg-graycustom bg-opacity-10 rounded-md'><IconImage></IconImage></Label>
            <Label className="font-medium text-sm">Add Image</Label>
          </div>

          <div className='my-2 flex gap-3 flex-wrap'>
            {imagesUpload !== null && Array(imagesUpload.length).fill(null).map((item, index) => {
              return (
                <div key={index} className='relative w-[100px] h-[100px]'>
                  <img className='w-full h-full object-cover' src={URL.createObjectURL(imagesUpload[index])} alt="" />
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
            <Label htmlFor='files' className='w-10 h-10 flex justify-center items-center bg-graycustom bg-opacity-10 rounded-md'><IconFile></IconFile></Label>
            <Label className="font-medium text-sm">Add File</Label>
          </div>
          <input
            hidden
            onChange={handleUploadFile}
            type="file" id="files" multiple />
          <div className='mt-3 flex flex-wrap gap-2'>
            {filesUpload !== null && Array(filesUpload.length).fill(null).map((item, index) => {
              return (
                <div key={index} className='w-[calc(50%-8px)] flex items-center gap-2 rounded-md p-2 bg-gray-200'>
                  <div className='min-w-[22px] min-h-[29px]'>
                    <ThumbnailFile fileExtension={filesUpload[index].name.split(".")[1]}></ThumbnailFile>
                  </div>
                  <span className='line-clamp-1 font-medium text-sm flex-1'>{filesUpload[index].name}</span>
                  <Button
                    onClick={() => handleRemoveFilesUpload(index)}
                    className="w-full h-full max-w-4 max-h-4 flex items-center justify-center"><IconCancel></IconCancel></Button>
                </div>
              )
            })}
          </div>
          {toggleUpdate ?
            (<Button
              onClick={handleUpdateTask}
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
            <Button onClick={handleUpdateTask} className="px-4 py-2 font-medium text-white rounded-md bg-button">Save</Button>
            <Button onClick={handleCancel} className="px-4 py-2 font-medium text-[#E80000] rounded-md bg-gray-300 bg-opacity-50">Cancel</Button>
          </div>
        </div>
      </Alert>
    </>
  );
}

export default CardTask;
