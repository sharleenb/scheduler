export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.filter(days => days.name === day)
  let resultArray = []
  if (!filteredDays[0]) {
    return resultArray;
  } else {
    for (const index of filteredDays[0].appointments) {
      for (const appointment in state.appointments) {
        if (appointment == index) {
          resultArray.push(state.appointments[appointment])
        }
      }
    }
    return (filteredDays[0].appointments, resultArray)
  }
  
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  } else {
    let newObj = {}
    const interviewerId = interview.interviewer
    newObj = {...interview, interviewer: state.interviewers[interviewerId]}
  
    return newObj
  }
}