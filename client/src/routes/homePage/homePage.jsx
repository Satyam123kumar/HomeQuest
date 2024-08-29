import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext.jsx";

function HomePage() {

  const {currentUser} = useContext(AuthContext);
  // console.log(currentUser);
  
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
          <p>
          Our app makes buying, selling, and renting properties simple and accessible. 
          Dive into the world of real estate with personalized searches and seamless navigation 
          and connect with owners instantly using our real-time chat feature.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
