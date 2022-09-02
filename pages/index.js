import React from 'react';
import Layout from '../components/login-layout';
import Spinner from '../components/loading-spinner';
import Router from 'next/router';
import API from '../API';
import {Container, Col, Row, Form , Card, Button, Table, Nav} from 'react-bootstrap'; 
// import Validator from '../Utils/Validator';

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           loginForm : {
            username : "",
            password : ""
           },
           overlay : false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSumbitClick = this.handleSumbitClick.bind(this);
    }

    handleInputChange(e) {
        var param = e.target.name;
        var val = e.target.value;
        this.setState(prevState => {
            prevState.loginForm[param] = val;
            return prevState;
        });
    }
    async handleSumbitClick(e) {
        this.setState({['overlay']: true});
        let loginForm = this.state.loginForm;
        try {
            const res = await API.post('/api/login', loginForm);
            console.log(res.data);
            if(res.data.jwt == "true"){
                Router.push('/Dashboard');
            }else{
                alert(res.data.jwt);
            }
        } catch (error) {
            if(error.response.data && error.response.data.msg) 
                alert(error.response.data.msg);

            this.setState({['overlay']: false});
        }
    }
    
    async componentDidMount(){
        
    }

    render() {
        return (
            <Layout>
                <Container>
                    <Row className="m-top-12 p-2">
                    <Col lg={5} md={8} className="m-auto">
                            <Card className="shadow rounded-0">
                                <Card.Header className="card-header rounded-0" >Log-In</Card.Header>
                                <Card.Body>
                                    <Form className="mt-3">
                                        <Form.Row>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <label>User Name</label> 
                                                <Form.Control name="username" onChange={this.handleInputChange} className="rounded-0 h42" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                    <label>Password</label> 
                                                    <Form.Control type="password" name="password" onChange={this.handleInputChange} className="rounded-0 h42" />
                                            </Form.Group>
                                            <Form.Group as={Col} lg={12} md={12} sm={12}>
                                                <Button onClick={this.handleSumbitClick} className="rounded-0 h42 px-4" variant="primary">Log-In</Button>
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

export default  IndexPage;