import React from 'react';
import API from '../API';
import {Container, Col, Row, Form , Card, Button, Table, Modal, Nav} from 'react-bootstrap'; 
import DatePicker from "react-datepicker";

class LeaveUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show : props.isVisible
        }
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
    }

    componentDidMount() {
        // this.setState(prevState => {
        //     prevState.showModal = this.props.isVisible;
        //     return prevState;
        // });
    }

    modalShow() {
        this.setState(prevState => {
            prevState.show = true;
            return prevState;
        });
    }

    modalHide() {
        this.setState(prevState => {
            prevState.show = false;
            return prevState;
        });
    }

    render() {
        return(
            <Modal 
                className="shadow rounded-0"
                aria-labelledby="contained-modal-title-vcenter"
                show={this.state.show} 
                onHide={this.modalHide} >

                    <Modal.Header closeButton>
                        <Modal.Title>Update Leave</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <p> {this.state.dsmModalinfo.NAME} ({this.state.dsmModalinfo.EMPID} | {this.state.dsmModalinfo.SIA_EMAIL})</p> */}
                        <Form>
                            <Form.Row className="pl-5">
                                {/* <Form.Check type="checkbox" onChange={this.updateDSMCheck} label="Attended DSM?" /> */}
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="rounded-0" onClick={this.modalHide}>
                            Close
                        </Button>
                        <Button variant="primary" className="rounded-0">
                            Save Changes
                        </Button>
                    </Modal.Footer>
            </Modal>
        );    
    }
}

export default LeaveUpdateModal;



  