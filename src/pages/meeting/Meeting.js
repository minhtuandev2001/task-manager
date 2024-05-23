import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Label from '../../components/label/Label'
import Input from '../../components/input/Input'
import { IconCamOff, IconCamOn, IconLogout, IconMessage, IconMicOff, IconMicOn, IconMonitor, IconSend, IconUsers } from '../../components/icons';
import { AuthContext } from "../../context/authContext"
import { motion } from "framer-motion";

import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "../../config/video";
import ReactPlayer from "react-player";

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  return (
    <div className="bg-white flex items-center justify-center w-full h-[calc(100vh-56px-24px)] pt-3 px-3 rounded-md">
      <div className='w-full max-w-[436px] mx-auto'>
        <div className='flex flex-col gap-2 mt-3'>
          <Label htmlFor='keyMeeting' className="font-medium">Key meeting</Label>
          <Input
            onChange={(e) => {
              setMeetingId(e.target.value);
            }}
            type='text'
            name="keyMeeting"
            className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
            placeholder="Enter key..."
          ></Input>
        </div>
        <button
          onClick={onClick}
          type='button'
          className='mt-8 font-semibold text-white rounded-md button-default bg-button'
        >Join</button>
        <button
          onClick={onClick}
          type='button'
          className='mt-8 font-semibold text-white rounded-md button-default bg-button'
        >Create Meeting</button>
      </div>
    </div>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);
  return (
    <div
      onClick={() => props.handleSelectedStream(props.participantId)}
      className='w-[250px] h-[140px] relative  cursor-pointer overflow-hidden'>
      <div className='absolute bottom-0 z-10 flex items-center justify-between w-full px-2 mb-1 transition-all cursor-pointer'>
        <span className={`text-sm font-semibold bg-none ${webcamOn ? "text-white" : "text-black"}`}>{displayName}</span>
        {micOn ? <IconMicOn className='flex items-center justify-center w-8 h-8 p-2 bg-black bg-opacity-50 rounded-full' selected={true}></IconMicOn> : <IconMicOff className='flex items-center justify-center w-8 h-8 p-2 bg-black bg-opacity-50 rounded-full' selected={true}></IconMicOff>}
      </div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          className="react-player"
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      ) : (
        <div className='bg-[#f6f7f9] :dark:bg-[#191921] rounded-md w-full h-full flex justify-center items-center'><div className='flex items-center justify-center text-base font-bold rounded-full w-14 h-14 bg-slate-300'>{displayName.charAt(0)}</div></div>
      )}
    </div>
  );
}
function ParticipantViewHigh(props) {
  const { presenterId } = useMeeting();
  console.log("check ", presenterId)
  const { screenShareStream, screenShareOn } = useParticipant(presenterId);
  const { webcamStream, webcamOn, micOn, displayName } =
    useParticipant(props.streamId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);
  //Creating a media stream from the screen share stream
  const mediaStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn]);

  return (
    presenterId ? (
      <div
        className='relative w-full h-full overflow-hidden bg-[#f6f7f9] cursor-pointer rounded-md'>
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={mediaStream}
          //
          className="react-player2"

          onError={(err) => {
            console.log(err, "presenter video error");
          }}
        />
      </div>
    ) : (
      props.streamId ? (
        <div
          onClick={() => props.handleSelectedStream("")}
          className='relative w-full h-full overflow-hidden bg-[#f6f7f9] cursor-pointer rounded-md'>
          <div className='absolute bottom-0 z-10 flex items-center justify-between w-full px-2 mb-1 transition-all cursor-pointer'>
            <span className={`text-base font-semibold bg-none ${webcamOn ? "text-white" : "text-black"}`}>{displayName}</span>
            {micOn ? <IconMicOn className='flex items-center justify-center w-8 h-8 p-2 bg-black bg-opacity-50 rounded-full' selected={true}></IconMicOn> : <IconMicOff className='flex items-center justify-center w-8 h-8 p-2 bg-black bg-opacity-50 rounded-full' selected={true}></IconMicOff>}
          </div>
          {webcamOn ? (
            <ReactPlayer
              //
              playsinline // extremely crucial prop
              pip={false}
              light={false}
              controls={false}
              muted={true}
              playing={true}
              //
              url={videoStream}
              //
              className="react-player2"

              onError={(err) => {
                console.log(err, "participant video error");
              }}
            />
          ) : (
            <div className='bg-[#f6f7f9] :dark:bg-[#191921] rounded-md w-full h-full flex justify-center items-center'><div className='flex items-center justify-center text-base font-bold rounded-full w-14 h-14 bg-slate-300'>{displayName.charAt(0)}</div></div>
          )}
        </div>)
        : (
          <div className='relative w-full h-full overflow-hidden bg-[#f6f7f9] rounded-md'></div>
        )

    )
  );
}

