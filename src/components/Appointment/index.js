import React from "react";
import "components/Appointment/styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";


//mode constants
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING"
const CONFIRM = "CONFIRM"
const DELETING = "DELETING"
const EDIT = "EDIT"
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  function save(name, interviewer) {
    transition(SAVING)
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(()=> transition(ERROR_SAVE, true))
  }

  
  function deleteAppointment() {
    transition(DELETING,true);
    props
      .cancelInterview(props.id)
      .then(() => {transition(EMPTY)})
      .catch(() => transition(ERROR_DELETE,true))

  }
  
  function cancelconfirmation() {
    transition(CONFIRM)
  }

  function editAppointment() {
    transition(EDIT)
  }

  return (
    <article className="appointment">
      <Header
        time={props.time}
      />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === ERROR_DELETE && <Error message= {"Could not delete appointment"} onClose={() => transition(SHOW)}/>}
      {mode === ERROR_SAVE && <Error message= {"Could not save appointment"} onClose={() => back()}/>}

      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save} />}

      {mode === CONFIRM && <Confirm
        message={"Are you sure you would like to delete?"}
        onCancel={back}
        onConfirm={deleteAppointment}
      />}
      {mode === SHOW &&
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={cancelconfirmation}
          onEdit={editAppointment}
        />
      }

      {mode === EDIT && <Form
        student={props.interview.student}
        interviewer={props.interview.interviewer["id"]}
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
      />}
    </article>
  )

}