import { Col, Container, Row } from 'react-bootstrap';
import '../css/theme.css';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center mt-5'>
        <Col xs={12} md={6} className='border-0 shadow-main card p-5'>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;