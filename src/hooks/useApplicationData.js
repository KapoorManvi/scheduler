import { useEffect, useState } from 'react';
import axios from 'axios';


export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDays = days => {
    setState(prev => ({...prev, days}))
  }

  const setDay = day => {
    setState(prev => ({...prev, day}))
  }


  function bookInterview(id, interview) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    const days = [...state.days]
    for (let day of days) {
      if (day.name === state.day) {
        day.spots -= 1;
      }
    }

    return axios.put(`/api/appointments/${id}`, {interview}).then(response => {
      
      setState(state => ({
        ...state,
        appointments,
        days
      }));
    })
  }

  function cancelInterview (id) {
    return axios.delete(`api/appointments/${id}`).then(()=> {

      const cancelAppointment = {
        ...state.appointments[id],
        interview: null
      };
      
      const appointments = {
        ...state.appointments,
        [id]: cancelAppointment
      };
      
      const days = [...state.days]
      for (let day of days) {
        if (day.name === state.day) {
          day.spots += 1;
        }
      }
      setState(state => ({
        ...state,
        appointments,
        days
      }));
    })
  }

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ])
    .then((response) => {
      
      setState(prev => ({...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data}))
    })
  }, []);


 return {state, setDay, bookInterview, cancelInterview}
}