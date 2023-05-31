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
    
    setState({
      ...state, 
      appointments
    })
   

    return axios.put(`http://localhost:8001/api/appointments/${id}`, {interview})
   
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    setState({
      ...state, 
      appointments
    })

    return axios.delete(`http://localhost:8001/api/appointments/${id}`, {interview})
  }

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const dailyInterviews = getInterviewersForDay(state, state.day);
  const setDay = day => setState({...state, day})


  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
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
      cancelInterview={(id, interview) => cancelInterview(id, interview)}
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
