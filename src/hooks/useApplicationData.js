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

  const updateSpots = (appointments, appointmentId) => {
    const currentDay = state.days.find((day)=> day.appointments.includes(appointmentId));
    const spots = currentDay.appointments.filter(id => appointments[id].interview === null).length

    return state.days.map(day => day.name === currentDay.name ? { ...day, spots } : day)
  }

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
    
    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      setState({ ...state, appointments, days: updateSpots(appointments, id) });
    });
  };

  //remove interview from database 
  const cancelInterview = function (id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`).then(() => {
      setState({ ...state, appointments, days: updateSpots(appointments, id) });
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