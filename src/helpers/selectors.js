export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.filter((days) => days.name === day);
  let resultArray = [];
  if (!filteredDays[0]) {
    return resultArray;
  } else {
    for (const index of filteredDays[0].appointments) {
      for (const appointment in state.appointments) {
        if (appointment == index) {
          resultArray.push(state.appointments[appointment]);
        }
      }
    }
    return resultArray;
  }
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  } else {
    let newObj = {};
    const interviewerId = interview.interviewer;
    newObj = { ...interview, interviewer: state.interviewers[interviewerId] };

    return newObj;
  }
}

export function getInterviewersForDay(state, day) {
  let resultArray = [];
  if (state.days.length === 0) {
    return resultArray;
  }
  const filteredDays = state.days.filter((days) => days.name === day);

  if (!filteredDays[0]) {
    return resultArray;
  } else {
    for (const index of filteredDays[0].interviewers) {
      for (const interviewer in state.interviewers) {
        if (interviewer == index) {
          resultArray.push(state.interviewers[interviewer]);
        }
      }
    }
    return resultArray;
  }
}
