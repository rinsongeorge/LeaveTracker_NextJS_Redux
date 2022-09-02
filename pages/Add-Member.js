import React from 'react';
import API from '../API';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import {Container, Col, Row, Form , Card, Button} from 'react-bootstrap'; 
import DatePicker from "react-datepicker";
import Router from 'next/router';

class AddMemberPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            grades : [],
            bands : [],
            teams : [],
            roles : [],
            formData : {
                empId : "",
                empName : "",
                dob : "",
                tcsEmail : "",
                siaEmail : "",
                phoneNumber : "",
                depBranch : "",
                empRole : "",
                seatNumber : "",
                empGrade : "",
                gradeFrom : "",
                empBand : "",
                bandFrom : "",
                empTeam : "",
                tcsJoiningDate : "",
                siaJoiningDate : "",
                empSkillSet : ""
            },
            overlay : false
    }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDOBChange = this.handleDOBChange.bind(this);
        this.handleSIAJoiningChange = this.handleSIAJoiningChange.bind(this);
        this.handleTCSJoiningChange = this.handleTCSJoiningChange.bind(this);
        this.handleSumbitClick = this.handleSumbitClick.bind(this);
        this.handleBandFromChange = this.handleBandFromChange.bind(this);
        this.handleGradeFromChange = this.handleGradeFromChange.bind(this);
        this.populateAll = this.populateAll.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    resetForm() {
        this.setState(prevState => {
            prevState.formData = {
                empId : "",
                empName : "",
                dob : "",
                tcsEmail : "",
                siaEmail : "",
                phoneNumber : "",
                depBranch : "",
                empRole : "",
                seatNumber : "",
                empGrade : "",
                gradeFrom : "",
                empBand : "",
                bandFrom : "",
                empTeam : "",
                tcsJoiningDate : "",
                siaJoiningDate : "",
                empSkillSet : ""
            }
            return prevState;
        });
    }

    async populateAll() {
        try {
            const res = await API.get('/api/populateAddMember');
            console.log(res.data);
            this.setState(prevState => {
                prevState.grades = res.data.grades;
                prevState.bands  = res.data.bands;
                prevState.teams  = res.data.teams;
                prevState.roles = res.data.roles;
                return prevState;
            });
        } catch (error) {
            console.log('error--> ');
        }
    }
    async componentDidMount() {     
        await this.populateAll();
    }
    async handleSumbitClick() {
        this.setState({['overlay']: true});
        const member = this.state.formData;
        console.log(member);
        try {
            const res = await API.post('/api/addMember', member);
            console.log(res.data);
            this.resetForm();
        } catch (error) {
            if(error.response.data && error.response.data.msg) 
                alert(error.response.data.msg);
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

    handleDOBChange(date) {
        this.setState(prevState => {
            prevState.formData['dob'] = date;
            return prevState;
        });
    }

    handleTCSJoiningChange(date) {
        //this.setState({['tcsJoiningDate']: date});
        this.setState(prevState => {
            prevState.formData['tcsJoiningDate'] = date;
            return prevState;
        });
    }

    handleSIAJoiningChange(date) {
        //this.setState({['siaJoiningDate']: date});
        this.setState(prevState => {
            prevState.formData['siaJoiningDate'] = date;
            return prevState;
        });
    }

    handleBandFromChange(date) {
        //this.setState({['bandFrom']: date});
        this.setState(prevState => {
            prevState.formData['bandFrom'] = date;
            return prevState;
        });
    }

    handleGradeFromChange(date) {
        //this.setState({['gradeFrom']: date});
        this.setState(prevState => {
            prevState.formData['gradeFrom'] = date;
            return prevState;
        });
    }

    render() {
        return (
            <Layout>
                <Container>
                    <Row className="m-top-12 p-2">
                        <Col  lg={12} md={12}>
                            <Card className="shadow rounded-0">
                                <Card.Header className="card-header rounded-0" >Add Member</Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>Please fill the following..</Card.Title> */}
                                    <Form className="mt-3">
                                        <Form.Row>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label>Employee Id</label> 
                                                <Form.Control value={this.state.formData.empId} name="empId" onChange={this.handleInputChange} className="rounded-0 h42" placeholder="Employee Id" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                    <label >Name</label> 
                                                    <Form.Control value={this.state.formData.empName} name="empName" onChange={this.handleInputChange} className="rounded-0 h42" placeholder="Employee name" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >Date of Birth</label> 
                                                <DatePicker name="dob" onChange={this.handleDOBChange} className="text-center rounded-0 h42" 
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    selected={this.state.formData.dob}/>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >TCS Email</label> 
                                                <Form.Control value={this.state.formData.tcsEmail} name="tcsEmail" onChange={this.handleInputChange} type="email" className="rounded-0 h42" placeholder="as@as.as" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >SIA Email</label> 
                                                <Form.Control value={this.state.formData.siaEmail} name="siaEmail" onChange={this.handleInputChange} type="email" className="rounded-0 h42" placeholder="as@as.as" />
                                            </Form.Group>  
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >Phone</label> 
                                                <Form.Control value={this.state.formData.phoneNumber} name="phoneNumber" onChange={this.handleInputChange} className="rounded-0 h42" placeholder="Phone" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                    <label >Branch</label> 
                                                    <Form.Control value={this.state.formData.depBranch} name="depBranch" onChange={this.handleInputChange} className="rounded-0 h42" placeholder="Singapore / Chennai / Kochi ..." />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >Role</label> 
                                                <Form.Control name="empRole" onChange={this.handleInputChange} as="select" defaultValue={'DEFAULT'} className="rounded-0 h42">
                                                    <option value="DEFAULT" disabled>Choose Role</option>
                                                    {
                                                        this.state.roles.map(item => {
                                                            return(
                                                                <option key={item.ID} value={item.ID}>{item.NAME}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >Seat No.</label> 
                                                <Form.Control value={this.state.formData.seatNumber} name="seatNumber" onChange={this.handleInputChange} className="rounded-0 h42" placeholder="Seat No." />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <Form.Row>
                                                    <Form.Group as={Col}>
                                                        <label >Grade</label> 
                                                        <Form.Control name="empGrade" onChange={this.handleInputChange} as="select" defaultValue={'DEFAULT'} className="rounded-0 h42">
                                                            <option value="DEFAULT" disabled>Choose Grade</option>
                                                            {
                                                                this.state.grades.map(item => {
                                                                    return(
                                                                        <option key={item.ID} value={item.ID}>{item.NAME}</option>
                                                                    );
                                                                })
                                                            }
                                                        </Form.Control>
                                                    </Form.Group>   
                                                    <Form.Group as={Col}>
                                                        <label >From</label> 
                                                        <DatePicker name="gradeFrom" onChange={this.handleGradeFromChange} className="text-center rounded-0 h42" 
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            selected={this.state.formData.gradeFrom}/>
                                                    </Form.Group>
                                                </Form.Row>
                                            </Form.Group>

                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <Form.Row>
                                                    <Form.Group as={Col} >
                                                        <label >Band</label> 
                                                        <Form.Control name="empBand" onChange={this.handleInputChange} as="select" defaultValue={'DEFAULT'} className="rounded-0 h42">
                                                            <option value="DEFAULT" disabled>Choose Band</option>
                                                            {
                                                                this.state.bands.map(item => {
                                                                    return(
                                                                        <option key={item.ID} value={item.ID}>{item.NAME}</option>
                                                                    );
                                                                })
                                                            }
                                                        </Form.Control>
                                                    </Form.Group>   
                                                    <Form.Group as={Col} >
                                                        <label >From</label> 
                                                        <DatePicker name="bandFrom" onChange={this.handleBandFromChange} className="text-center rounded-0 h42" 
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            selected={this.state.formData.bandFrom}/>
                                                    </Form.Group>
                                                </Form.Row>
                                            </Form.Group>

                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >Team</label> 
                                                <Form.Control name="empTeam" onChange={this.handleInputChange} as="select" defaultValue={'DEFAULT'} className="rounded-0 h42">
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
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >TCS Joining Date</label> 
                                                <DatePicker name="tcsJoiningDate" onChange={this.handleTCSJoiningChange} className="text-center rounded-0 h42" 
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    selected={this.state.formData.tcsJoiningDate}/>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >SIA Joining Date</label> 
                                                <DatePicker name="siaJoiningDate" onChange={this.handleSIAJoiningChange} className="text-center rounded-0 h42" 
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    selected={this.state.formData.siaJoiningDate}/>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label >Skill Set</label> 
                                                <Form.Control value={this.state.formData.empSkillSet} name="empSkillSet" onChange={this.handleInputChange} as="textarea" rows="3" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <Button onClick={this.handleSumbitClick} className="rounded-0" variant="primary">Save Member</Button>
                                            </Form.Group>
                                        </Form.Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <Spinner show={this.state.overlay}/>

            </Layout>
        );
    }
}

export default AddMemberPage;