import React from "react";
import { Container, Message } from 'semantic-ui-react'

const Error = () => {
  return (
    <Container style={{marginTop:"20%"}}>
      <Message warning>
        <Message.Header style={{textAlign:"center"}}>
        <h2>something goes wrong :(</h2>
        </Message.Header>
      </Message>
    </Container>
  );
};

export default Error;
