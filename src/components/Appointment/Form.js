import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";


export default function Form(props) {
  
  const [student, setStudent] = useState(props.student || "")
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");
  
  const validate = function() {
    if (student === "") {
      setError("Student name cannot be blank");
      return;
    }
    
    if (interviewer === null) {
      setError("Please select an interviewer");
      return;
    }
    props.onSave(student, interviewer);
  }
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form
          onSubmit={(event) => event.preventDefault()}
          autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            value={props.student}
            placeholder="Enter Student Name"
            onChange={(event) => setStudent(event.target.value)}
            data-testid="student-name-input"
            />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={props.onCancel} danger >Cancel</Button>
          <Button onClick={() => validate()} confirm >Save</Button>
        </section>
      </section>
    </main>
  )
}