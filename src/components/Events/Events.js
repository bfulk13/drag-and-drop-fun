import React, { Component } from 'react'
import axios from 'axios'

import './Events.css'

class Events extends Component {
  constructor(){
    super()
    this.state = {
      events: [],
      startElementId: null,
      nextElementId: null
    }
    this.buildEventJSX = this.buildEventJSX.bind(this)
  }

  componentDidMount(){
    this.getEvents()
  }
  
  getEvents = () => {
    axios.get('/api/getEvents').then((res)=>{
      this.setState({
        events: res.data.events
      })
    })
  }

  recordDragStartEvent = (id) => {
    this.setState({startElementId: id})
  }

  recordDragOverEvent = (id) => {
    if(id === this.state.startElementId){
      return
    }
    this.setState({nextElementId: id}, () => {
      let {startElementId, nextElementId} = this.state
      axios.put('/api/swapEventPosition', {startElementId, nextElementId}).then((res) => {
        this.setState({
          events: res.data.events
        })
      })
    })
  }

  searchForEvent = (e) => {
    if(e.target.value === ""){
      this.getEvents()
      return
    }
    axios.get(`/api/searchForEvent?search=${e.target.value}`).then((res) => {
      this.setState({events:res.data})
    })
  }

  lookAtE = (e) => {
    console.log(Object.assign({}, e))
  }

  buildEventJSX(event){
    return(
      <div 
        onClick={this.lookAtE}
        draggable="true" 
        onDragStart={() => this.recordDragStartEvent(event.id)} 
        onDragOver={() => this.recordDragOverEvent(event.id)}
        className="events_event-wrapper"
      >
        <p>{event.name}</p>
      </div>
    )
  }

  render(){
    let events = this.state.events.map(this.buildEventJSX)
    return(
      <div>
        <input onKeyDown={this.lookAtE}/>
        {events}
      </div>
    )
  }
}

export default Events