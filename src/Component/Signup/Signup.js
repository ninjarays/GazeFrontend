import react,{useState} from "react"
import "./Signup.css"
import axios from "axios"


const Signup= ()=>{

    const [user,setUser] =useState({
        name:"",
        email:"",
        password:"",
        reEnterpassword:""
    })

    

    const handleChange= e =>{
        const {name,value}=e.target

        setUser({
            ...user,
            [name]:value
        })
        // console.log(name,value)
    }

    const signup=()=>{
        const {name,email,password,reEnterpassword}=user
        if(name&&email&&password&&(password===reEnterpassword)){
            axios.post("http://localhost:9002/signup")
            .then(res=>console.log(res)) 
        }
        else{
            alert("invalid input")
        }
       
    }

    return (
        
        <div className="Signup">
            <h1>Gaze Signup</h1>
            {console.log("User",user)}
            <input type="text" name="name" value={user.name}  placeholder="Name" onChange={handleChange}></input>
            <input type="text" name="email" value={user.email} placeholder="Email" onChange={handleChange}></input>
            <input type="password" name="password" value={user.password} placeholder="Password" onChange={handleChange}></input>
            <input type="password" name="reEnterpassword" value={user.reEnterpassword} placeholder="Re-enter-Password" onChange={handleChange}></input>
            <div className="button" onClick={signup}>Sign up</div>   
            <div>or</div> 
            <div className="button">Login</div>
        </div>
    )
}

export default Signup