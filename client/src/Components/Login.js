import React ,{useState} from "react";
import cookie from "js-cookies"
import axios from "axios"
import { Button, Container, Form, Icon, Message } from 'semantic-ui-react'
import { Link } from "react-router-dom";

const INITIAL_USER = {
  Email: "",
  password: "",
};

const Login = () => {
  const [user, setUser] = useState(INITIAL_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevstate) => ({ ...prevstate, [name]: value }));
  };

  const handlelogin = (token) => {
    cookie.setItem("token", token);
    window.location.href = "/import";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const payload = { ...user };
      const res = await axios.post("http://localhost:4000/", payload);
      handlelogin(res.data);
     
    } catch (err) {
      alert("Please enter a valid account !!");
     
    }
  };
  return(
    <Container style={{marginTop:"10%",width:"60%",height:400}}>
    <Message
      attached
      color="blue"
      header='Welcome to our site!'
      content='Fill out the form below to sign-in to your account'
    />
    <Form className='attached fluid segment'>
      <Form.Group widths='equal'>
        <Form.Input
          fluid
          name="Email"
          label='Email'
          placeholder='example@gmail.com'
          type='Email'
          onChange={handleChange}
        />
        <Form.Input
          fluid
          name="password"
          label='Password'
          placeholder='password . . .'
          type='password'
          onChange={handleChange}
        />
      </Form.Group>
     
      <Button onClick={handleSubmit} color='blue'>Submit</Button>
    </Form>
    <Message attached='bottom' warning>
      <Icon name='help' />
      New user ?&nbsp;<Link to='/signup'>Sign-up</Link>&nbsp;instead.
    </Message>
  </Container>
  ) 
};

export default Login;
