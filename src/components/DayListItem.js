import React from "react";
import "components/DayListItem.scss"
import classNames from "classnames";

export default function DayListItem(props) {
  const listClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  }

  )

  return (
    <li
      className={listClass}
      onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular"> {props.name}</h2>
      <h3 className="text--light"> {formatSpots(props.spots)}</h3>
    </li>
  );

  function formatSpots(spots) {
    let spotsValue = "";

    if (spots === 0) {
      spotsValue = "no spots remaining"
    } else if (spots === 1) {
      spotsValue = "1 spot remaining"
    } else if (spots > 1) {
      spotsValue = `${spots} spots remaining`
    }

    return spotsValue
  }

} 
