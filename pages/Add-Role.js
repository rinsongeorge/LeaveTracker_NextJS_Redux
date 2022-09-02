import React from 'react';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import API from '../API';
import Router from 'next/router';

import {Container, Col, Row, Form , Card, Button, Table} from 'react-bootstrap'; 
import { MdDeleteForever } from "react-icons/md";

class AddRolePage extends React.Component {

    // static async getInitialProps(ctx) { 
    //     try {
    //         const res = await API.get('/api/getRoles');
    //         console.log(res.data);
    //         return ({ roles : res.data});
    //     } catch (error) {
    //         console.log('error--> '+ error);
    //     }
    //     return ({ roles : []});
    // }

    constructor(props) {
        super(props);
        this.state = {
            roles : [],
            formData : {
                roleName : "",
                roleDesc : ""
            },
            overlay : false
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSumbitClick = this.handleSumbitClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.getRoles = this.getRoles.bind(this);
    }

    async getRoles() {
        try {
            const res = await API.get('/api/getRoles');
            console.log(res.data);
            this.setState({['roles']: res.data});
        } catch (error) {
            console.log('error--> '+ error);
        }
    }

    componentDidMount() {
        this.getRoles();
    }

    async handleSumbitClick() {
        this.setState({['overlay']: true});
        const roleDetails = this.state.formData;
        console.log(roleDetails);
        try {
            const res = await API.post('/api/addRole', roleDetails);
            console.log(res.data);
            this.setState({
                formData : {
                    roleName : "",
                    roleDesc : ""
                },
                overlay : false
            });
            this.getRoles();
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
            const res = await API.post('/api/deleteRole', {roleId : id});
            console.log(res.data);
            this.setState({
                formData : {
                    roleName : "",
                    roleDesc : ""
                },
                overlay : false
            });
            this.getRoles();
        } catch (error) {
            
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
                                <Card.Header className="card-header rounded-0" >Add Role Details</Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>Please fill the following..</Card.Title> */}
                                    <Form className="mt-3">
                                        <Form.Row>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label>Role Name</label> 
                                                <Form.Control name="roleName" value={this.state.formData.roleName} onChange={this.handleInputChange} className="rounded-0 h42" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                    <label >Role Description</label> 
                                                    <Form.Control name="roleDesc" value={this.state.formData.roleDesc} onChange={this.handleInputChange} className="rounded-0 h42" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <Button onClick={this.handleSumbitClick} className="rounded-0" variant="primary">Save Role</Button>
                                            </Form.Group>
                                        </Form.Row>
                                    </Form>
                                    <Row>
                                    <Col>
                                        <Table responsive striped bordered hover variant="">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Role Name</th>
                                                    <th>Role Description</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.roles.map((item, index) => {
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


export default  AddRolePage;