function Controls(props) {
  const { leave, toggleMic, toggleWebcam, toggleScreenShare, localScreenShareOn } = useMeeting();
  const { localMicOn } = useMeeting();
  const { localWebcamOn } = useMeeting();
  return (
    <div className='flex items-center justify-center gap-2'>
      <button
        onClick={() => toggleWebcam()}
        type='button' className={`flex items-center justify-center h-10 w-14 rounded-[4px] ${localWebcamOn ? "bg-[#F6F7F9]" : "bg-[#ED3159]"}`}>
        {localWebcamOn ? <IconCamOn></IconCamOn> : <IconCamOff selected={true}></IconCamOff>}
      </button>
      <button
        onClick={() => toggleMic()}
        type='button' className={`flex items-center justify-center h-10 w-14 rounded-[4px] ${localMicOn ? "bg-[#F6F7F9]" : "bg-[#ED3159]"}`}>
        {localMicOn ? <IconMicOn></IconMicOn> : <IconMicOff selected={true}></IconMicOff>}
      </button>
      <button
        onClick={() => toggleScreenShare()}
        type='button' className={`flex items-center justify-center h-10 w-14 rounded-[4px] ${localScreenShareOn ? "bg-[#2384ff]" : "bg-[#F6F7F9]"}`}>
        <IconMonitor selected={localScreenShareOn}></IconMonitor>
      </button>
      <button
        onClick={props.handleSelectedChat}
        type='button' className={`flex items-center justify-center h-10 w-14 rounded-[4px] ${props.isChat ? "bg-[#2384ff]" : "bg-[#F6F7F9]"}`}>
        <IconMessage selected={props.isChat}></IconMessage>
      </button>
      <button
        onClick={props.handleSelectedListUser}
        type='button' className={`flex items-center justify-center h-10 w-14 rounded-[4px] ${props.isListViewUser ? "bg-[#2384ff]" : "bg-[#F6F7F9]"}`}>
        <IconUsers selected={props.isListViewUser}></IconUsers>
      </button>
      <button
        onClick={() => leave()}
        type='button' className='flex items-center justify-center h-10 w-14 bg-[#ED3159] rounded-[4px]'>
        <IconLogout selected={true}></IconLogout>
      </button>
    </div>
  );
}

