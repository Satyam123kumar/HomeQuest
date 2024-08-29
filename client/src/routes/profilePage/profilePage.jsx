import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx"

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  // console.log(data);

  //if user is not login it cannot visit to profile page

  //but we have to repeat same process fro all the protected route, which is not a good idea 
  //so we will create a new layout (RequireAuth (see in layout.jsx))

  // useEffect(() => {
  //   if (!currentUser) navigate("/login")
  // }, [currentUser, navigate])

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout")
      // localStorage.removeItem("user");
      updateUser(null)
      navigate("/")
    } catch (error) {
      console.log(err);
    }
  }
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar || "noAvatar.jpg"}
                alt=""
              />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to='/add'>
              <button>Create New Post</button>
            </Link>
          </div>

          {/* inside postResponse we have data and inside data we have userPosts and savedPosts */}
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.postResponse} errorElement={<p>Error loading posts!</p>}>
              {(postResponse) => <List posts = {postResponse.data.userPosts}/>}   
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.postResponse} errorElement={<p>Error loading posts!</p>}>
              {(postResponse) => <List posts = {postResponse.data.savedPosts}/>}   
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
        <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data}/>}
            </Await>
          </Suspense>
          
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
