import Link from 'next/link';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import API from '../API';
import Router from 'next/router';
import {connect} from 'react-redux';

async function handleLogoutClick(){
    try {
        const res = await API.post('/api/logout');
        console.log(res.data);
        window.location.href = "/";
    } catch (error) {
        console.log('error--> '+ error);
    }
}

const Header = (props) => (
    <Navbar className="fixed-top" collapseOnSelect expand="lg" variant="dark">
        <Navbar.Brand as="span"><Link href="/"><a className="navbar-brand">Leave Tracker</a></Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                {/* <Nav.Link as="span"><Link href="/"><a className="nav-link">Login</a></Link></Nav.Link> */}
                <Nav.Link as="span"><Link href="/Dashboard"><a className="nav-link">Dashboard</a></Link></Nav.Link>
                <Nav.Link as="span"><Link href="/Update-Leave"><a className="nav-link">Update Leave</a></Link></Nav.Link>
                <Nav.Link as="span"><Link href="/Add-Member"><a className="nav-link">Add Member</a></Link></Nav.Link>
                <Nav.Link as="span"><Link href="/Add-Team"><a className="nav-link">Add Team</a></Link></Nav.Link>
                <Nav.Link as="span"><Link href="/Add-Band"><a className="nav-link">Add Band</a></Link></Nav.Link>
                <Nav.Link as="span"><Link href="/Add-Grade"><a className="nav-link">Add Grade</a></Link></Nav.Link>
                <Nav.Link as="span"><Link href="/Add-Role"><a className="nav-link">Add Role</a></Link></Nav.Link>
                {props.leaves && props.leaves.length > 0 ? <Nav.Link as="span"><Link href="/Add-Role"><a className="nav-link">Test Redux</a></Link></Nav.Link> : ''}
            </Nav>
            <Nav>
                <Nav.Link onClick={handleLogoutClick}>Logout</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

const mapStateToProps = (state) => {
    return {
        leaves : state.pageReducer.leaves
    };
};
 
export default connect(mapStateToProps, null)(Header);
  