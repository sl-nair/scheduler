import React from "react";
import "components/DayListItem.scss"
import classNames from "classnames";

export default function DayListItem(props) {
  const listClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  }

  )

  
  
  function formatSpots(spots) {

    if (spots === 0) {
      return "no spots remaining"
    } else if (spots === 1) {
      return "1 spot remaining"
    } else if (spots > 1) {
      return`${spots} spots remaining`
    }

  }
  return (
    <li 
    className={listClass}
    onClick={() => props.setDay(props.name)} 
    selected={props.selected}
    data-testid= "day"
      >
      <h2 className="text--regular"> {props.name}</h2>
      <h3 className="text--light"> {formatSpots(props.spots)}</h3>
    </li>
  );
} 
