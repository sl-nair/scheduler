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
    const currentDay = state.days.find((day)=> day.appointments.includes(id));
    const newDays = state.days.map((day) => {
      if(
        day.name === currentDay.name && state.appointments[id].interview === null
      ) {
        return {...day, spots: day.spots - 1};
      } else {
        return day;
      }
    })

    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      setState({ ...state, appointments, newDays });
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

    const currentDay = state.days.find((day) => day.appointments.includes(id));
    const newDays = state.days.map((day) => {
      if(
        day.name === currentDay.name
      ) {
        return {...day, spots: day.spots + 1};
      } else {
        return day;
      }
    })
    return axios.delete(`/api/appointments/${id}`).then(() => {
      setState({ ...state, appointments, newDays });
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