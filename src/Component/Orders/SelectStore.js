import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

function SelectStore(props) {
    const items = props.storeIdList;

    const handleChange = (storeId) => {
        props.selectStore(storeId);
        props.closeForm(false);
    }

    return (
    <Container>
      <Row>
        {items.map((item, index) => (
          <Col key={index} sm={6} md={4} lg={3}>
            <Card onClick={() => {handleChange(item.storeId)}}>
              <Card.Body>
                <Card.Title>{item.storeId}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    );
}

export default SelectStore;