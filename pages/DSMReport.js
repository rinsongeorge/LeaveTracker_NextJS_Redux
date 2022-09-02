import React from 'react';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import API from '../API';
import Router from 'next/router';
import {Container, Col, Row, Form , Card, Button, Table, ButtonGroup} from 'react-bootstrap'; 
import Link from 'next/link';
import DatePicker from "react-datepicker";
import { MdCheck, MdClose } from "react-icons/md";
import { MdFileDownload } from "react-icons/md";

class DSMReportPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchCriteria : {
                dsmDateFrom : new Date().setDate(1),
                dsmDateTo : new Date(),
                result : []
            },
            overlay : false
        }
        
        this.handleDSMDateFrom = this.handleDSMDateFrom.bind(this);
        this.handleDSMDateTo = this.handleDSMDateTo.bind(this);
        this.fetchDSM = this.fetchDSM.bind(this);
        this.fetchExcel = this.fetchExcel.bind(this);
    }

    async fetchExcel() {
        //this.setState({['overlay']: true});
        try {
            let dsmDateFrom = new Date(this.state.searchCriteria.dsmDateFrom).getTime();
            let dsmDateTo = new Date(this.state.searchCriteria.dsmDateTo).getTime();
            const response = await API.get(`/api/dsmReport/${dsmDateFrom}/${dsmDateTo}`, {responseType: 'arraybuffer'});
            const excelBlob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            let url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'DSMReport.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log('error--> ');
        } finally {
            //this.setState({['overlay']: false});
        }
    }

    async fetchDSM() {
        this.setState({['overlay']: true});
        try {
            let dsmDateFrom = new Date(this.state.searchCriteria.dsmDateFrom).getTime();
            let dsmDateTo = new Date(this.state.searchCriteria.dsmDateTo).getTime();
            const res = await API.get(`/api/getAllDSM/${dsmDateFrom}/${dsmDateTo}`);
            console.log(res.data);
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

    handleDSMDateFrom(date) {
        this.setState(prevState => {
            prevState.searchCriteria.dsmDateFrom = date;
            return prevState;
        });
    }

    handleDSMDateTo(date) {
        this.setState(prevState => {
            prevState.searchCriteria.dsmDateTo = date;
            return prevState;
        });
    }
    
    async componentDidMount(){
        
    }


    render() {

        var trs = [];
        if(this.state.searchCriteria.result.length > 0){
            trs.push(
                this.state.searchCriteria.result.map((item, index) => {
                    return(
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <Link href={`/UpdateAssociate?empid=${item.EMPID}`}>
                                    <a className="p-0 nav-link">{item.EMPID}</a>
                                </Link>
                            </td>
                            <td>{item.EMPNAME}</td>
                            <td>{new Date(item.DSM_DATE).toLocaleDateString()}</td>
                            <td className="alignCentre">{item.PRESENT? <MdCheck color="green"/> : <MdClose color="red"/>}</td>
                            <td>{item.TEAM_NAME}</td>
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
            <Layout>
                <Container>
                    <Row className="m-top-12 p-2">
                        <Col lg={12} md={12} sm={12} className="mt-3">
                            <Card className="shadow rounded-0 m-auto">
                                <Card.Header className="card-header rounded-0" >DSM Report</Card.Header>
                                <Card.Body className="text-center">
                                    <Form>
                                        <Form.Row>
                                            <Form.Group as={Col} lg={5} md={4} sm={12}>
                                                <DatePicker name="leaveDateFrom" className="text-center rounded-0 h42"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    onChange={this.handleDSMDateFrom}
                                                    selected={this.state.searchCriteria.dsmDateFrom}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={5} md={4} sm={12}>
                                                <DatePicker name="leaveDateTo" className="text-center rounded-0 h42"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    onChange={this.handleDSMDateTo}
                                                    selected={this.state.searchCriteria.dsmDateTo}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={2} md={4} sm={12}>
                                                <ButtonGroup>
                                                    <Button variant="primary" className="rounded-0 h42" onClick={this.fetchDSM} >
                                                        Report
                                                    </Button>
                                                    <Button variant="light" className="rounded-0 h42" onClick={this.fetchExcel} >
                                                        <MdFileDownload color="red"/>
                                                    </Button>
                                                </ButtonGroup>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12} className="mt-5">
                                                <Table responsive striped bordered hover variant="">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Employee ID</th>
                                                            <th>Employee Name</th>
                                                            <th>DSM Date</th>
                                                            <th>Attendance</th>
                                                            <th>Team</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {trs}
                                                    </tbody>
                                                </Table>
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

export default DSMReportPage;