function UserItem(props) {
  const { webcamOn, micOn, displayName } =
    useParticipant(props.participantId);
  return <div
    onClick={() => props.handleSelectedStream(props.participantId)}
    className='flex w-full p-2 bg-[#f6f7f9] bg-opacity-50 rounded-md items-center justify-between gap-2 cursor-pointer'>
    <div className='w-10 h-10 rounded-md flex justify-center items-center bg-[#e9e9e9] font-medium'>{displayName.charAt(0)}</div>
    <p className='flex-1 font-semibold'>{displayName}</p>
    {webcamOn ? <IconCamOn className='flex items-center justify-center w-7 h-7 '></IconCamOn> : <IconCamOff className='flex items-center justify-center w-7 h-7 '></IconCamOff>}
    {micOn ? <IconMicOn className='flex items-center justify-center w-7 h-7 '></IconMicOn> : <IconMicOff className='flex items-center justify-center w-7 h-7 '></IconMicOff>}
  </div>
}
function ChatView(props) {
  const { publish, messages } = usePubSub(props.chanel);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    // Sending the Message using the publish method
    publish(message, { persist: true });
    setMessage("");
  };
  return (
    <>
      <div className='w-full h-[calc(100vh-56px-24px-24px-24px-40px-12px)] flex flex-col gap-1 overflow-scroll no-scrollbar pt-3'>
        {messages.map((message, index) => {
          return (
            <div key={index} className='p-2 bg-gray-100 rounded-md'>
              <p className='text-sm font-semibold'>{message.senderName}</p>
              <p className='mt-2 text-sm'>{message.message}
              </p></div>
          );
        })}
      </div>
      <div className='flex gap-1 pt-3'>
        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder='enter your message..'
          className='w-full h-10 p-3 border rounded-md border-graycustom focus:border-bluecustom'
          type="text" />
        <div
          onClick={handleSendMessage}
          className='h-10 min-w-10 flex justify-center items-center rounded-md bg-[#f6f7f9]'>
          <IconSend></IconSend>
        </div>
      </div>
    </>
  )
}
function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  const [streamId, setStreamId] = useState("")
  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };
  const handleSelectedStream = (id) => {
    setStreamId(id)
  }
  const [isChat, setIsChat] = useState(false);
  const handleSelectedChat = () => {
    setIsChat(!isChat)
    setIsListViewUser(false)
  }
  const [isListViewUser, setIsListViewUser] = useState(false);
  const handleSelectedListUser = () => {
    setIsListViewUser(!isListViewUser)
    setIsChat(false)
  }
  return (
    <div className='relative'>
      <h3 className='absolute top-[12px] left-[12px] z-10 text-base  text-blue-600 font-semibold'>Meeting Id: {props.meetingId}</h3>
      {joined && joined === "JOINED" ? (
        <div className="flex w-full h-[calc(100vh-56px-24px)] gap-3">
          <div className='flex flex-col w-full gap-2 px-3 pt-3 pb-2 bg-white rounded-md'>
            <div className='flex-1'>
              <ParticipantViewHigh streamId={streamId} handleSelectedStream={handleSelectedStream}></ParticipantViewHigh>
            </div>
            <div className='min-h-[170px] max-h-[350px] flex flex-wrap gap-2'>
              {[...participants.keys()].map((participantId) => (
                <ParticipantView
                  handleSelectedStream={handleSelectedStream}
                  participantId={participantId}
                  key={participantId}
                />
              ))}
            </div>
            <Controls isChat={isChat} handleSelectedChat={handleSelectedChat} isListViewUser={isListViewUser} handleSelectedListUser={handleSelectedListUser} />
          </div>
          {isListViewUser &&
            <motion.div
              animate={{
                x: [-50, 0]
              }}
              transition={{ type: "tween", duration: 0.2 }}
              className='bg-white pt-3 px-3 rounded-md w-full max-w-[350px] transition-all'>
              <span className='flex justify-between mb-2 text-base font-semibold'>Member <IconLogout
                onClick={handleSelectedListUser}
                className='w-5'></IconLogout></span>
              <div className='flex flex-col gap-2'>
                {[...participants.keys()].map((participantId) => (
                  <UserItem
                    handleSelectedStream={handleSelectedStream}
                    participantId={participantId}
                    key={participantId}
                  />
                ))}
              </div>
            </motion.div>}
          {isChat && <motion.div
            animate={{
              x: [-50, 0]
            }}
            transition={{ type: "tween", duration: 0.2 }} className='bg-white pt-3 px-3 rounded-md w-full max-w-[350px]'>
            <span className='flex justify-between mb-2 text-base font-semibold transition-all'>Chat <IconLogout
              onClick={handleSelectedChat}
              className='w-5'></IconLogout></span>
            <ChatView chanel={props.meetingId}></ChatView>
          </motion.div>}
        </div>
      ) : joined && joined === "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button
          className='w-[100px] p-2 fles justify-center items-center bg-button text-white font-semibold h-10 rounded-md mt-10'
          onClick={joinMeeting}>Join</button>
      )
      }
    </div >
  );
}

export default function Meeting() {
  const { currentUser } = useContext(AuthContext);
  const [meetingId, setMeetingId] = useState(null);

  //Getting the meeting id by calling the api we just wrote
  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  //This will set Meeting Id to null when meeting is left or ended
  const onMeetingLeave = () => {
    setMeetingId(null);
  };
  return (
    <div className='rounded-md min-h-[calc(100vh-56px-24px)]'>
      {authToken && meetingId ? (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: true,
            webcamEnabled: true,
            name: currentUser.name,
          }}
          token={authToken}
        >
          <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        </MeetingProvider>
      ) : (
        <JoinScreen getMeetingAndToken={getMeetingAndToken} />
      )}
    </div>
  )
}
