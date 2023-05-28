import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {

  const formatSpots = function (props) {
    let text = `${props.spots} spots remaining`
    if (props.spots === 0) {
      text = "no spots remaining"
    } else if (props.spots === 1) {
      text = `${props.spots} spot remaining`
    } 
    return text;
  }

  const dayClass = classNames('day-list__item', {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0,
})
  return (
    <li className={dayClass} 
        onClick={() => props.setDay(props.name)}
        selected={props.selected}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props)}</h3>
    </li>
  );
}
