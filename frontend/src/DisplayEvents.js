
import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Table,Col} from 'react-bootstrap';
import UpdateEvent from './UpdateEvent';


class DisplayEvents extends React.PureComponent{
  constructor(props){
    super(props);
    
    this.state={
      events:this.props.events
    }
  }



//Table Body
  renderTableData() {
    
    return this.state.events.map((event, index) => {
       const { title, duration ,description } = event //destructuring
       return (
          <tr key={index} >
             <td>{index+1}</td>
             <td>{title}</td>
             <td>{description}</td>
             <td>{duration.start_time}</td>
             <td>{duration.end_time}</td>
             
             <td><UpdateEvent event={event} 
             onUpdateEvent={(event)=>this.props.onUpdateEvent(event)} onDeleteEvent={(event)=>{this.props.onDeleteEvent(event)}}
                />
              </td>
          </tr>
       )
    })
  }

  //table Header
  renderTable(){
    // console.log(this.state.events)
    if(this.state.events.length>0){
      return (
        <Row>
          <Col lg={2}>
          </Col>
          <Col lg={12}>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event Title</th>
                  <th>Event Description</th>
                  <th>Start Time</th>
                  <th>Stop Time</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {this.renderTableData()}
              </tbody>
            </Table>
          </Col>
        </Row>
      )
    }
  }
 
  
  render(){
    this.setState({events:this.props.events})
    return (
      <div>
        
        <br/>
        <Container>
          {this.renderTable()}
        </Container>
      </div>
    
    );
  }

}
export default DisplayEvents