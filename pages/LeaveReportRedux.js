import React from 'react';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import API from '../API';
import Router from 'next/router';
import {Container, Col, Row, Form , Card, Button, Table, ButtonGroup} from 'react-bootstrap'; 
import Link from 'next/link';
import DatePicker from "react-datepicker";
import { MdFileDownload } from "react-icons/md";
import {connect} from 'react-redux';
import { addLeaves } from '../redux/actions/pageActions';
import LeaveReportTable from '../components/LeaveReportTable';

class LeaveReportPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchCriteria : {
                leaveDateFrom : new Date().setDate(1),
                leaveDateTo : new Date(),
                result : []
            },
            overlay : false
        }
        
        this.handleLeaveDateFrom = this.handleLeaveDateFrom.bind(this);
        this.handleLeaveDateTo = this.handleLeaveDateTo.bind(this);
        this.fetchLeaves = this.fetchLeaves.bind(this);
    }

    async fetchLeaves() {
        this.setState({['overlay']: true});
        try {
            let leaveDateFrom = new Date(this.state.searchCriteria.leaveDateFrom).getTime();
            let leaveDateTo = new Date(this.state.searchCriteria.leaveDateTo).getTime();
            const res = await API.get(`/api/getAllLeaves/${leaveDateFrom}/${leaveDateTo}`);
            console.log(res.data);
            this.props.addLeaves(res.data);
            if(res.data.length > 0) {
                this.setState(prevState => {
                    return prevState.searchCriteria.result = res.data;
                });
            }
        } catch (error) {
            console.log('error--> ');
        } finally {
            this.setState({['overlay']: false});
        }
    }

    handleLeaveDateFrom(date) {
        this.setState(prevState => {
            prevState.searchCriteria.leaveDateFrom = date;
            return prevState;
        });
    }

    handleLeaveDateTo(date) {
        this.setState(prevState => {
            prevState.searchCriteria.leaveDateTo = date;
            return prevState;
        });
    }
    
    async componentDidMount(){
        
    }


    render() {
        return (
            <Layout>
                <Container>
                    <Row className="m-top-12 p-2">
                        <Col lg={12} md={12} sm={12} className="mt-3">
                            <Card className="shadow rounded-0 m-auto">
                                <Card.Header className="card-header rounded-0" >Leave Report</Card.Header>
                                <Card.Body className="text-center">
                                    <Form>
                                        <Form.Row>
                                            <Form.Group as={Col} lg={5} md={4} sm={12}>
                                                <DatePicker name="leaveDateFrom" className="text-center rounded-0 h42"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    onChange={this.handleLeaveDateFrom}
                                                    selected={this.state.searchCriteria.leaveDateFrom}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={5} md={4} sm={12}>
                                                <DatePicker name="leaveDateTo" className="text-center rounded-0 h42"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    onChange={this.handleLeaveDateTo}
                                                    selected={this.state.searchCriteria.leaveDateTo}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={2} md={4} sm={12}>
                                                <ButtonGroup>
                                                    <Button variant="primary" className="rounded-0 h42" onClick={this.fetchLeaves} >
                                                        Report
                                                    </Button>
                                                </ButtonGroup>
                                                
                                            </Form.Group>

                                            <LeaveReportTable></LeaveReportTable>
                                            
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

// const mapStateToProps = (state) => {
//     return {
//         leaves : state.pageReducer.leaves
//     };
// };

 const mapDispatchToProps = (dispatch) => {
    return {
        addLeaves : (leaves) => dispatch(addLeaves(leaves))
    };
 };

export default connect(null, mapDispatchToProps)(LeaveReportPage);
