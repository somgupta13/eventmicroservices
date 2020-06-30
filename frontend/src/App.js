import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab,Tabs,Navbar,Nav} from 'react-bootstrap';
import CreateEvent from './CreateEvent.js';
import DisplayEvents from './DisplayEvents';
import { Auth } from 'aws-amplify';
import {getevents} from './actions/action';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
        key:"createevent",
        events : [],
    }
  }

  componentWillMount(){
    this.getEvents();
  }
  
//fetch all events
  async getEvents(){
    var events=await getevents();
    this.setState({events:events})
    // console.log(this.state.events)
  }

  addEvent(newevent){
    var event=this.state.events;
    event.push(newevent)
    this.setState({events:event})

  }

  async signOut() {
    // console.log("logout");
    try {
      
        await Auth.signOut();
        window.location.replace(window.location.origin);
        
    } catch (error) {
        // console.log('error signing out: ', error);
    }
  }

  
  render(){
    return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="" variant="">
          <Navbar.Brand href="#home">BorderFree Task</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            <Nav>
              <Nav.Link eventKey={2} href="#memes" onClick={()=>{this.signOut()}}>
                Sign Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Tabs
        id="controlled-tab-example"
        activeKey={this.state.key}
        onSelect={(k) => this.setState({key:k})}
        >
            <Tab eventKey="allevents" title="All Events">
              <DisplayEvents events={this.state.events} onUpdateEvent={(event) => {this.getEvents()}} onDeleteEvent={(event)=>{this.getEvents()}}/>
            </Tab>
            <Tab eventKey="createevent" title="Create Event">
              <CreateEvent onChangeEvents={(event)=>{
                this.addEvent(event)
                // this.getEvents()
                }}/>
            </Tab>
            
        </Tabs>
    </div>
    );
  }

}
export default withAuthenticator(App)
// this.addEvent(event)