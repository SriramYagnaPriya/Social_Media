import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/UserRequests";

const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);
    
    const getUserData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const { data: user } = await getUser(userId);
        setUserData(user);
        dispatch({ type: "SAVE_USER", data: user });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    getUserData();
  }, [data.members, currentUser, dispatch]); // Add dependencies

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Show loading text
  }

  return (
    <>
      <div className="follower conversation" onClick={() => console.log('Open chat with:', userData?.firstname)}>
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={userData?.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{ fontSize: '0.8rem' }}>
            <span>{userData?.firstname} {userData?.lastname}</span>
            <span style={{ color: online ? "#51e200" : "" }}>{online ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
