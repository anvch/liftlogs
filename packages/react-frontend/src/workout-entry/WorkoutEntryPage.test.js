/* eslint-disable react/display-name */
import React from "react"; // eslint-disable-line no-unused-vars
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // To wrap the component with routing
import WorkoutEntryPage from "./WorkoutEntryPage"; // Adjust the import path as needed
import "@testing-library/jest-dom"; // For extended matchers

// Mock external dependencies
jest.mock("../components/Background", () => () => (
  <div data-testid="background"></div>
));
jest.mock("../assets/home.svg", () => "mocked-home-icon");

describe("WorkoutEntryPage Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test("renders the WorkoutEntryPage component", () => {
    render(
      <MemoryRouter>
        <WorkoutEntryPage />
      </MemoryRouter>,
    );

    // Check for key elements in the page
    expect(
      screen.getByRole("heading", { name: /Log Workout/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Add New/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Choose Preset:/i)).toBeInTheDocument();
  });

  test("disables 'Save as Preset' checkbox when the name is empty", () => {
    render(
      <MemoryRouter>
        <WorkoutEntryPage />
      </MemoryRouter>,
    );

    const saveAsPresetCheckbox = screen.getByLabelText(/Save as Preset/i);

    // Initially, the checkbox should be disabled
    expect(saveAsPresetCheckbox).toBeDisabled();

    // Input a name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Workout 1" },
    });

    // Checkbox should now be enabled
    expect(saveAsPresetCheckbox).not.toBeDisabled();
  });

  test("allows adding a weight set", () => {
    render(
      <MemoryRouter>
        <WorkoutEntryPage />
      </MemoryRouter>,
    );

    // Input reps and weight
    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "50" },
    });

    // Click "Add Set" button
    fireEvent.click(screen.getByText(/Add Set/i));

    // Verify the set appears in the list
    expect(screen.getByText(/Reps: 10, Weight: 50/i)).toBeInTheDocument();
  });

  test("creates a preset and stores it in localStorage", () => {
    render(
      <MemoryRouter>
        <WorkoutEntryPage />
      </MemoryRouter>,
    );

    // Input a name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Workout 1" },
    });

    // Check "Save as Preset"
    fireEvent.click(screen.getByLabelText(/Save as Preset/i));

    // Add a weight set
    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByText(/Add Set/i));

    // Submit the workout
    fireEvent.click(screen.getByText(/Submit/i));

    // Verify localStorage contains the saved preset
    const presets = JSON.parse(localStorage.getItem("presets"));
    expect(presets).toHaveLength(1);
    expect(presets[0]).toEqual(
      expect.objectContaining({
        name: "Workout 1",
        workoutType: "Weights",
        sets: [{ reps: "10", weight: "50" }],
      }),
    );
  });

  test("renders preset details when a preset is selected", () => {
    // Save a preset in localStorage for the test
    localStorage.setItem(
      "presets",
      JSON.stringify([
        {
          name: "Workout 1",
          workoutType: "Weights",
          sets: [{ reps: "10", weight: "50" }],
        },
      ]),
    );

    render(
      <MemoryRouter>
        <WorkoutEntryPage />
      </MemoryRouter>,
    );

    // Select the preset
    fireEvent.change(screen.getByLabelText(/Choose Preset:/i), {
      target: { value: "Workout 1" },
    });

    // Verify that the "Workout 1" option is selected
    expect(screen.getByLabelText(/Choose Preset:/i)).toHaveValue("Workout 1");

    // Verify preset details are displayed
    expect(screen.getByText(/Preset Details/i)).toBeInTheDocument();

    // Custom matcher for "Name: Workout 1" (handles fragmented text)
    expect(screen.getByTestId("preset-name")).toHaveTextContent(
      "Name: Workout 1",
    );

    // Verify workout type and set details
    expect(screen.getByText(/Weights/i)).toBeInTheDocument();
    expect(screen.getByText(/Reps: 10, Weight: 50/i)).toBeInTheDocument();
  });

  test("removes a set from the list", () => {
    render(
      <MemoryRouter>
        <WorkoutEntryPage />
      </MemoryRouter>,
    );

    // Add a set
    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByText(/Add Set/i));

    // Verify the set is added
    const removeButton = screen.getByText(/X/i);
    expect(screen.getByText(/Reps: 10, Weight: 50/i)).toBeInTheDocument();

    // Remove the set
    fireEvent.click(removeButton);

    // Verify the set is removed
    expect(screen.queryByText(/Reps: 10, Weight: 50/i)).not.toBeInTheDocument();
  });
});
