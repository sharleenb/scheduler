import React, { useState, useEffect} from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList"
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";



export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {
      1: {
        id: 1,
        time: "12pm",
        interview: null,
      },
    },
    interviewers: {},
  });


  function bookInterview(id, interview) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    
    return axios.put(`api/appointments/${id}`, {interview})
    .then(() => {
      setState({
        ...state, 
        appointments
      })
      
    })
   
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment)
    .then(() => {
      setState({
        ...state, 
        appointments
      })
    })
  }

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const dailyInterviews = getInterviewersForDay(state, state.day);
  const setDay = day => setState({...state, day})


  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
      
    });
   
  }, [])

  const appointments = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment 
      key={appointment.id} 
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      interviews={dailyInterviews}
      bookInterview={(id, interview) => bookInterview(id, interview)}
      cancelInterview={(id) => cancelInterview(id)}
       />
    )
  }) 

  return (
    <main className="layout">
      <section className="sidebar">
      <img
      className="sidebar--centered"
      src="images/logo.png"
      alt="Interview Scheduler"
    />
    <hr className="sidebar__separator sidebar--centered" />
    <nav className="sidebar__menu">
      <DayList
    days={state.days}
    value={state.day}
    onChange={setDay}/>
    </nav>
    <img
      className="sidebar__lhl sidebar--centered"
      src="images/lhl.png"
      alt="Lighthouse Labs"
    />
      </section>
      <section className="schedule">
      {appointments}
      </section>
    </main>
  );
}
