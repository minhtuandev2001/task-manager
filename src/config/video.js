//This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0MTQxMWRiNS1lZDU0LTQ2MGItYWI0Yy1hZjQxMDU2ZTA4OTMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyNDQxODI0NiwiZXhwIjoxNzI3MDEwMjQ2fQ.Mcb0FlwrKAUk-kQNtrKJ6NHEJuD5zT-h_ToXMbVgJOM";
// API call to create a meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};