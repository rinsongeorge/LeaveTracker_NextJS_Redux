import React from 'react';
import API from '../../API';
import Layout from '../../components/MyLayout';
import Spinner from '../../components/loading-spinner';
import {Container, Col, Row, Form , Card, Button, Table, Nav, Modal} from 'react-bootstrap'; 
import DatePicker from "react-datepicker";
import Router from 'next/router';
import Link from 'next/link';
import LeaveUpdateModal from '../../components/LeaveUpdateModal';

class ManageLeavePage extends React.Component {
     
    static async getInitialProps({query}) { 
        return ({ teamid : query.teamid});
    }
    
    constructor(props) {
        super(props);
        this.state = {
            teamLeaveDetails : {},
            updateLeaveModalShow : false,
            overlay : false,
            leaveToBeupdated : {},
            leaveDeatails : {
                leaveId : "",
                leaveReason : "",
                leaveDate : "",
                leaveType : "",
                assocId : ""
            }
    }
        
        this.openLeaveUpdateModal = this.openLeaveUpdateModal.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.handleModalInputChange = this.handleModalInputChange.bind(this);
        this.handleLeaveDateChange = this.handleLeaveDateChange.bind(this);
        this.updateLeave = this.updateLeave.bind(this);
        this.deleteLeave = this.deleteLeave.bind(this);
    }

    async deleteLeave(e) {
        let leaveId = e.target.id;
        if(confirm('Are you sure want to delete this leave ?')) {
            this.setState({['overlay']: true});
            try {
                const res = await API.get('/api/deleteLeaveById/' + leaveId);
                console.log(res.data);
                this.populateAll(this.props.teamid);
            } catch (error) {
                console.log('error--> ');
            }finally{
                this.setState({['overlay']: false});
            }
        }
    }

    async updateLeave(e) {
        let updatedLeave = this.state.leaveDeatails;
        this.setState({['overlay']: true});
        try {
            const res = await API.post('/api/updateLeave', updatedLeave);
            console.log(res.data);
            this.modalHide();
            this.populateAll(this.props.teamid);
        } catch (error) {
            console.log('error--> ');
        }finally{
            this.setState({['overlay']: false});
        }
    }

    handleModalInputChange(e) {
        let name = e.target.name;
        let val = e.target.value;
        this.setState(prevState => {
            prevState.leaveDeatails[name] = val;
            return prevState;
        });
    }

    handleLeaveDateChange(date) {
        this.setState(prevState => {
            prevState.leaveDeatails['leaveDate'] = date;
            return prevState;
        });
    }

    openLeaveUpdateModal(e) {
        let leaveId = e.target.id;  
        let leaveDetail = this.state.teamLeaveDetails.leaves.filter(x => x.LEAVE_ID == leaveId);
        console.log('leaveDetail > ' + JSON.stringify(leaveDetail));
        this.setState(prevState => {
            prevState.leaveDeatails = {
                leaveId : leaveDetail[0].LEAVE_ID,
                leaveReason : leaveDetail[0].REMARK,
                leaveDate : leaveDetail[0].LEAVE_DATE,
                leaveType : leaveDetail[0].LEAVE_TYPE_ID,
                assocId : leaveDetail[0].ASSO_ID
            };
            prevState.leaveToBeupdated = leaveDetail[0];
            prevState.updateLeaveModalShow = true;
            return prevState;
        });
    }

    modalHide() {
        this.setState(prevState => {
            prevState.leaveToBeupdated = {};
            prevState.updateLeaveModalShow = false;
            prevState.leaveDeatails = {};
            return prevState;
        });
    }

    async populateAll(teamid) {
        try {
            const res = await API.get('/api/getTeamLeaveDetails/' + teamid);
            console.log(res.data);
            var teamLeaveDetails = {};
            if(res.data.length > 0) {
                teamLeaveDetails.teamName = res.data[0].TEAM_NAME;
                teamLeaveDetails.leaves = res.data;
            }
            this.setState(prevState => {
                return prevState.teamLeaveDetails = teamLeaveDetails;
            });
        } catch (error) {
            console.log('error--> ');
        }
    }
    
