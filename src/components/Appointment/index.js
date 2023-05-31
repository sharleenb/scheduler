import React from 'react'

import "components/Appointment/styles.scss"
import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import useVisualMode from 'hooks/useVisualMode'
import Form from './Form'
import Status from './Status';
import Confirm from './Confirm'


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW)
    }) 
  }

  function deleteAppt(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(DELETING)
    props.cancelInterview(props.id, interview)
    .then(() => {
        transition(EMPTY)
    })
    } 

  

  return (
      <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
      <Show
      student={props.interview?.student}
      interviewer={props.interview?.interviewer}
      onConfirm={() => transition(CONFIRM)}
      />
      )}

      {mode === CONFIRM && <Confirm  
      message="Are you sure you want to delete?" 
      onCancel={() => transition(SHOW)} onDelete={deleteAppt}/>}

      {mode === DELETING && <Status message="Deleting" />}  
      {mode === SAVING && <Status message="Saving Appointment" />}  
      {mode === CREATE && (
      <Form interviewers={props.interviewers} 
            onCancel={() => back()} 
            onSave={save}/>)}
      
      </article>
  )
}
