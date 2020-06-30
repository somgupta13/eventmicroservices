import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Col,Form,Container,Row} from 'react-bootstrap';
import Button from 'react-bootstrap-button-loader';
import DateTimePicker from 'react-datetime-picker';
import {addevent} from './actions/action'

class CreateEvent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            event:{
                title : '',
                description : '',
                duration:{
                    start_time : new Date(),
                    end_time   : new Date()
                }
            },
        }
    }
    //on change event title
    onChangeTitle(title = ""){
        this.setState(prevState => ({event : {
                ...prevState.event,
                title : title
            }
        }))
    }

    //on change description
    onChangeDescription(description = ""){
        this.setState(prevState => ({event : { 
                ...prevState.event,
                description : description
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

    //on Inserting Event
    async onEventSubmit(){
        this.setState({loading:true})
        var createdevent=await addevent(this.state.event)
        // console.log(createdevent);
        this.props.onChangeEvents(createdevent)
        this.onChangeTitle();
        this.onChangeDescription();
        this.onChangeStartTime(new Date());
        this.onChangeEndTime(new Date());
        this.setState({loading:false})
    }

    
    render(){
        const eventtitle       = this.state.event.title;
        const description     = this.state.event.description;
        const start_time      = this.state.event.duration.start_time;
        const end_time        = this.state.event.duration.end_time;
        const loading         = this.state.loading 
        return(
            <div>
                <br />
                <Container>
                    <Row>
                        <Col xs={3} lg={3}></Col>
                        <Col xs={6} lg={6}>
                            <Form>
                                <Form.Group controlId = "formEventTitle">
                                    <Form.Label>Event Title</Form.Label>
                                    <Form.Control type = "text" placeholder = "Enter event" value = {eventtitle}  onChange = { (e) => this.onChangeTitle(e.target.value)}/>
                                </Form.Group>
                                <Form.Group controlId = "formEventDescription">
                                    <Form.Label>Event Description</Form.Label>
                                    <Form.Control type = "text" placeholder = "Event Description" value = {description} onChange = {(e) => this.onChangeDescription(e.target.value)} />
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
                                <Button block variant = "success" loading={loading} onClick = { () =>
                                    this.onEventSubmit()
                                    }>
                                Submit
                                </Button>
                            </Form> 
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default CreateEvent