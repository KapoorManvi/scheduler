export function getAppointmentsForDay(state, day) {
  
  //Creates array of day object passed in params
  const appointmentDay = state.days.find(currentDay => currentDay.name === day);
  if (!appointmentDay) {
    return [];
  }

  //Creates array of appointments for given day from above
  const appointments = appointmentDay.appointments.map(appointmentId => state.appointments[appointmentId]);
  
  return appointments;
}

export function getInterview(state, interview) {
  
  if (!interview) {
    
    return null
  } 

  let newInterview 
  //If an interview appears in the state object, The interview ID is replaced with the interviewer object
  const id = interview.interviewer;
  newInterview = {
    ...newInterview,
    student: interview.student,
    interviewer: {
              id: state.interviewers[id].id,
              name: state.interviewers[id].name,
              avatar: state.interviewers[id].avatar
            }
  }
  
    return newInterview
  
}

export function getInterviewersForDay(state, day) {
  
  const dayName = state.days.find(currentDay => currentDay.name === day);
  
  if (state.days.length === 0 || dayName === undefined) {
    return [];
  }

  const interviewersNames = dayName.interviewers.map(interviewerId => state.interviewers[interviewerId]);

  return interviewersNames;
  
}