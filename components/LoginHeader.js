import Link from 'next/link';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

const LoginHeader = () => (
    <Navbar className="fixed-top" collapseOnSelect expand="lg" variant="dark">
        <Navbar.Brand as="span"><Link href="/"><a className="navbar-brand">Leave Tracker</a></Link></Navbar.Brand>
    </Navbar>
);
  
export default LoginHeader;



  