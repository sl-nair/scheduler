import React from "react";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByPlaceholderText, getByAltText, waitForElementToBeRemoved, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);
describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();

  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument(); // making sure transitioned to saving mode
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving")); // checking that saving is done
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    // debug(appointment)
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));



    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument(); // making sure transitioned to deleting mode

    // 7. Wait until the element with the "Add" button is displayed.    expect(getByText(container, "Are you sure you would like to delete?")).toBeInTheDocument;
    await waitForElement(() => getByAltText(appointment, "Add")) // checking that deleting is done
    
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".  })
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click on Edit
    fireEvent.click(queryByAltText(container, "Edit"));

    // 5. Change input to dif name
    fireEvent.change(getByPlaceholderText(container, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 6. Click save
    fireEvent.click(getByText(container, "Save"));

    // 7. check saving is showing
    expect(getByText(container, "Saving")).toBeInTheDocument();

    // wait for alttext edit again
    await waitForElement(() => getByAltText(container, "Edit"))

    // 8. checks for new name
    await waitForElement(() => getByText(container, "Lydia Miller-Jones"));

    // 9. make sure 1 spot remaining still 
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    //find the appointment
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const myAppointment = getAllByTestId(container, "appointment")[0];

    //attempt to add an appointment
    fireEvent.click(getByAltText(myAppointment, "Add"));

    fireEvent.change(getByPlaceholderText(myAppointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(myAppointment, "Sylvia Palmer"));
    fireEvent.click(getByText(myAppointment, "Save"));
    expect(getByText(myAppointment, "Saving")).toBeInTheDocument(); // making sure transitioned to saving mode
    await waitForElementToBeRemoved(() => getByText(myAppointment, "Saving")); // checking that saving is done
    // //read could not save appointment error message, and expect to see the apoointment still there
    expect(getByText(myAppointment, "Could not save appointment")).toBeInTheDocument();
    fireEvent.click(getByAltText(myAppointment, "Close"));
    expect(getByPlaceholderText(myAppointment, /enter student name/i)).toHaveValue("");
   
  })

  it("shows the delete error when failing to delete an existing appointment", async() => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    //find the appointment
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const myAppointment = getAllByTestId(container, "appointment").find((appointment) => queryByText(appointment, "Archie Cohen"));
    
    //press delete and wait for deleting text to disappear
    fireEvent.click(getByAltText(myAppointment, "Delete"));
    expect(getByText(container, "Are you sure you would like to delete?")).toBeInTheDocument();
    fireEvent.click(getByText(myAppointment, "Confirm"));
    expect(getByText(myAppointment, "Deleting"));
    await waitForElementToBeRemoved(() =>
      getByText(myAppointment, "Deleting")
    );

    //read could not delete appointment error message, and expect to see the apoointment still there
    expect(getByText(myAppointment, "Could not delete appointment")).toBeInTheDocument();
    fireEvent.click(getByAltText(myAppointment, "Close"));
    expect(getByText(myAppointment, "Archie Cohen")).toBeInTheDocument();
  })
})