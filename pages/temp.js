import React from 'react';
import Layout from '../components/MyLayout';
import Spinner from '../components/loading-spinner';
import API from '../API';
import Router from 'next/router';
import {Container, Col, Row, Form , Card, Button, Table} from 'react-bootstrap'; 
import Chart from "react-google-charts";

class TempPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            overlay : false
        }

    }

    render() {
        const data = [
            ["Element", "Density", { role: "style" }, { role: "tooltip", type : "string"}],
            ["Copper", 100, "#00266b", "<b>sss</b>"], // RGB value
            ["Silver", 50, "#f99f1c", "fff"], // English color name
            ["Gold", 20, "#00266b", "fff"],
            ["Platinum1", 75, "#f99f1c", "fff"], // CSS-style declaration
            ["Copper1", 100, "#00266b", "fff"], // RGB value
            ["Silver1", 50, "#f99f1c", "fff"], // English color name
            ["Gold1", 20, "#00266b", "fff"],
            ["Platinum1", 75, "#f99f1c", "fff"] // CSS-style declaration
        ];

        const options= {
            title: 'Population of Largest U.S. Cities',
            hAxis: {
                title: "Total Population",
                minValue: 0,
                maxValue: 100
            },
            vAxis: {
                title: "City Hall",
            }
        };

        return (
            <Layout>
                <Container>
                    <Row className="m-top-12 p-2">
                        <Col  lg={12} md={12}>
                            <Card className="shadow rounded-0">
                                <Card.Header className="card-header rounded-0" >Add Band Details</Card.Header>
                                <Card.Body>
                                    <Chart
                                        className="ltChart"
                                        chartType="ColumnChart"
                                        width="100%"
                                        height="400px"
                                        data={data}
                                        options={options}
                                    />
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


export default  TempPage;