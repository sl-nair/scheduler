export function getAppointmentsForDay(state, day) {
  try {
  const selectedDay = state.days.find((stateDay) => stateDay.name === day)
  const appointments = selectedDay.appointments.map((appointmentID) => state.appointments[appointmentID])
  return appointments;  
  } catch(err) {
    return []
  }
}

export function getInterview(state, interview) {
  try{
    const resultInterview = {
      student: interview.student,
      interviewer: {...state.interviewers[interview.interviewer]}
    }

    return resultInterview
  } catch(err){
    return null
  }
};

export function getInterviewersForDay(state, day) {
  try {
    const selectedDay = state.days.find((stateDay) => stateDay.name === day)
    const interviewers = selectedDay.interviewers.map((interviewerID) => state.interviewers[interviewerID])
    return interviewers;  
    } catch(err) {
      return []
    }
}