    async componentDidMount() {     
        await this.populateAll(this.props.teamid);
    }

    render() {

        var trs = [];
        if(Object.keys(this.state.teamLeaveDetails).length && this.state.teamLeaveDetails.leaves.length > 0){
            trs.push(
                this.state.teamLeaveDetails.leaves.map((item, index) => {
                    return(
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <Link href={`/UpdateAssociate?empid=${item.EMPID}`}>
                                    <a className="p-0 nav-link">{item.EMPID}</a>
                                </Link>
                            </td>
                            <td>{item.EMPNAME}</td>
                            <td>{item.LEAVE_NAME}</td>
                            <td>{new Date(item.LEAVE_DATE).toLocaleDateString()}</td>
                            <td>
                                <Nav.Link id={item.LEAVE_ID} onClick={this.openLeaveUpdateModal} className="p-0">Update</Nav.Link>
                            </td>
                            <td>
                                <Nav.Link id={item.LEAVE_ID} onClick={this.deleteLeave} className="p-0">Delete</Nav.Link>
                            </td>
                        </tr>
                    );
                })
            );
        }else{
            trs.push(
                <tr key="2"><td colSpan="7" className="text-center">Nothing found..</td></tr>
            );
        }

        return (
            <Layout>
                <Container>
                    <Row className="m-leaves p-0">
                        <Col lg={12} md={12} sm={12} className="mt-3 p-0">
                            <Card className="shadow rounded-0">
                                <Card.Header className="card-header rounded-0" >
                                    {this.state.teamLeaveDetails.teamName ? this.state.teamLeaveDetails.teamName : "No Team Leaves found"}
                                </Card.Header>
                                <Card.Body>
                                    {/* <Col lg={12} md={12} sm={12} className="pt-3"> */}
                                        <Table responsive striped bordered hover variant="">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Employee ID</th>
                                                    <th>Employee Name</th>
                                                    <th>Leave Type</th>
                                                    <th>Leave Date</th>
                                                    <th>Update</th>
                                                    <th>Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {trs}
                                            </tbody>
                                        </Table>
                                    {/* </Col> */}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <Spinner show={this.state.overlay}/>
                
                <Modal 
                    className="shadow rounded-0"
                    aria-labelledby="contained-modal-title-vcenter"
                    show={this.state.updateLeaveModalShow} 
                    onHide={this.modalHide} >

                        <Modal.Header closeButton>
                            <Modal.Title>Update Leave</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p> {this.state.leaveToBeupdated.EMPNAME} ({this.state.leaveToBeupdated.EMPID} | {this.state.leaveToBeupdated.TEAM_NAME})</p>
                            <Form>
                            <Form.Row>
                                <Form.Group as={Col} lg={12} md={12} sm={12}>
                                    <label >Leave Date</label>
                                    <DatePicker name="leaveDate" className="text-center rounded-0 h42" placeholder="Leave Date"
                                        showYearDropdown
                                        showMonthDropdown
                                        onChange={this.handleLeaveDateChange}
                                        selected={this.state.leaveDeatails.leaveDate}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} lg={12} md={12} sm={12}>
                                    <label >Leave type</label>
                                    <Form.Control value={this.state.leaveDeatails.leaveType} name="leaveType" onChange={this.handleModalInputChange} as="select" className="rounded-0 h42">
                                        <option value="DEFAULT" disabled>Choose Type</option>
                                        <option value="1">PLANNED</option>
                                        <option value="2">UNPLANNED</option>
                                        <option value="3">SICK</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} lg={12} md={12} sm={12}>
                                    <label >Leave reason</label>
                                    <Form.Control name="leaveReason" onChange={this.handleModalInputChange}  
                                        value={this.state.leaveDeatails.leaveReason} className="rounded-0 h42" placeholder="Reason"/>
                                </Form.Group>
                            </Form.Row>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" className="rounded-0" onClick={this.modalHide}>
                                Close
                            </Button>
                            <Button variant="primary" className="rounded-0" onClick={this.updateLeave}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                </Modal>
                
            </Layout>
        );
    }
}

export default ManageLeavePage;