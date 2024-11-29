/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
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
    fireEvent.change(screen.getByLabelText(/Distance \(miles\):/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/Time \(min\):/i), {
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

  test("resets the form", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);
    WorkoutService.createWorkout.mockResolvedValueOnce({ workoutId: "123" });
    WorkoutService.addWorkoutsToCalendar.mockResolvedValueOnce();

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Test Workout" },
    });
    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "50" },
    });

    act(() => fireEvent.click(screen.getByText(/Add Set/i)));

    // Click the reset button (simulate reset logic)
    act(() => fireEvent.click(screen.getByRole("button", { name: /Submit/i })));

    // Ensure form is reset
    await waitFor(() => {
      expect(screen.getByLabelText(/Name:/i).value).toBe("");
      expect(screen.getByLabelText(/Reps:/i).value).toBe("");
      expect(screen.getByLabelText(/Weight:/i).value).toBe("");
      expect(
        screen.queryByText(/Reps: 10, Weight: 50/i),
      ).not.toBeInTheDocument();
    });
  });

  test("switches between workout types", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Verify Weights input is visible initially
    expect(screen.getByLabelText(/Reps:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight:/i)).toBeInTheDocument();

    // Switch to Cardio
    fireEvent.click(screen.getByLabelText(/Cardio/i));

    // Verify Cardio input is visible
    expect(screen.getByLabelText(/Distance \(miles\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time \(min\):/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Reps:/i)).not.toBeInTheDocument();
  });

  test("deletes all sets", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Add multiple sets
    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByText(/Add Set/i));

    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "55" },
    });
    fireEvent.click(screen.getByText(/Add Set/i));

    // Verify sets are added
    expect(screen.getByText(/Reps: 10, Weight: 50/i)).toBeInTheDocument();
    expect(screen.getByText(/Reps: 12, Weight: 55/i)).toBeInTheDocument();

    // Delete each set
    fireEvent.click(screen.getAllByText("X")[0]);
    fireEvent.click(screen.getAllByText("X")[0]);

    // Verify all sets are removed
    await waitFor(() => {
      expect(
        screen.queryByText(/Reps: 10, Weight: 50/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Reps: 12, Weight: 55/i),
      ).not.toBeInTheDocument();
    });
  });

  test("submits an existing preset without editing", async () => {
    const mockPresets = [
      {
        workoutId: "1",
        name: "Preset 1",
        workoutType: "weights",
        sets: [{ reps: "10", weight: "50" }],
        isPreset: true,
      },
    ];

    WorkoutService.getPresets.mockResolvedValueOnce(mockPresets);
    WorkoutService.addWorkoutsToCalendar.mockResolvedValueOnce();

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select the preset
    const presetSelect = screen.getByLabelText(/Choose Preset:/i);
    fireEvent.change(presetSelect, { target: { value: "1" } });

    // Verify preset details are loaded
    expect(await screen.findByText(/Preset Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Reps: 10, Weight: 50/i)).toBeInTheDocument();

    // Click 'Submit' without editing
    fireEvent.click(screen.getByText(/^Submit$/i));

    // Verify addWorkoutsToCalendar was called with the preset workoutId
    await waitFor(() => {
      expect(WorkoutService.addWorkoutsToCalendar).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        ["1"],
      );
    });

    // Verify that updateWorkout and createWorkout were not called
    expect(WorkoutService.updateWorkout).not.toHaveBeenCalled();
    expect(WorkoutService.createWorkout).not.toHaveBeenCalled();
  });

  test("selects and edits a preset", async () => {
    const mockPresets = [
      {
        workoutId: "1",
        name: "Preset 1",
        workoutType: "weights",
        sets: [{ reps: "10", weight: "50" }],
        isPreset: true,
      },
    ];

    WorkoutService.getPresets.mockResolvedValueOnce(mockPresets);
    WorkoutService.updateWorkout.mockResolvedValueOnce();
    WorkoutService.addWorkoutsToCalendar.mockResolvedValueOnce();

    global.confirm.mockReturnValueOnce(true);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select the preset
    const presetSelect = screen.getByLabelText(/Choose Preset:/i);
    fireEvent.change(presetSelect, { target: { value: "1" } });

    // Verify preset details are loaded
    expect(await screen.findByText(/Preset Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Reps: 10, Weight: 50/i)).toBeInTheDocument();

    // Edit the preset
    fireEvent.click(screen.getByText(/Edit/i));
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "Updated Preset" },
    });

    // Submit the updated preset
    fireEvent.click(screen.getByRole("button", { name: /^Submit$/i }));

    // Verify updateWorkout was called with updated data
    await waitFor(() => {
      expect(WorkoutService.updateWorkout).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          name: "Updated Preset",
          sets: [{ reps: "10", weight: "50" }],
        }),
      );
    });
  });

  test("creates a new workout and saves as preset", async () => {
    WorkoutService.getPresets.mockResolvedValueOnce([]);
    WorkoutService.createWorkout.mockResolvedValueOnce({ workoutId: "789" });
    WorkoutService.addWorkoutsToCalendar.mockResolvedValueOnce();

    // Mock getPresets to be called again after saving the preset
    WorkoutService.getPresets.mockResolvedValueOnce([
      {
        workoutId: "789",
        name: "New Preset Workout",
        workoutType: "weights",
        sets: [{ reps: "8", weight: "100" }],
        isPreset: true,
      },
    ]);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Input name
    fireEvent.change(screen.getByLabelText(/Name:/i), {
      target: { value: "New Preset Workout" },
    });

    // Enable 'Save as Preset'
    fireEvent.click(screen.getByLabelText(/Save as Preset/i));

    // Input reps and weight
    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "8" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "100" },
    });

    // Add the set
    fireEvent.click(screen.getByText(/Add Set/i));

    // Click 'Submit'
    fireEvent.click(screen.getByRole("button", { name: /^Submit$/i }));

    // Verify createWorkout was called with isPreset: true
    await waitFor(() => {
      expect(WorkoutService.createWorkout).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Preset Workout",
          workoutType: "weights",
          sets: [{ reps: "8", weight: "100" }],
          isPreset: true,
        }),
      );
    });

    // Verify addWorkoutsToCalendar was called
    expect(WorkoutService.addWorkoutsToCalendar).toHaveBeenCalled();

    // Verify getPresets was called again to update the presets
    expect(WorkoutService.getPresets).toHaveBeenCalledTimes(2);
  });

  test("resets the form when switching from preset to 'Add New'", async () => {
    const mockPresets = [
      {
        workoutId: "1",
        name: "Preset 1",
        workoutType: "weights",
        sets: [{ reps: "10", weight: "50" }],
        isPreset: true,
      },
    ];

    WorkoutService.getPresets.mockResolvedValueOnce(mockPresets);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select the preset
    const presetSelect = screen.getByLabelText(/Choose Preset:/i);
    fireEvent.change(presetSelect, { target: { value: "1" } });

    // Verify preset details are loaded
    expect(await screen.findByText(/Preset Details/i)).toBeInTheDocument();

    // Switch back to 'No Preset (Add New)'
    fireEvent.change(presetSelect, { target: { value: "" } });

    // Wait for form to reset
    await waitFor(() => {
      expect(screen.getByLabelText(/Name:/i).value).toBe("");
      expect(screen.getByLabelText(/Reps:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Weight:/i)).toBeInTheDocument();
      expect(screen.queryByText(/Preset Details/i)).not.toBeInTheDocument();
    });
  });

  test("selects a cardio preset and displays details", async () => {
    const mockPresets = [
      {
        workoutId: "2",
        name: "Cardio Preset",
        workoutType: "cardio",
        distance: 5,
        time: 30,
        isPreset: true,
      },
    ];

    WorkoutService.getPresets.mockResolvedValueOnce(mockPresets);

    await act(async () => {
      render(
        <MemoryRouter>
          <WorkoutEntryPage />
        </MemoryRouter>,
      );
    });

    // Select the cardio preset
    const presetSelect = screen.getByLabelText(/Choose Preset:/i);
    fireEvent.change(presetSelect, { target: { value: "2" } });

    // Verify preset details are displayed
    expect(await screen.findByText(/Preset Details/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Distance \(miles\): 5, Time \(min\): 30/i),
    ).toBeInTheDocument();
  });

  test("prevents submission when required fields are missing", async () => {
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
    fireEvent.change(screen.getByLabelText(/Distance \(miles\):/i), {
      target: { value: "5" },
    });

    // The submit button should still be disabled
    expect(submitButton).toBeDisabled();

    // Input time
    fireEvent.change(screen.getByLabelText(/Time \(min\):/i), {
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
