import React from 'react';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import API from '../API';
import Router from 'next/router';

import {Container, Col, Row, Form , Card, Button, Table} from 'react-bootstrap'; 
import { MdDeleteForever } from "react-icons/md";

class AddBandPage extends React.Component {

    // static async getInitialProps(ctx) { 
    //     try {
    //         const res = await API.get('http://localhost:3000/api/getBands');
    //         console.log(res.data);
    //         return ({ bands : res.data});
    //     } catch (error) {
    //         console.log('error--> '+ error);
    //     }
    //     return ({ bands : []});
    // }

    constructor(props) {
        super(props);
        this.state = {
            bands : [],
            formData : {
                bandName : "",
                bandDesc : ""
            },
            overlay : false
        }
        this.baseState = this.state;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSumbitClick = this.handleSumbitClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.getBands = this.getBands.bind(this);
    }

    async getBands() {
        try {
            const res = await API.get('http://localhost:3000/api/getBands');
            console.log(res.data);
            this.setState({['bands']: res.data});
        } catch (error) {
            console.log('error--> '+ error);
        }
    }

    async componentDidMount() {
        try {
            this.getBands();
         } catch (error) {
             console.log('error--> '+ error);
         }
    }


    async handleSumbitClick() {
        this.setState({['overlay']: true});
        const bandDetails = this.state.formData;
        console.log(bandDetails);
        try {
            const res = await API.post('http://localhost:3000/api/addBand', bandDetails);
            console.log(res.data);
            this.setState({
                formData : {
                    bandName : "",
                    bandDesc : ""
                },
                overlay : false
            });
            this.getBands();
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
            const res = await API.post('http://localhost:3000/api/deleteBand', {bandId : id});
            console.log(res.data);

            this.setState({
                formData : {
                    bandName : "",
                    bandDesc : ""
                },
                overlay : false
            });

            //Router.push('/Add-Band');
            this.getBands();
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
                                <Card.Header className="card-header rounded-0" >Add Band Details</Card.Header>
                                <Card.Body>
                                    {/* <Card.Title>Please fill the following..</Card.Title> */}
                                    <Form className="mt-3">
                                        <Form.Row>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label>Band Name</label> 
                                                <Form.Control name="bandName" value={this.state.formData.bandName} onChange={this.handleInputChange} className="rounded-0 h42" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                    <label >Band Description</label> 
                                                    <Form.Control name="bandDesc" value={this.state.formData.bandDesc} onChange={this.handleInputChange} className="rounded-0 h42" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <Button onClick={this.handleSumbitClick} className="rounded-0" variant="primary">Save Band</Button>
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
                                                    this.state.bands.map((item, index) => {
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


export default  AddBandPage;