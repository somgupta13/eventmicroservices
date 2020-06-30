import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Col,Form,Modal,Row} from 'react-bootstrap';
import Button from 'react-bootstrap-button-loader';

import DateTimePicker from 'react-datetime-picker';

import {updateevent,deleteevent} from './actions/action'

class UpdateEvent extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            updateModelShow:false,
            prev_start_time : this.props.event.duration.start_time,
            prev_end_time   : this.props.event.duration.end_time,
            event:{
                id : this.props.event.id,
                cogid:this.props.event.cogid,
                title : this.props.event.title,
                description: this.props.event.description,
                duration:{
                    start_time :new Date(),
                    end_time   : new Date()
                }
            },
        }
    }
    //opens a modal
    handleShow(){
        this.setState({updateModelShow:true})
    }
    //close a modal
    handleClose(){
        this.setState({updateModelShow:false})
    }

    //on change event title
    onChangeTitle(title = ""){
        this.setState(prevState => ({event : {
                ...prevState.event,
                title : title
            }
        }))
    }

    //on change duration
    onChangeDescription(description= ""){
        this.setState(prevState => ({event : { 
                ...prevState.event,
                description: description
            }
        }))
    }

    //on change start time
    onChangeStartTime(date){
        this.setState(prevState => ({event : {
                ...prevState.event,
                duration : {
                    ...prevState.event.duration,
                    start_time : date
                }
            }
        }))
    }

    //on change end time
    onChangeEndTime(date){
        this.setState(prevState => ({event : {
                ...prevState.event,
                duration : {
                    ...prevState.event.duration,
                    end_time : date
                }
            }
        }))
    }

    //on updating event
    async onEventUpdate(){
        this.setState({loading:true});
        await updateevent(this.state.event)
        this.props.onUpdateEvent(this.state.event)
        this.onChangeTitle();
        this.onChangeDescription();
        this.onChangeStartTime(new Date());
        this.onChangeEndTime(new Date());
        this.handleClose();
        this.setState({loading:false});
    }
    //on deleting
    async onEventDelete(){
        this.setState({loading:true});
        await deleteevent(this.state.event)
        this.props.onDeleteEvent(this.state.event)
        this.onChangeTitle();
        this.onChangeDescription();
        this.onChangeStartTime(new Date());
        this.onChangeEndTime(new Date());
        this.handleClose();
        this.setState({loading:false});
    }

    
    render(){
        const createModelShow = this.state.updateModelShow;
        const eventtitle       = this.state.event.title;
        const description    = this.state.event.description;
        const start_time      = this.state.event.duration.start_time;
        const end_time        = this.state.event.duration.end_time;
        const loading         = this.state.loading 
        return(
            <div>
                <Button variant = "primary" onClick = {() => this.handleShow()}>
                    Update
                </Button>
                <Modal show = {createModelShow} onHide = { () => this.handleClose() } size="lg" aria-labelledby="example-modal-sizes-title-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Update Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId = "formEventTitle">
                                <Form.Label>Event Title</Form.Label>
                                <Form.Control type = "text" placeholder = "Enter event" value = {eventtitle}  onChange = { (e) => this.onChangeTitle(e.target.value)}/>
                            </Form.Group>
                            <Form.Group controlId = "formEventDescription">
                                <Form.Label>Event Description</Form.Label>
                                <Form.Control type = "text" placeholder = "Event Description" value = {description} onChange = {(e) => this.onChangeDescription(e.target.value)} />
                            </Form.Group>
                            <Form.Group as={Row} controlId = "PreviousTime">
                                <Col lg={6}>
                                    <Form.Label>Previous Start Time </Form.Label>
                                    <Form.Control plaintext readOnly defaultValue={this.state.prev_start_time}></Form.Control>
                                </Col>
                                <Col lg={6}>
                                    <Form.Label>Previous End Time </Form.Label>
                                    <Form.Control plaintext readOnly defaultValue={this.state.prev_end_time}></Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group controlId = "StartTime">
                                <Form.Label>Start Time </Form.Label>
                                <Col lg = {2}></Col>
                                <DateTimePicker
                                onChange = { (date) => this.onChangeStartTime(date)}
                                value = {start_time}
                                />
                            </Form.Group>
                            <Form.Group controlId = "EndTime">
                                <Form.Label> End Time </Form.Label>
                                <Col lg = {2}></Col>
                                <DateTimePicker
                                onChange = {(date) => this.onChangeEndTime(date)}
                                value= {end_time}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant = "secondary" onClick = { () => this.handleClose()}>
                            Close
                        </Button>
                        <Button variant = "danger" loading={loading} onClick = { () =>
                            this.onEventDelete()
                            }>
                        Delete
                        </Button>
                        <Button variant = "primary" loading={loading} onClick = { () =>
                            this.onEventUpdate()
                            }>
                        Update
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default UpdateEvent