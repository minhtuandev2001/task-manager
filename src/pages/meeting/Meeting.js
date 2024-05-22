import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Label from '../../components/label/Label'
import Input from '../../components/input/Input'
import { IconCamOff, IconLogout, IconMessage, IconMicOff, IconMonitor, IconUsers } from '../../components/icons';
import { AuthContext } from "../../context/authContext"

import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
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
    <div>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
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
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls(props) {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>
    </div>
  );
}

function MeetingView(props) {
  const [joined, setJoined] = useState(null);
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
  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined === "JOINED" ? (
        <div>
          <Controls />
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined === "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

export default function Meeting() {
  const { currentUser } = useContext(AuthContext);
  const [toggleJoin, setToggleJoin] = useState(false);
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

  const handleJoinMeeting = () => {
    setToggleJoin(true)
  }
  const handleOutMeeting = () => {
    setToggleJoin(false)
  }
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
      {/* {!toggleJoin ? (
        <div className="bg-white flex items-center justify-center w-full h-[calc(100vh-56px-24px)] pt-3 px-3 rounded-md">
          <div className='w-full max-w-[436px] mx-auto'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='displayName' className="font-medium">Display Name</Label>
              <Input
                type='text'
                name="displayName"
                className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
                placeholder="Enter your display name..."
              ></Input>
            </div>
            <div className='flex flex-col gap-2 mt-3'>
              <Label htmlFor='keyMeeting' className="font-medium">Key meeting</Label>
              <Input
                type='text'
                name="keyMeeting"
                className='w-full h-12 p-3 border rounded-md border-graycustom bg-input focus:border-bluecustom'
                placeholder="Enter key..."
              ></Input>
            </div>
            <button
              onClick={handleJoinMeeting}
              type='button'
              className='mt-8 font-semibold text-white rounded-md button-default bg-button'
            >Join</button>
          </div>
        </div>
      ) : (
        <div className="bg-white flex w-full h-[calc(100vh-56px-24px)] gap-3">
          <div className='flex flex-col w-full gap-2 px-3 pt-3 pb-2 rounded-md'>
            <div className='flex-1 bg-orange-300'></div>
            <div className='h-full max-h-[300px] bg-blue-300'>
              <div className='bg-green-300 rounded-full w-28 h-28'>
              </div>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <button type='button' className='flex items-center justify-center h-10 w-14 bg-[#F6F7F9] rounded-[4px]'>
                <IconCamOff></IconCamOff>
              </button>
              <button type='button' className='flex items-center justify-center h-10 w-14 bg-[#F6F7F9] rounded-[4px]'>
                <IconMicOff></IconMicOff>
              </button>
              <button type='button' className='flex items-center justify-center h-10 w-14 bg-[#F6F7F9] rounded-[4px]'>
                <IconMonitor></IconMonitor>
              </button>
              <button type='button' className='flex items-center justify-center h-10 w-14 bg-[#F6F7F9] rounded-[4px]'>
                <IconMessage></IconMessage>
              </button>
              <button type='button' className='flex items-center justify-center h-10 w-14 bg-[#F6F7F9] rounded-[4px]'>
                <IconUsers></IconUsers>
              </button>
              <button
                onClick={handleOutMeeting}
                type='button' className='flex items-center justify-center h-10 w-14 bg-[#ED3159] rounded-[4px]'>
                <IconLogout selected={true}></IconLogout>
              </button>
            </div>
          </div>
          <div className='bg-red-300 pt-3 px-3 rounded-md w-full max-w-[350px]'></div>
        </div>
      )} */}
    </div>
  )
}
