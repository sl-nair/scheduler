import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  //empty default states
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  //add interview to database
  const bookInterview = function (id, interview) {
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

    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      setState({ ...state, appointments });
    });
  };
  //remove interview from database 
  const cancelInterview = function (appointmentID) {
    const appointment = {
      ...state.appointments[appointmentID],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [appointmentID]: appointment
    }

    return axios.delete(`/api/appointments/${appointmentID}`).then(() => {
      setState({ ...state, appointments });
    })
  }

  const setDay = day => setState({ ...state, day })

  //
  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get("/api/interviewers")
    ]).then((response) => {
      setState(prev => ({
        ...prev,
        days: response[0].data,
        appointments: response[1].data,
        interviewers: response[2].data
      }))
    })
  }, [])

  return { state, setDay, cancelInterview, bookInterview  };
}