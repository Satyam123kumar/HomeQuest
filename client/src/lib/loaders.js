import { defer } from "react-router-dom";
import apiRequest from "./apiRequest.js"

//here we pass page url and parameter and using that params we select our id and make a get request on to get a particular Post
export const singlePageLoader = async ({request, params}) => {
    //we use id because inside app.jsx for singlePage.jsx path is /:id
    const res = await apiRequest("/post/"+params.id);
    return res.data
}

export const listPageLoader = async ({request, params}) => {

    //here request contains our url like localhost:5173/list?type=rent?city=london?......
    const query = request.url.split("?")[1]
    const postPromise = apiRequest("/post/?"+query);
    // return res.data
    // console.log(request);

    //here we use defer to show loading, while our data is in still loading
    return defer({
        postResponse: postPromise
    })

    //after this use suspense in list page
}

export const profilePageLoader = async() => {
    const postPromise = apiRequest("/user/profilePosts")
    const chatPromise = apiRequest("/chat")
    return defer({
        postResponse: postPromise,
        chatResponse: chatPromise 
    })
}