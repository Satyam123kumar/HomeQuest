import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest.js";
import { AuthContext } from "../../context/AuthContext.jsx";

function Login() {

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {updateUser} = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    //prevent from refreshing the page
    e.preventDefault();
    setIsLoading(true)
    setError("");
    //this represent form data i.e., username, email, password
    const formData = new FormData(e.target);

    //also if there is more input we can use another method, for that check newPostPage.jsx 
    const username = formData.get("username");
    const password = formData.get("password");
    // console.log(username, email, password);

    //to make request to an api, wew need axios
    try{
      const res = await apiRequest.post("/auth/login", {
        username, password
      })

      // console.log(res.data)

      //here we have stored user info in localstorage (to show in profile page) and have stored tken in cookie to authorize an user
      // localStorage.setItem("user", JSON.stringify(res.data))
      updateUser(res.data)
      navigate("/")
    }catch(err){
      console.log(err)
      setError(err.response.data.message);
    }finally{
      setIsLoading(false);
    }
    
  }
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
