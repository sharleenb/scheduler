import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {
      1: {
        id: 1,
        time: "12pm",
        interview: null,
      },
    },
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function updateSpots(appointments) {
    const findDay = state.days.find((element) => element.name === state.day);
    let spotsLeft = 0;
    for (const appt of findDay.appointments) {
      if (appointments[appt].interview == null) {
        spotsLeft += 1;
      }
    }
    const actualDay = { ...findDay, spots: spotsLeft };

    return state.days.map((day) => {
      if (state.day === day.name) {
        return actualDay;
      } else {
        return day;
      }
    });
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`api/appointments/${id}`, { interview }).then(() => {
      setState({
        ...state,
        appointments,
        days: updateSpots(appointments),
      });
    });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => {
        setState({
          ...state,
          appointments,
          days: updateSpots(appointments),
        });
      });
  }

  useEffect(() => {
    Promise.all([
      axios.get("api/days"),
      axios.get("api/appointments"),
      axios.get("api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);
  return { state, setDay, bookInterview, cancelInterview };
}
