import React, { useState } from 'react';
import axios from "axios"
import { Button ,Input} from 'semantic-ui-react';
import {useNavigate} from "react-router-dom"
import cookies from 'js-cookies';
import Error from './Error';

const Import = () => {
    const history = useNavigate();
    const [Err, setErr] = useState(false);

    const handleSubmit=(e)=>{
        e.preventDefault()
        var formData = new FormData();
        const token=cookies.getItem("token");
        var file = document.querySelector("#file");
        const payload={headers:{Authorization:token}};
        formData.append("file", file.files[0]);
        axios.post("http://localhost:4000/import",formData,payload)
        .then(res=>{
            history("/home?page=1&size=5")
        })
        .catch(err=>{
          setErr(true)
        })
     }

    return (
        <>
        {
            (!Err)? <div style={{width:600,height:400,backgroundColor:"dodgerblue",
            marginLeft:"30%",marginTop:"10%",display:"flex",
            justifyContent:"center",alignItems:"center",
            borderRadius:"50px 0px",flexDirection:"column"
            }}>
                <form >
                <Input  type="file" name="file" id="file" style={{borderRadius:"25px"}} required />
                  </form>
                  <Button content="upload" onClick={handleSubmit} color="white" size="large" style={{marginTop:"3%",color:"dodgerblue"}} />
            </div>
            :
            <Error/>
        }
        </>
       
    );
}

export default Import;
