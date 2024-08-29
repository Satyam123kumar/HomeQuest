import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
// import { singlePostData, userData } from "../../lib/dummydata";
import { useLoaderData, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx"
import apiRequest from "../../lib/apiRequest.js"

function SinglePage() {
  //this post contains all the info as we passed in add post (post, postdetail,user)
  const post = useLoaderData();
  // console.log(post)
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate();
  const recieverID = post.userId;


  const handleChat = async () => {
    // navigate("/profile")


    const allChat = await apiRequest.get("/chat");
    // console.log("all chats of logged in user", allChat.data[0].userIDs);

    let a = 1;
    for (let i = 0; i < allChat.data.length; i++) {
      // console.log(allChat.data[i].userIDs[1]);

      let receiverId = allChat.data[i].userIDs[1]

      if (receiverId.includes(recieverID)) {
        // console.log("message phle se hai");
        navigate("/profile");
        a = 0;
      }
    }

    if (a === 1) {
      // console.log("message phle se nhi hai")
      await apiRequest.post("/chat", { receiverId: recieverID });
      navigate("/profile");
    }

  };

  const handleSave = async () => {

    if (!currentUser) {
      navigate('/login')
    }

    //After react 19 update this to use optemistik hook
    setSaved((prev) => !prev)
    try {
      await apiRequest.post('/user/save', { postId: post.id })
    } catch (err) {
      console.log("error in saving, ", err)
      setSaved((prev) => !prev)
    }
  }

  const isPostOwner = currentUser?.id === post.userId;
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.postDetail.desc) }}></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {
                  post.postDetail.utilities === "owner" ?
                    <p>Owner is responsible</p> :
                    <p>Tenant is responsible</p>
                }
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? <p>Pets Allowed</p> : <p>Pets not Allowed</p>}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{post.postDetail.school > 999 ? post.postDetail.school / 1000 + "km" : post.postDetail.school + "m"} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus > 999 ? post.postDetail.bus / 1000 + "km" : post.postDetail.bus + "m"} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.resturant > 999 ? post.postDetail.resturant / 1000 + "km" : post.postDetail.resturant + "m"} away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            {!isPostOwner && (<button onClick={handleChat}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            )}
            <button onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white"
              }}>
              <img src="/save.png" alt="" />
              {saved ? "Place saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
      {/* {chat && <Chat chats={[chat]} />} */}
    </div>
  );
}

export default SinglePage;
