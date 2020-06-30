import { API } from 'aws-amplify';
import {apiName,path} from '../constants/constant'
import { Auth } from 'aws-amplify';

export var addevent = async(event) => {
    var cognitoid='';
    await Auth.currentUserInfo().then(response=>{cognitoid=response.id});
    const myinit={
        body: ({ 
            cogid : cognitoid,
            title: event.title, 
            description : event.description,
            status:'Active',
            duration:{
                start_time : event.duration.start_time,
                end_time : event.duration.end_time,
            },
        })
    }
    return await API.post(apiName,path, myinit)
}

export var updateevent = async(event) => {
    const myinit={
        body: ({ 
            id : event.id,
            cogid : event.cogid,
            title: event.title, 
            description : event.description,
            status:'Active',
            duration:{
                start_time : event.duration.start_time,
                end_time : event.duration.end_time,
            },
        })
    }
    
    await API.patch(apiName,path, myinit)
}

export var deleteevent = async(event) => {
    const myinit={
        body: ({ 
            id : event.id,
        })
    }
    await API.del(apiName,path, myinit)
}

export var getevents = async(event) => {
    var cognitoid='';
    await Auth.currentUserInfo().then(response=>{cognitoid=response.id});
    var events;
      await  API.get(apiName,path, {
            queryStringParameters: {  // OPTIONAL
            cogid: cognitoid,
        },
      }).then(response =>{events=response.response_list;})
    //   console.log(events);
    return events;
}
