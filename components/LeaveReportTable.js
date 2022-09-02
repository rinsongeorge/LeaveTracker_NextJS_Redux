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

class LeaveReportTablePage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var trs = [];
        if(this.props.leaves.length > 0){
            trs.push(
                this.props.leaves.map((item, index) => {
                    return(
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <Link href={`/UpdateAssociate?empid=${item.EMPID}`}>
                                    <a className="p-0 nav-link">{item.EMPID}</a>
                                </Link>
                            </td>
                            <td>{item.EMPNAME}</td>
                            <td>{item.LEAVE_NAME}</td>
                            <td>{new Date(item.LEAVE_DATE).toLocaleDateString()}</td>
                            <td>{item.REMARK}</td>
                            <td>{item.TEAM_NAME}</td>
                        </tr>
                    );
                })
            );
        }else{
            trs.push(
                <tr key="2">
                    <td colSpan="7" className="text-center">Nothing found..</td>
                </tr>
            );
        }

        return (
            <Form.Group as={Col} lg={12} md={12} sm={12} className="mt-5">
                <Table responsive striped bordered hover variant="">
                    <thead>
                        <tr>
                            <th>##</th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Leave Type</th>
                            <th>Leave Date</th>
                            <th>Reason</th>
                            <th>Team</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trs}
                    </tbody>
                </Table>
            </Form.Group>                               
        );
    }
}

const mapStateToProps = (state) => {
    return {
        leaves : state.pageReducer.leaves
    };
};
 
export default connect(mapStateToProps, null)(LeaveReportTablePage);
