import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import axios from '../../config/axios';
import { useSelector } from 'react-redux';

function SelectStore({closeForm, selectStore}) {
    const user = useSelector((state) => state.user.userInfo.access_token);
    const [state, setState] = useState({status:"loading", error:null, ids:[]})

    useEffect(() => {
      getAsyncStoreIds();
    },[])

    const getAsyncStoreIds = async () => {
      await axios.get(`/api/pos/get_store_ids`, {
          headers:{"Authorization":`Bearer ${user}`},
      }).then((response) => {
        setState({status:"success", error:null, ids:response.data})
      }).catch((err) => {
        setState({status:"error", error:err.response.data.message, ids:[]})
      })
  };
    const handleChange = (storeId) => {
        selectStore(storeId);
        closeForm(false);
    }

    return (
    <Container>
      {
      state.status === "loading" ? <Spinner/>
      :
      state.status === "error" ? <h4>{state.error ?? ""}</h4>
      :
      <Row>
        {state.ids?.map((item, index) => (
          <Col key={index} sm={6} md={4} lg={3}>
            <Card onClick={() => {handleChange(item.storeId)}}>
              <Card.Title>{item.storeId}</Card.Title>
              <Card.Body>Location: {item.storeLocation}</Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      }
    </Container>
    );
}

export default SelectStore;