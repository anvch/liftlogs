/* eslint-disable react/display-name */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WorkoutEntryPage from "./WorkoutEntryPage";
import "@testing-library/jest-dom";
import { WorkoutService } from "../services/workout.service";

// Mock external dependencies
jest.mock("../components/Background", () => () => (
  <div data-testid="background"></div>
));
jest.mock("../assets/home.svg", () => "mocked-home-icon");

// Corrected mock for WorkoutService
jest.mock("../services/workout.service", () => ({
  WorkoutService: {
    getPresets: jest.fn(),
    createWorkout: jest.fn(),
    updateWorkout: jest.fn(),
    addWorkoutsToCalendar: jest.fn(),
  },
}));

// Mock window.confirm
global.confirm = jest.fn();

describe("WorkoutEntryPage Component with Mocked API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the WorkoutEntryPage component", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]); // Mock empty presets

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Wait for the component to finish rendering
    expect(
      await screen.findByRole("heading", { name: /Log Workout/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Add New/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();

    // Verify that getPresets was called
    expect(WorkoutService.getPresets).toHaveBeenCalled();
  });

  test("disables 'Save as Preset' checkbox when the name is empty", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    const saveAsPresetCheckbox =
      await screen.findByLabelText(/Save as Preset/i);

    // Initially, the checkbox should be disabled
    expect(saveAsPresetCheckbox).toBeDisabled();

    // Input a name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Workout 1" },
    });

    // Wait for the component to re-render
    await waitFor(() => {
      expect(saveAsPresetCheckbox).not.toBeDisabled();
    });

    // Clear the name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "" },
    });

    // Checkbox should be disabled again
    await waitFor(() => {
      expect(saveAsPresetCheckbox).toBeDisabled();
    });
  });

  test("adds a weight set and removes it", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Input reps and weight
    fireEvent.change(await screen.findByLabelText(/Reps:/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "50" },
    });

    // Click "Add Set" button
    fireEvent.click(screen.getByText(/Add Set/i));

    // Wait for the set to be added
    expect(
      await screen.findByText(/Reps: 10, Weight: 50/i),
    ).toBeInTheDocument();

    // Remove the set
    fireEvent.click(screen.getByText("X"));

    // Verify the set is removed
    await waitFor(() => {
      expect(
        screen.queryByText(/Reps: 10, Weight: 50/i),
      ).not.toBeInTheDocument();
    });
  });

  test("submits a new cardio workout", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);
    WorkoutService.createWorkout.mockResolvedValueOnce({ workoutId: "456" });
    WorkoutService.addWorkoutsToCalendar.mockResolvedValueOnce();

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select cardio workout type
    fireEvent.click(screen.getByLabelText(/Cardio/i));

    // Input name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Cardio Workout" },
    });

    // Input distance and time
    fireEvent.change(screen.getByLabelText(/Distance:/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/Time:/i), {
      target: { value: "30" },
    });

    // Click "Submit" button
    fireEvent.click(screen.getByRole("button", { name: /^Submit$/i }));

    // Wait for submit to complete
    await waitFor(() =>
      expect(WorkoutService.createWorkout).toHaveBeenCalled(),
    );

    // Verify the API call payload
    expect(WorkoutService.createWorkout).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Cardio Workout",
        workoutType: "cardio",
        distance: 5,
        time: 30,
        isPreset: false,
      }),
    );

    // Verify calendar API call
    expect(WorkoutService.addWorkoutsToCalendar).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      ["456"],
    );
  });

  test("edits an existing preset", async () => {
    const mockPresets = [
      {
        workoutId: "1",
        name: "Preset 1",
        workoutType: "weights",
        sets: [{ reps: "10", weight: "50" }],
      },
    ];
    WorkoutService.getPresets.mockResolvedValue(mockPresets);
    WorkoutService.updateWorkout.mockResolvedValueOnce();
    WorkoutService.addWorkoutsToCalendar.mockResolvedValueOnce();

    // Mock window.confirm to return true
    global.confirm.mockReturnValueOnce(true);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select the preset
    const presetSelect = await screen.findByLabelText(/Choose Preset:/i);
    fireEvent.change(presetSelect, { target: { value: "1" } });

    // Wait for preset details to load
    expect(await screen.findByText(/Preset Details/i)).toBeInTheDocument();

    // Click "Edit" button
    fireEvent.click(screen.getByText(/Edit/i));

    // Change the name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Updated Preset" },
    });

    // Click "Submit" button
    fireEvent.click(screen.getByRole("button", { name: /^Submit$/i }));

    // Wait for the update to complete
    await waitFor(() =>
      expect(WorkoutService.updateWorkout).toHaveBeenCalled(),
    );

    // Verify the API call payload
    expect(WorkoutService.updateWorkout).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        name: "Updated Preset",
        workoutType: "weights",
        sets: [{ reps: "10", weight: "50" }],
        isPreset: true,
      }),
    );

    // Verify calendar API call
    expect(WorkoutService.addWorkoutsToCalendar).toHaveBeenCalled();
  });

  test("deletes a preset", async () => {
    const mockPresets = [
      {
        workoutId: "1",
        name: "Preset 1",
        workoutType: "weights",
        sets: [{ reps: "10", weight: "50" }],
      },
    ];

    // Mock the return values of getPresets in order
    WorkoutService.getPresets
      .mockResolvedValueOnce(mockPresets) // Initial fetch
      .mockResolvedValueOnce([]); // After deletion

    WorkoutService.updateWorkout.mockResolvedValueOnce();

    // Mock window.confirm to return true
    global.confirm.mockReturnValueOnce(true);

    // Render the component
    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select the preset
    const presetSelect = await screen.findByLabelText(/Choose Preset:/i);

    // Change the selected preset
    await act(async () => {
      fireEvent.change(presetSelect, { target: { value: "1" } });
    });

    // Wait for preset details to load
    await waitFor(() => {
      expect(screen.getByText(/Preset Details/i)).toBeInTheDocument();
    });

    // Click "Delete" button
    await act(async () => {
      fireEvent.click(screen.getByText(/Delete/i));
    });

    // Verify the updateWorkout call
    await waitFor(() => {
      expect(WorkoutService.updateWorkout).toHaveBeenCalledWith("1", {
        isPreset: false,
      });
    });

    // Verify presets are updated
    expect(WorkoutService.getPresets).toHaveBeenCalledTimes(2);

    // Wait for the dropdown to update
    await waitFor(() => {
      expect(presetSelect.value).toBe("");
    });
  });

  test.skip("handles error when selected preset not found", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);
    WorkoutService.createWorkout.mockResolvedValueOnce({ workoutId: "123" });
    WorkoutService.addWorkoutsToCalendar.mockResolvedValueOnce();

    console.error = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Manually set a non-existent preset
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Choose Preset:/i), {
        target: { value: "non-existent-id" },
      });
    });

    // Attempt to submit
    fireEvent.click(screen.getByRole("button", { name: /^Submit$/i }));

    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith("Selected preset not found");
  });

  test.skip("prevents submission when required fields are missing", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // The submit button should be disabled initially
    const submitButton = screen.getByRole("button", { name: /^Submit$/i });
    expect(submitButton).toBeDisabled();

    // Select cardio workout type
    fireEvent.click(screen.getByLabelText(/Cardio/i));

    // Input name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Incomplete Cardio Workout" },
    });

    // Only input distance
    fireEvent.change(screen.getByLabelText(/Distance:/i), {
      target: { value: "5" },
    });

    // The submit button should still be disabled
    expect(submitButton).toBeDisabled();

    // Input time
    fireEvent.change(screen.getByLabelText(/Time:/i), {
      target: { value: "30" },
    });

    // Now the submit button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  test("changes date successfully", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    const dateInput = screen.getByLabelText(/Date:/i);

    // Change the date
    fireEvent.change(dateInput, { target: { value: "2022-01-01" } });

    // Verify the date has changed
    expect(dateInput.value).toBe("2022-01-01");
  });

  test("handles window.confirm rejection when modifying a preset", async () => {
    const mockPresets = [
      {
        workoutId: "1",
        name: "Preset 1",
        workoutType: "weights",
        sets: [{ reps: "10", weight: "50" }],
      },
    ];
    WorkoutService.getPresets.mockResolvedValue(mockPresets);

    // Mock window.confirm to return false
    global.confirm.mockReturnValueOnce(false);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select the preset
    const presetSelect = await screen.findByLabelText(/Choose Preset:/i);
    fireEvent.change(presetSelect, { target: { value: "1" } });

    // Click "Edit" button
    fireEvent.click(screen.getByText(/Edit/i));

    // Change the name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Updated Preset" },
    });

    // Click "Submit" button
    fireEvent.click(screen.getByRole("button", { name: /^Submit$/i }));

    // Verify updateWorkout was not called
    await waitFor(() => {
      expect(WorkoutService.updateWorkout).not.toHaveBeenCalled();
    });
  });

  test("handles error when removing a preset fails", async () => {
    const mockPresets = [
      {
        workoutId: "1",
        name: "Preset 1",
        workoutType: "weights",
        sets: [{ reps: "10", weight: "50" }],
      },
    ];
    WorkoutService.getPresets.mockResolvedValue(mockPresets);
    WorkoutService.updateWorkout.mockRejectedValueOnce(
      new Error("Delete Error"),
    );

    // Mock window.confirm to return true
    global.confirm.mockReturnValueOnce(true);

    console.error = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select the preset
    const presetSelect = await screen.findByLabelText(/Choose Preset:/i);
    fireEvent.change(presetSelect, { target: { value: "1" } });

    // Click "Delete" button
    fireEvent.click(screen.getByText(/Delete/i));

    // Wait for the error handling
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error removing preset:",
        expect.any(Error),
      );
    });
  });

  test("handles error when submitting a workout fails", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);
    WorkoutService.createWorkout.mockRejectedValueOnce(
      new Error("Submit Error"),
    );

    console.error = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Fill out the form
    fireEvent.change(await screen.findByLabelText(/Name:/i), {
      target: { value: "Workout 1" },
    });
    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByText(/Add Set/i));

    // Click "Submit" button
    fireEvent.click(screen.getByRole("button", { name: /^Submit$/i }));

    // Wait for error handling
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error submitting workout:",
        expect.any(Error),
      );
    });
  });
});
