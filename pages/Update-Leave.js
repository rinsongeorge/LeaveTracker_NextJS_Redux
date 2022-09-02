import React from 'react';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import API from '../API';
import {Container, Col, Row, Form , Card, Button, Table, Modal, Nav} from 'react-bootstrap'; 
import DatePicker from "react-datepicker";
import Link from 'next/link';

class UpdateLeavePage extends React.Component {

    // static async getInitialProps(ctx) { 
    //     try {
    //         const res = await API.get('/api/getTeams');
    //         console.log(res.data);
    //         return ({ teams : res.data});
    //     } catch (error) {
    //         console.log('error--> '+ error);
    //     }
    //     return ({ teams : []});
    // }

    constructor(props) {
        super(props);
        this.state = {
            teams : [],
            searchResult : [],
            leaveToBeUpdated : {},
            leaveDeatails : {
                leaveReason : "",
                leaveDate : "",
                leaveType : ""
            },
            formData : {
                empId : "",
                empName : "",
                empTeam : 0
            },
            overlay : false,
            modalShow : false,
            dsmModalShow : false,
            dsmModalinfo : {},
            dsmCheck : false,
            dsmDate : new Date(new Date().toDateString()).getTime()
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSumbitClick = this.handleSumbitClick.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleModalHide = this.handleModalHide.bind(this);
        this.handleModalInputChange = this.handleModalInputChange.bind(this);
        this.handleLeaveDateChange = this.handleLeaveDateChange.bind(this);
        this.saveLeave = this.saveLeave.bind(this);

        this.handleDSMModalShow = this.handleDSMModalShow.bind(this);
        this.handleDSMModalHide = this.handleDSMModalHide.bind(this);
        this.updateDSM = this.updateDSM.bind(this);
        this.updateDSMCheck = this.updateDSMCheck.bind(this);
        this.handleDSMDateChange = this.handleDSMDateChange.bind(this);
        this.getTeams = this.getTeams.bind(this);
    }

    async getTeams() {
        try {
            const res = await API.get('/api/getTeams');
            console.log(res.data);
            this.setState({['teams']: res.data});
        } catch (error) {
            console.log('error--> '+ error);
        }
    }

    componentDidMount() {
        this.getTeams();
    }

    async updateDSM(e) {
        //alert(this.state.dsmCheck);
        this.setState({['overlay']: true});
        let dsmObj = [];
        let obj = {}; 
        obj.assoId = this.state.dsmModalinfo.ID;
        obj.isPresent = this.state.dsmCheck;
        obj.attendDate = new Date(this.state.dsmDate).getTime();
        dsmObj.push(obj);
        try {
            const res = await API.post('/api/addDSMUpdate', dsmObj);
            console.log(res.data);
            this.setState(prevState => {
                prevState.dsmModalShow = false;
                prevState.dsmDate = new Date(new Date().toDateString()).getTime();
                prevState.dsmCheck = false;
                prevState.dsmModalinfo = {};
                return prevState;
            });
        } catch (error) {
            console.log('error--> '+ error);
        }finally{
            this.setState({['overlay']: false});
        }
    }

    updateDSMCheck(e) {
        var check = e.target.checked;
        this.setState(prevState => {
            prevState.dsmCheck = check;
            return prevState;
        });
    }

    handleDSMDateChange(date) {
        this.setState(prevState => {
            prevState.dsmDate = date;
            return prevState;
        });
    }

    async handleDSMModalShow(e) {
        let id = e.target.dataset.elmid;
        var info = this.state.searchResult.filter(x => x.ID == parseInt(id));
        console.log(info);
        this.setState(prevState => {
            prevState.dsmModalShow = true;
            prevState.dsmModalinfo = info[0];
            return prevState;
        });
        
    }

    handleDSMModalHide(e) {
        this.setState(prevState => {
            prevState.dsmModalinfo = {};
            prevState.dsmModalShow = false;
            prevState.dsmCheck = false;
            prevState.dsmDate = new Date(new Date().toDateString()).getTime();
            return prevState;
        });
    }

    async handleModalShow(e) {
        let id = e.target.dataset.elmid;
        var info = this.state.searchResult.filter(x => x.ID == parseInt(id));
        console.log(info);
        try {
            //const res = await API.get('/api/getMember/' + id);
            //console.log(res.data);
            this.setState(prevState => {
                prevState.leaveToBeUpdated = info[0];
                prevState.modalShow = true;
                return prevState;
            });
        } catch (error) {
            console.log('error--> ');
        }
    }

    handleModalHide(e) {
        this.setState(prevState => {
            prevState.leaveToBeUpdated = {};
            prevState.leaveDeatails = {
                leaveReason : "",
                leaveDate : "",
                leaveType : ""
            };
            prevState.modalShow = false;
            return prevState;
        });
    }

    async handleSumbitClick() {
        this.setState({['overlay']: true});
        const criteria = this.state.formData;
        console.log(criteria);
        try {
            const res = await API.post('/api/searchMember', criteria);
            console.log(res.data);
            this.setState({['searchResult']: res.data});
        } catch (error) {
            console.log('error--> ');
        }finally{
            this.setState({['overlay']: false});
        }
    }

    handleInputChange(e) {
        e.persist();
        this.setState(prevState => {
            prevState.formData[e.target.name] = e.target.value;
            return prevState;
        });
    }

    handleModalInputChange(e) {
        e.persist();
        this.setState(prevState => {
            prevState.leaveDeatails[e.target.name] = e.target.value;
            return prevState;
        });
    }

    handleLeaveDateChange(date) {
        this.setState(prevState => {
            prevState.leaveDeatails['leaveDate'] = date;
            return prevState;
        });
    }
    async saveLeave(){
        const saveLeave = this.state.leaveDeatails;
        saveLeave.memberId = this.state.leaveToBeUpdated.ID;
        this.setState({['overlay']: true});
        try {
            const res = await API.post('/api/addLeave', saveLeave);
            console.log(res.data);
            this.setState({['modalShow']: false});
        } catch (error) {
            if(error.response.data && error.response.data.msg) 
                alert(error.response.data.msg);
        }finally{
            this.setState({['overlay']: false});
        }
    }
    render() {
        
        var trs = [];
        if(this.state.searchResult.length > 0){
            trs.push(
                this.state.searchResult.map((item, index) => {
                    return(
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <Link href={`/UpdateAssociate?empid=${item.EMPID}`}>
                                    <a className="p-0 nav-link">{item.EMPID}</a>
                                </Link>
                            </td>
                            <td>{item.NAME}</td>
                            <td>{item.SIA_EMAIL}</td>
                            <td>
                                <Nav.Link data-elmid={item.ID} className="p-0" onClick={this.handleModalShow}>Leave</Nav.Link>
                            </td>
                            <td>
                                <Nav.Link data-elmid={item.ID} className="p-0" onClick={this.handleDSMModalShow}>DSM</Nav.Link>
                            </td>
                        </tr>
                    );
                })
            );
        }else{
            trs.push(
                <tr key="2">
                    <td colSpan="6" className="text-center">Nothing found..</td>
                </tr>
            );
        }
        return (
        <>
            <Layout>
                <Container>
                    <Row className="m-top-12 p-2">
                        <Col  xl={12} lg={12} md={12}>
                            <Card className="shadow rounded-0">
                                <Card.Header className="card-header rounded-0" >Update Leaves</Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>Please fill the following..</Card.Title> */}
                                    <Form className="mt-3">
                                        <Form.Row>
                                            <Form.Group as={Col} lg={6} md={6} sm={12}>
                                                <Form.Control name="empId" value={this.state.formData.empId} 
                                                    onChange={this.handleInputChange} className="rounded-0 h42"
                                                    placeholder="Search by Employee Id" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={6} md={6} sm={12}>  
                                                <Form.Control name="empName" value={this.state.formData.empName} 
                                                    onChange={this.handleInputChange} className="rounded-0 h42" 
                                                    placeholder="or Search by Employee Name"/>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={6} md={6} sm={12}>  
                                                <Form.Control name="empTeam" onChange={this.handleInputChange} 
                                                    as="select" defaultValue={'DEFAULT'} className="rounded-0 h42">
                                                    <option value="DEFAULT" disabled>Choose Team</option>
                                                    {
                                                        this.state.teams.map(item => {
                                                            return(
                                                                <option key={item.ID} value={item.ID}>{item.NAME}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={6} md={6} sm={12}>  
                                                <Button onClick={this.handleSumbitClick} 
                                                    className="rounded-0 h42" variant="primary">Search Criteria</Button>
                                            </Form.Group>

                                            <Col lg={12} md={12} sm={12} className="pt-3">
                                                <Table responsive striped bordered hover variant="">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Employee ID</th>
                                                            <th>Employee Name</th>
                                                            <th>SIA Email</th>
                                                            <th>Update</th>
                                                            <th>Update</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {trs}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Form.Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <Spinner show={this.state.overlay}/>       

            </Layout>

            <Modal 
                className="shadow rounded-0"
                aria-labelledby="contained-modal-title-vcenter"
                show={this.state.modalShow} onHide={this.handleModalHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Leave</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p> {this.state.leaveToBeUpdated.NAME} ({this.state.leaveToBeUpdated.EMPID} | {this.state.leaveToBeUpdated.SIA_EMAIL})</p>
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} lg={12} md={12} sm={12}>
                                    <Form.Control name="leaveReason" onChange={this.handleModalInputChange}  className="rounded-0 h42" placeholder="Reason"/>
                                </Form.Group>
                                <Form.Group as={Col} lg={12} md={12} sm={12}>
                                    <DatePicker name="leaveDate" className="text-center rounded-0 h42" placeholder="Leave Date"
                                        showYearDropdown
                                        showMonthDropdown
                                        onChange={this.handleLeaveDateChange}
                                        selected={this.state.leaveDeatails.leaveDate}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} lg={12} md={12} sm={12}>
                                    <Form.Control name="leaveType" onChange={this.handleModalInputChange} as="select" defaultValue={'DEFAULT'} className="rounded-0 h42">
                                        <option value="DEFAULT" disabled>Choose Type</option>
                                        <option value="1">PLANNED</option>
                                        <option value="2">UNPLANNED</option>
                                        <option value="3">SICK</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="rounded-0" onClick={this.handleModalHide}>
                            Close
                        </Button>
                        <Button variant="primary" className="rounded-0" onClick={this.saveLeave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
            </Modal>   

            <Modal 
                className="shadow rounded-0"
                aria-labelledby="contained-modal-title-vcenter"
                show={this.state.dsmModalShow} onHide={this.handleDSMModalHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update DSM</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p> {this.state.dsmModalinfo.NAME} ({this.state.dsmModalinfo.EMPID} | {this.state.dsmModalinfo.SIA_EMAIL})</p>
                        <Form>
                            <Form.Row className="pl-5">
                                <Form.Group as={Col} lg={6} md={6} sm={12}>
                                    <DatePicker name="dsmDate" className="text-center rounded-0 h42" placeholder="Leave Date"
                                            showYearDropdown
                                            showMonthDropdown
                                            onChange={this.handleDSMDateChange}
                                            selected={this.state.dsmDate}
                                        />
                                </Form.Group>
                                <Form.Group as={Col} lg={6} md={6} sm={12}>
                                    <Form.Check type="checkbox" onChange={this.updateDSMCheck} label="Attended DSM?" />
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="rounded-0" onClick={this.handleDSMModalHide}>
                            Close
                        </Button>
                        <Button variant="primary" className="rounded-0" onClick={this.updateDSM}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
            </Modal>
        </>
        );
    }
}


export default  UpdateLeavePage;