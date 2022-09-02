import React from 'react';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import API from '../API';
import Router from 'next/router';
import {Container, Col, Row, Form , Card, Button, Table, Nav} from 'react-bootstrap'; 
import Link from 'next/link';
//import logger from '../Logger/WinstonLogger';

class DashboardPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            overlay : false,
            teams : [],
            teamDetails : [],
            attendenceCheck : {},
            selectAllCheck : false
        }
        this.handleTeamGoToCick = this.handleTeamGoToCick.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleIndividualCheck = this.handleIndividualCheck.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleUpdateButton = this.handleUpdateButton.bind(this);
    }

    async componentDidMount(){
        this.setState({['overlay']: true});
        try {
            const res = await API.get('/api/getTeams');
            //console.log(res.data);
            //logger.info(res.data);
            this.setState({['teams']: res.data});
        } catch (error) {
            console.log('error--> '+ error);
        }finally{
            this.setState({['overlay']: false});
        }
    }

    handleBackButton(e){
        this.setState(prevState => {
            prevState.teamDetails = [],
            prevState.attendenceCheck = {},
            prevState.selectAllCheck = false
            return prevState;
        });
    }

    async handleUpdateButton(e){
        //alert(JSON.stringify(this.state.attendenceCheck))
        this.setState({['overlay']: true});
        var dsmObj = [];
        for(let prop in this.state.attendenceCheck) {
            let obj = {};
            obj.assoId = prop;
            obj.isPresent = this.state.attendenceCheck[prop];
            obj.attendDate = new Date(new Date().toDateString()).getTime();
            dsmObj.push(obj);
        }
        try {
            const res = await API.post('/api/addDSMUpdate', dsmObj);
            console.log(res.data);
            alert('DSM updated');
            this.setState(prevState => {
                prevState.teamDetails = [],
                prevState.attendenceCheck = {},
                prevState.selectAllCheck = false
                return prevState;
            });
        } catch (error) {
            console.log('error--> '+ error);
        }finally{
            this.setState({['overlay']: false});
        }
    }

    handleSelectAll(e) {
        var isChecked = e.target.checked;
        this.setState(prevState => {
            for(let prop in prevState.attendenceCheck){
                prevState.attendenceCheck[prop] = isChecked;
            }
            return prevState;
        });
    }

    handleIndividualCheck(e) {
        let assoId = e.target.dataset.assoid;
        let isChecked = e.target.checked; 
        this.setState(prevState => {
            prevState.attendenceCheck[assoId] = isChecked;
            return prevState;
        });
    }
    
    async handleTeamGoToCick(e) {
        let teamId = e.target.dataset.elmid;
        this.setState({['overlay']: true});
        try {
            const res = await API.get('/api/getTeam/' + teamId);
            console.log(res.data);
            var attendenceCheck = {};
            res.data.map(x => attendenceCheck[x.ASSO_ID] = false);
            
            this.setState(prevState => {
                prevState.teamDetails = res.data;
                prevState.attendenceCheck = attendenceCheck;
                return prevState;
            });
        } catch (error) {
            console.log('error--> '+ error);
        }finally{
            this.setState({['overlay']: false});
        }
    }

    render() {
        var teamCards = [];
        if(this.state.teams.length > 0) {
            teamCards.push(
                this.state.teams.map((team, index) => {
                    return(
                        <Col key={index} lg={4} md={6} sm={12} className="mt-3">
                            <Card className="shadow rounded-0">
                                <Card.Header className="card-header rounded-0" >{team.NAME}</Card.Header>
                                <Card.Body className="text-center">
                                    <p>{team.DESC}</p>
                                    <Nav.Link data-elmid={team.ID} onClick={this.handleTeamGoToCick}>
                                        Members (Update DSM)
                                    </Nav.Link>
                                    <Link href="/ManageLeaves/[teamid]" as={`/ManageLeaves/${team.ID}`}>
                                        <a className="p-0 nav-link">Manage Leaves</a>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })
            );
        }

        var teamDetailsDiv = [];
        if(this.state.teamDetails.length > 0){
            teamDetailsDiv.push(
                <Col key={this.state.teamDetails.length} lg={12} md={12} sm={12} className="mt-3">
                    <Row>
                        <Col>
                            <Nav.Link onClick={this.handleBackButton} className="float-left" >Back</Nav.Link>
                            <Nav.Link onClick={this.handleUpdateButton} className="float-right">Update</Nav.Link>
                        </Col>
                    </Row>
                    <Card className="shadow rounded-0">
                        <Card.Header className="card-header rounded-0" >
                            {this.state.teamDetails[0].TEAM_NAME}
                        </Card.Header>
                        <Card.Body>
                            <Table responsive striped bordered hover variant="">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>SIA Email</th>
                                        <th className="text-center">
                                            <Form.Check  onChange={this.handleSelectAll} type="checkbox" label="Select all" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.teamDetails.map((team, index) => {
                                            return(
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Link href={`/UpdateAssociate?empid=${team.EMPID}`}>
                                                            <a className="p-0 nav-link">{team.EMPID}</a>
                                                        </Link>
                                                    </td>
                                                    <td>{team.ASSO_NAME}</td>
                                                    <td>{team.SIA_EMAIL}</td>
                                                    <td className="text-center">
                                                        <Form.Check checked={this.state.attendenceCheck[team.ASSO_ID]} data-assoid={team.ASSO_ID} onChange={this.handleIndividualCheck} type="checkbox" label="Attended DSM" />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </Table>
                    	</Card.Body>
                    </Card>
                </Col>

            );
        }

        var reportVisibilty = this.state.teamDetails.length > 0 ? 'd-none' : '';
        var pos = this.state.teamDetails.length > 0 ? 'mt-5 p-5' : '';
        return (   
            <Layout>
                <Container>
                    <Row id="report-row" className={`p-5 ${reportVisibilty}`}> 
                        <Col lg={6} md={6} sm={12} className="m-auto">
                            <Card className="shadow rounded-0">
                                <Card.Header className="card-header rounded-0" >Reports</Card.Header>
                                <Card.Body className="text-center">
                                    <Link href="/LeaveReport">
                                        <a className="nav-link">Leave Report</a>
                                    </Link>
                                    <Link href="/DSMReport">
                                        <a className="nav-link">DSM Report</a>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className={pos}>
                        {this.state.teamDetails.length > 0 ? teamDetailsDiv : teamCards}
                    </Row>
                </Container>
                <Spinner show={this.state.overlay}/>
            </Layout>
        );
    }
}

export default  DashboardPage;