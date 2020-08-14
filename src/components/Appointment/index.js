import React from "react";
import classnames from "classnames";
import Header from "components/Appointment/Header"
import Empty from "components/Appointment/Empty"
import Show from "components/Appointment/Show"
import useVisualMode from "hooks/useVisualMode"
import Form from "components/Appointment/Form"
import Confirm from "components/Appointment/Confirm"
import Error from "components/Appointment/Error"
import Status from "components/Appointment/Status"
import "components/Appointment/styles.scss";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIM";
const EDIT = "EDIT";
const DELETING = "DELETING";
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';


export default function Appointment(props) {
  
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
    .then (response => {transition(SHOW)})
    .catch(error => transition(ERROR_SAVE, true));

  }

  function deleteAppointment(event) {

    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then(response => {transition(EMPTY)})
    .catch(error => transition(ERROR_DELETE, true));
  } 

  return (
    
  <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && (
        <Empty
          onAdd={() => {
            return transition(CREATE);
          }}
        />
      )}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
      />
    )}
    {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save}/>
      )}
    {mode === SAVING && <Status message="SAVING" />}
    {mode === CONFIRM && (
      <Confirm
        onCancel={back}
        onConfirm={deleteAppointment}
        message={"Are you sure you would like to delete?"}
      />
    )}
    {mode === EDIT && (
        <Form name={props.interview.student} interviewer={props.interview.interviewer} interviewers={props.interviewers} onCancel={back} onSave={save}/>
    )}
    {mode === ERROR_DELETE && (
        <Error
          message="There was an error deleting your appointment"
          onClose={back}
        />
    )}
    {mode === ERROR_SAVE && (
        <Error
          message="There was an error saving your appointment"
          onClose={back}
        />
      )}
    </article>
  );
};