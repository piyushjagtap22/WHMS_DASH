import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
    animation='border'
    role='status'
    style={{
      width: '100px',
      height: '100px',
      margin: 'auto',
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: '45%',
    }}
  ></Spinner>
  );
};

export default Loader;