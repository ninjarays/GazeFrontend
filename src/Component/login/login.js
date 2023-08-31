import react,{useState} from "react"
import "./login.css"

const Login= ()=>{

    const [user,setUser] =useState({
      
        email:"",
        password:"",
        
    })

    const handleChange= e =>{
        const {name,value}=e.target

        setUser({
            ...user,
            [name]:value
        })
        
        // console.log(name,value)
    }

    return (
        
        <div className="login">
            <h1>Gaze Login</h1>
            {console.log("User",user)}
            <input type="text" name="email" value={user.email} placeholder="Email" onChange={handleChange}></input>
            <input type="password" name="password" value={user.password} placeholder="Password" onChange={handleChange}></input>
            <div className="button">Login</div>    
        </div>
    )
}

export default Login