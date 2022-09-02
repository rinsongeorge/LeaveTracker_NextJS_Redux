import React from 'react';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import API from '../API';
import Router from 'next/router';

import {Container, Col, Row, Form , Card, Button, Table} from 'react-bootstrap'; 
import { MdDeleteForever } from "react-icons/md";

class AddGradePage extends React.Component {

    // static async getInitialProps(ctx) { 
    //     try {
    //         const res = await API.get('/api/getGrades');
    //         console.log(res.data);
    //         return ({ grades : res.data});
    //     } catch (error) {
    //         console.log('error--> '+ error);
    //     }
    //     return ({ grades : []});
    // }

    constructor(props) {
        super(props);
        this.state = {
            grades : [],
            formData : {
                gradeName : "",
                gradeDesc : ""
            },
            overlay : false
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSumbitClick = this.handleSumbitClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.getGrades = this.getGrades.bind(this);
    }

    async getGrades() {
        try {
            const res = await API.get('/api/getGrades');
            console.log(res.data);
            this.setState({['grades']: res.data});
        } catch (error) {
            console.log('error--> '+ error);
        }
    }

    componentDidMount() {
        this.getGrades();
    }

    async handleSumbitClick() {
        this.setState({['overlay']: true});
        const gradeDetails = this.state.formData;
        console.log(gradeDetails);
        try {
            const res = await API.post('/api/addGrade', gradeDetails);
            console.log(res.data);
            this.setState({
                formData : {
                    gradeName : "",
                    gradeDesc : ""
                },
                overlay : false
            });
            this.getGrades();
        } catch (error) {
            if(error.response.data && error.response.data.msg) 
                alert(error.response.data.msg);
        }finally{
            this.setState({['overlay']: false});
        }
    }

    async handleDeleteClick(e) {
        let id = e.target.dataset.elmid;
        console.log(id);
        try {
            const res = await API.post('/api/deleteGrade', {gradeId : id});
            console.log(res.data);

            this.setState({
                formData : {
                    gradeName : "",
                    gradeDesc : ""
                },
                overlay : false
            });

            //Router.push('/Add-Grade');
            this.getGrades();
        } catch (error) {
            console.log('error--> ' + error);
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

    render() {
        return (
            <Layout>
                <Container>
                    <Row className="m-top-12 p-2">
                        <Col  lg={12} md={12}>
                            <Card className="shadow rounded-0">
                                <Card.Header className="card-header rounded-0" >Add Grade Details</Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>Please fill the following..</Card.Title> */}
                                    <Form className="mt-3">
                                        <Form.Row>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label>Grade Name</label> 
                                                <Form.Control name="gradeName" value={this.state.formData.gradeName} onChange={this.handleInputChange} className="rounded-0 h42" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                    <label >Grade Description</label> 
                                                    <Form.Control name="gradeDesc" value={this.state.formData.gradeDesc} onChange={this.handleInputChange} className="rounded-0 h42" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <Button onClick={this.handleSumbitClick} className="rounded-0" variant="primary">Save Grade</Button>
                                            </Form.Group>
                                        </Form.Row>
                                    </Form>
                                    <Row>
                                    <Col>
                                        <Table responsive striped bordered hover variant="">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Grade Name</th>
                                                    <th>Grade Description</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.grades.map((item, index) => {
                                                        return(
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.NAME}</td>
                                                                <td>{item.DESC}</td>
                                                                <td className="text-center">
                                                                    <Button data-elmid={item.ID} onClick={this.handleDeleteClick} 
                                                                        className="rounded-0" variant="light"> 
                                                                        <MdDeleteForever color="red"></MdDeleteForever>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
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


export default  AddGradePage;