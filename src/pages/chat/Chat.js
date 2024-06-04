import React, { useContext, useEffect, useRef, useState } from 'react'
import { IconCancel, IconDownload, IconFile, IconImage, IconPlus, IconSend, IconSmile } from '../../components/icons'
import ChatItem from '../../components/card/ChatItem'
import Button from '../../components/button/Button';
import ThumbnailFile from '../../components/thumbnail/ThumbnailFile';
import axios from "axios";
import { BASE_URL } from '../../constans/url';
import { AuthContext } from "../../context/authContext"
import { toast } from 'react-toastify';
import imageGroup from "../../asset/images/imageGroup.png";
import noMessage from "../../asset/images/noMessage.png"
import { useSocket } from '../../context/socketContext';
import { useMessageNoti } from '../../context/messageNotiContext';
import moment from "moment";
import ModalCreateChat from '../../components/modal/ModalCreateChat';

export default function Chat() {
  const socket = useSocket()
  const { currentUser } = useContext(AuthContext)
  const { setCountMessageUnRead } = useMessageNoti();
  const [imagesUpload, setImageUpload] = useState(null);
  const [filesUpload, setFilesUpload] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  const loadChatRef = useRef(null)
  const [chats, setChats] = useState([]);
  const [loadingLoadUser, setLoadingLoadUser] = useState(false)

  const [selectedChat, setSelectedChat] = useState(null)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [messages, setMessages] = useState([])
  const bodyRef = useRef(null)
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

  loadChatRef.current = () => {
    setLoadingLoadUser(true)
    axios.get(`${BASE_URL}/chat`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      console.log("check ", res)
      setChats(res.data?.data || [])
      setLoadingLoadUser(false)
    }).catch((err) => {
      setLoadingLoadUser(false)
      console.log("check ", err)
      toast.error(err.data?.data.messages)
    })
  }
  useEffect(() => {
    loadChatRef.current();
  }, [])

  // tải message
  const handleSelectedChat = async (item) => {
    setSelectedChat(item)
    setLoadingMessages(true)
    setMessages([]);
    // load messages in board
    try {
      const { data } = await axios.get(`${BASE_URL}/message/${item._id}`, {
        headers: {
          "Authorization": `Bearer ${currentUser.token}`,
        }
      })
      setMessages(data?.data || [])
      setLoadingMessages(false)
      socket.emit("join chat", item._id)
    } catch (err) {
      toast.error(err)
      setLoadingMessages(false)
    }

    if (item?.latestMessage) { // có tin nhắn mới xử lý
      // cập nhật lại trạng thái đọc tin nhắn
      axios.patch(`${BASE_URL}/message/status-message/${item?.latestMessageId}`, {}, {
        headers: {
          "Authorization": `Bearer ${currentUser.token}`
        }
      }).then((res) => {
        console.log("check ", res)
        // cập nhật trạng thái tin nhắn ở list nếu người dùng đang ở trong đoạn chat
        setChats(prevChats => prevChats.map((chat) => {
          if (chat._id === item._id) {
            if (chat.latestMessage?.usersRead) {
              chat.latestMessage.usersRead = [...chat.latestMessage.usersRead, currentUser.id];
            }
          }
          return chat
        }))
        setCountMessageUnRead(prevChats => prevChats.map((chat) => {
          if (chat._id === item._id) {
            if (chat.latestMessage?.usersRead) {
              chat.latestMessage.usersRead = [...chat.latestMessage.usersRead, currentUser.id];
            }
          }
          return chat
        }))
      }).catch((err) => {
        console.log("check ", err.response.data.message);
      })

    }
  }
  // kết thúc tải message

  // gửi tin nhắn
  const [loadingSendMessasge, setLoadingSendMessasge] = useState(false)
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (selectedChat) {
      if (inputMessage.length > 0 || imagesUpload !== null || filesUpload !== null) {
        setLoadingSendMessasge(true)
        const formData = new FormData();
        formData.append("sender", currentUser.id);
        formData.append("content", inputMessage);
        formData.append("room_chat_id", selectedChat._id);
        formData.append("users", selectedChat.users);
        formData.append("usersRead", [currentUser.id]);
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
        axios.post(`${BASE_URL}/message/create`, formData, {
          headers: {
            "Authorization": `Bearer ${currentUser.token}`,
            "Content-Type": "multipart/form-data"
          }
        }).then((res) => {
          setMessages(prevMessage => [...prevMessage, res.data?.data])
          socket.emit("new message", res.data?.data, selectedChat.users)
          setInputMessage("")// reset input
          setImageUpload(null)
          setFilesUpload(null)
          setLoadingSendMessasge(false)
        }).catch((err) => {
          toast.error(err.response?.data.messages)
          setLoadingSendMessasge(false)
        })
      }
    }
  }
  // kết thúc gửi tin nhắn

  useEffect(() => {
    // nhận tin nhắn
    socket.on("server return message", message => {
      if (message.infoSender._id !== currentUser.id) { // những client khác nhận được thôi
        if (selectedChat) {
          if (message.room_chat_id === selectedChat._id) {
            // cập nhật ở board chat
            setMessages(prevMessage => [...prevMessage, message])
            // cập nhật lại trạng thái đọc tin nhắn
            axios.patch(`${BASE_URL}/message/status-message/${message._id}`, {}, {
              headers: {
                "Authorization": `Bearer ${currentUser.token}`
              }
            }).then((res) => {
              // cập nhật trạng thái tin nhắn ở list nếu người dùng đang ở trong đoạn chat
              setChats(prevChats => prevChats.map((chat) => {
                if (chat._id === message.room_chat_id) {
                  if (chat.latestMessage?.usersRead) {
                    chat.latestMessage.usersRead = [...chat.latestMessage.usersRead, currentUser.id];
                  }
                }
                return chat
              }))
              setCountMessageUnRead(prevChats => prevChats.map((chat) => {
                if (chat._id === message.room_chat_id) {
                  if (chat.latestMessage?.usersRead) {
                    chat.latestMessage.usersRead = [...chat.latestMessage.usersRead, currentUser.id];
                  }
                }
                return chat
              }))
            }).catch((err) => {
              console.log("check ", err.response.data.message);
            })
          } else {
            console.log("check selected chat khac")
            setCountMessageUnRead(prevChats => prevChats.map((chat) => {
              if (chat._id === message.room_chat_id) {
                if (chat.latestMessage?.usersRead) {
                  chat.latestMessage.usersRead = [...chat.latestMessage.usersRead.filter(item => item !== currentUser.id)];
                }
              }
              return chat
            }))
          }
        } else {
          console.log("check ko selected")
          setCountMessageUnRead(prevChats => prevChats.map((chat) => {
            if (chat._id === message.room_chat_id) {
              if (chat.latestMessage?.usersRead) {
                chat.latestMessage.usersRead = [...chat.latestMessage.usersRead.filter(item => item !== currentUser.id)];
              }
            }
            return chat
          }))
        }
      }
      setChats(prevChats => {
        if (prevChats.length > 0) {
          let chatNewUpdate = prevChats.filter((chat) => chat._id === message.room_chat_id)
          let chatsNew = prevChats.filter((chat) => chat._id !== message.room_chat_id)
          if (chatNewUpdate.length > 0) {
            let newChats = [chatNewUpdate[0], ...chatsNew];
            newChats.map((chat) => {
              if (chat._id === message.room_chat_id) {
                chat.latestMessageId = message._id;
                chat.latestMessage = message;
              }
              return chat;
            })
            return newChats
          } else {
            return chatsNew
          }
        } else {
          return []
        }
      })
    })
    return () => {
      socket.off("server return message");
    }
  }, [socket, selectedChat, currentUser, setCountMessageUnRead])

  useEffect(() => {
    if (selectedChat) {
      const element = bodyRef.current;
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: "smooth"
      })
    }
  }, [messages, selectedChat])
  useEffect(() => {
    socket.on("server return statusOnline", data => {
      console.log("other user dis", data)
      console.log("check status", data)
      setChats(prevChats => prevChats.map((chat) => {
        if (chat.isGroupChat) {
          chat.infoUsers = chat.infoUsers.map((user) => {
            if (user._id === data.id) {
              user.statusOnline = data.status
            }
            return user
          })
        } else {
          if (chat.infoUser._id === data.id) {
            chat.infoUser.statusOnline = data.status;
          }
        }
        return chat
      }))
    })
  }, [socket])

  // xử lý thoát khỏi phongf chat
  const handleExitsChat = (id) => {
    // kiểm tra xem có đang selected chat không
    if (selectedChat) {
      if (selectedChat._id === id) {
        setSelectedChat(null)
      }
    }
    axios.patch(`${BASE_URL}/chat/exits-chat/${id}`, {}, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      toast.success("Exits chat success")
      setChats(prevChats => prevChats.filter((chat) => chat._id !== id))
    }).catch((err) => {
      toast.error(err.response?.data.messages)
    })
  }
  // kết thúc xử lý thoát khỏi phòng chat

  // xử lý tạo phòng chat (single, multiple)
  const [showModalCreateRoom, setShowModalCreateRoom] = useState(false);
  const [nameGroup, setNameGroup] = useState("");
  const [userListAdd, setUserListAdd] = useState([{ id: currentUser.id, email: currentUser.email }]);
  const handleAddUser = (data) => {
    setUserListAdd(preData => {
      let userExist = preData.some((item) => item.id === data.id)
      return userExist ? preData : [...preData, { id: data.id.toString(), email: data.email }]
    })
  }

  const handleRemoveUser = (id) => {
    setUserListAdd(preData => preData.filter((item) => item.id !== id))
  }

  const handleCreateChat = () => {
    console.log("check ", nameGroup)
    console.log("check ", [userListAdd.map((item) => item.id)])
    axios.post(`${BASE_URL}/chat/create`, {
      chatName: nameGroup,
      isGroupChat: true,
      users: userListAdd.map((item) => item.id),
      groupAdmin: [currentUser.id],
      createdBy: { user_id: currentUser.id },
    }, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      toast.success("Create chat success")
    }).catch((err) => {
      toast.error(err.response?.data.messages)
    })
  }
  // kết thúc xử lý tạo phòng chat (single, multiple)

  // xử lý nhận nhóm chat mới 
  useEffect(() => {
    // nhận nhóm chat khi project được tạo
    socket.on("CREATE PROJECT", (project, noti, chat) => {
      if (chat?.createdBy?.user_id !== currentUser.id) {
        console.log("check trong chat")
        setChats(prevChats => [chat, ...prevChats])
      }
    })
    // nhận nhóm chát khi tạo một nhóm chat
    socket.on("CREATE CHAT", (chat, noti) => {
      setChats(prevChats => [chat, ...prevChats])
    })
  }, [socket, currentUser.id])
  // kết thúc xử lý nhận nhóm chat mới 

  // Rời khỏi trang chat
  useEffect(() => {
    // loại bỏ chat đang chọn
    return () => {
      setSelectedChat(null);
    }
  }, [])
  return (
    <div className='min-h-[calc(100vh-56px-24px)]'>
      <div className='flex gap-3'>
        <div className='flex-1 bg-white rounded-md'>
          <div className="px-4 py-2 shadow-sm">
            <div className='flex items-center gap-3 min-h-9'>
              {selectedChat && (
                <>
                  <img className='object-cover rounded-full h-9 w-9' src={selectedChat.isGroupChat ? imageGroup : selectedChat.infoUser?.avatar} alt="" />
                  <span className='text-sm font-semibold'>{selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.infoUser?.username}</span>
                </>
              )}
            </div>
          </div>
          <div ref={bodyRef} className="px-4 w-full h-[calc(100vh-56px-24px-52px-40px-18px)] flex flex-col overflow-scroll no-scrollbar">
            {selectedChat !== null ? (
              loadingMessages ? (<div className='w-6 h-6 mx-auto mt-10 border-4 border-r-4 border-blue-600 rounded-full border-r-transparent animate-spin'></div>)
                : (
                  messages.length > 0 ? (
                    messages.map((item, index) => {
                      return (<div key={item._id} className={`${currentUser.id === item.infoSender._id ? "self-end" : ""} flex flex-col`}>
                        {messages[index - 1] ? (
                          item.infoSender._id !== messages[index - 1].infoSender._id && (
                            <p className='text-sm font-semibold'>{currentUser.id === item.infoSender._id ? "" : item.infoSender?.username}</p>
                          )
                        ) : (
                          <p className='text-sm font-semibold'>{currentUser.id === item.infoSender._id ? "" : item.infoSender?.username}</p>
                        )}
                        {item?.content &&
                          <p className={`max-w-[350px] p-2 rounded-md text-base mt-1 ${currentUser.id === item.infoSender._id ? "bg-blue-500 text-white self-end" : "bg-gray-100 self-start"}`}>{item?.content}</p>}
                        {item?.images &&
                          <div className='max-w-[350px] p-2 rounded-md flex gap-1'>
                            {item?.images.map((item) => {
                              return (
                                <img key={item} className='max-w-[100px h-[100px] object-cover' src={item} alt="" />
                              )
                            })}
                          </div>}
                        <div className='max-w-[350px] flex flex-col gap-1'>
                          {item?.files.length > 0 && item?.files.map((item, index) => {
                            return (
                              <div
                                key={item.id} className='flex items-center justify-between p-2 bg-gray-200 rounded-md'>
                                <a href={item.link_view} target='_blank' rel="noreferrer" className='flex items-center gap-2 w-[calc(100%-25px)]'>
                                  <div className='min-w-[22px] min-h-[29px]'>
                                    <ThumbnailFile fileExtension={item.nameFile.split(".")[1]}></ThumbnailFile>
                                  </div>
                                  <span className='flex-1 text-sm font-medium line-clamp-1'>{item.nameFile}</span>
                                </a>
                                <a href={item.link_download} target='_blank' rel="noreferrer" className="flex items-center justify-center w-full h-full max-w-4 max-h-4"><IconDownload></IconDownload></a>
                              </div>
                            )
                          })}
                        </div>
                        <span className={`block text-xs font-medium text-gray-400 ${currentUser.id === item.infoSender._id ? "self-end" : ""}`}>{moment(item?.createdAt, "YYYY-MM-DD HH:mm Z").format("HH:mm").toString()}</span>
                      </div>)
                    }))
                    : (<img className='w-[200px] mx-auto mt-20' src={noMessage} alt="" />)))
              : (
                <p className='mt-10 text-2xl font-medium text-center text-graycustom'>Selected Chat</p>
              )}
            <div className='flex flex-wrap gap-2 mt-auto mb-2'>
              {imagesUpload !== null && Array(imagesUpload.length).fill(null).map((item, index) => {
                return (
                  <div key={index} className='relative w-[70px] h-[70px]'>
                    <img className='object-cover w-full h-full' src={URL.createObjectURL(imagesUpload[index])} alt="" />
                    <Button
                      onClick={() => handleRemoveImageUpload(index)}
                      className="w-5 absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-gray-300 p-[2px] h-5 rounded-full flex justify-center items-center"><IconCancel></IconCancel></Button>
                  </div>
                )
              })}
            </div>
            <div className='grid grid-cols-4 gap-2'>
              {filesUpload !== null && Array(filesUpload.length).fill(null).map((item, index) => {
                return (
                  <div key={index} className='flex items-center gap-2 p-2 bg-gray-200 rounded-md'>
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
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center w-full gap-2 px-4 my-2">
            <input type="text"
              onChange={(e) => setInputMessage(e.target.value)}
              value={inputMessage}
              className="rounded-lg border border-[#D9D9D9] h-10 px-2 bg-[#F6F7F9] flex-1 focus:border-blue-500"
            />
            <label htmlFor='image' className='cursor-pointer w-10 h-10 rounded-md bg-[#F6F8FD] flex justify-center items-center hover:bg-slate-200 transition-all '><IconImage></IconImage></label>
            <input
              hidden
              onChange={handleUploadImage}
              type="file" id="image" accept="image/png, image/jpeg" multiple />
            <label htmlFor='files' className='cursor-pointer w-10 h-10 rounded-md bg-[#F6F8FD] flex justify-center items-center hover:bg-slate-200 transition-all '><IconFile></IconFile></label>
            <input
              hidden
              onChange={handleUploadFile}
              type="file" id="files" multiple />
            <button type="button" className='w-10 h-10 rounded-md bg-[#F6F8FD] flex justify-center items-center hover:bg-slate-200 transition-all '><IconSmile></IconSmile></button>
            <button
              type='submit' className='w-10 h-10 rounded-md bg-[#F6F8FD] flex justify-center items-center hover:bg-slate-200 transition-all '>
              {loadingSendMessasge ? (
                <div className='w-5 h-5 border-4 border-r-4 border-blue-500 rounded-full border-r-transparent animate-spin'></div>
              ) : (<IconSend></IconSend>)}
            </button>
          </form>
        </div>
        <div className='w-full max-w-[350px] bg-white rounded-md p-4'>
          <div className='flex items-center gap-3'>
            <input type="text"
              className="rounded-lg border border-[#D9D9D9] h-10 px-2 bg-[#F6F7F9] w-full focus:border-blue-500"
            />
            <button
              onClick={() => setShowModalCreateRoom(true)}
              type='button' className='w-5'><IconPlus></IconPlus></button>
          </div>
          <div className='flex flex-col mt-3 gap-2 overflow-scroll max-h-[calc(100vh-56px-24px-52px-50px)] no-scrollbar'>
            {loadingLoadUser && <div className='w-5 h-5 mx-auto mt-2 border-4 border-r-4 border-blue-600 rounded-full border-r-transparent animate-spin'></div>}
            {chats.length > 0 ? chats.map((item) => {
              return (<ChatItem key={item._id} data={item} handleSelectedChat={handleSelectedChat} handleExitsChat={handleExitsChat}></ChatItem>)
            })
              : (
                null
              )}
          </div>
        </div>
      </div>
      {/* protal create room chat */}
      <ModalCreateChat
        showSearchPortal={showModalCreateRoom}
        setShowSearchPortal={setShowModalCreateRoom}
        userListAdd={userListAdd}
        handleAddUser={handleAddUser}
        handleRemoveUser={handleRemoveUser}
        nameGroup={nameGroup}
        setNameGroup={setNameGroup}
        handleCreateChat={handleCreateChat}
      ></ModalCreateChat>
    </div>
  )
}
