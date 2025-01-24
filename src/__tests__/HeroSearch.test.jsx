import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { HeroSearch } from "../components/hero-search";

// Für mehr Informationen zu vitest, siehe: https://vitest.dev/guide/
// Beschreibt die Tests für die Komponente HeroSearch
describe("HeroSearch Component", () => {
  // Test 1: Überprüft, ob die Eingabe- und Ladeanzeige korrekt gerendert werden
  test("renders input and loader", () => {
    // Rendert die Komponente HeroSearch
    render(<HeroSearch onSearch={vi.fn()} />);

    // Überprüft, ob das Eingabefeld korrekt gerendert wird
    const inputElement = screen.getByPlaceholderText(
      "Search heroes (minimum 3 characters)"
    );
    // Erwartet, dass das Eingabefeld im DOM ist
    expect(inputElement).toBeInTheDocument();

    // Überprüft, ob der Ladeanzeiger anfangs nicht angezeigt wird
    const loaderElement = screen.queryByRole("status"); // Erwartet ein Element mit der Rolle "status"
    expect(loaderElement).not.toBeInTheDocument(); // Ladeanzeiger darf am Anfang nicht sichtbar sein
  });

  // Test 2: Überprüft, ob der Eingabewert bei Änderung aktualisiert wird
  test("updates input value on change", () => {
    render(<HeroSearch onSearch={vi.fn()} />);

    const inputElement = screen.getByPlaceholderText(
      "Search heroes (minimum 3 characters)"
    );

    // Simuliert das Eingeben von "Batman" in das Eingabefeld
    fireEvent.change(inputElement, { target: { value: "Batman" } });

    // Erwartet, dass der Wert des Eingabefelds aktualisiert wurde
    expect(inputElement.value).toBe("Batman");
  });

  // Test 3: Überprüft den erfolgreichen API-Aufruf und die Verarbeitung der Ergebnisse
  test("handles API call success", async () => {
    // Mock-Funktion für die onSearch-Eigenschaft
    const mockOnSearch = vi.fn();

    // Mockt die fetch-Funktion und gibt simulierte Ergebnisse zurück
    const mockFetch = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => ({
        results: [
          { id: 1, name: "Batman" },
          { id: 2, name: "Superman" },
        ],
      }),
    });

    render(<HeroSearch onSearch={mockOnSearch} />);

    const inputElement = screen.getByPlaceholderText(
      "Search heroes (minimum 3 characters)"
    );

    // Simuliert die Eingabe eines gültigen Suchbegriffs
    fireEvent.change(inputElement, { target: { value: "Bat" } });

    // Wartet auf die Ergebnisse des API-Aufrufs und überprüft die Rückgabe
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith([
        { id: 1, name: "Batman" },
        { id: 2, name: "Superman" },
      ]);
    });

    // Setzt das Mocking von fetch zurück
    mockFetch.mockRestore();
  });

  // Test 4: Überprüft die Fehlerbehandlung bei einem fehlgeschlagenen API-Aufruf
  test("handles API call error", async () => {
    const mockOnSearch = vi.fn();

    // Mockt die fetch-Funktion, sodass ein Fehler ausgelöst wird
    const mockFetch = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("API error"));

    render(<HeroSearch onSearch={mockOnSearch} />);

    const inputElement = screen.getByPlaceholderText(
      "Search heroes (minimum 3 characters)"
    );

    // Simuliert die Eingabe eines gültigen Suchbegriffs
    fireEvent.change(inputElement, { target: { value: "Bat" } });

    // Wartet darauf, dass der Fehler verarbeitet wird
    await waitFor(() => {
      // Erwartet, dass onSearch mit null aufgerufen wird
      expect(mockOnSearch).toHaveBeenCalledWith(null);
    });

    // Setzt das Mocking von fetch zurück
    mockFetch.mockRestore();
  });

  // Test 5: Überprüft, dass die API nicht aufgerufen wird, wenn die Eingabe zu kurz ist
  test("does not call API for input shorter than 3 characters", async () => {
    const mockOnSearch = vi.fn();
    const mockFetch = vi.spyOn(globalThis, "fetch");

    render(<HeroSearch onSearch={mockOnSearch} />);

    const inputElement = screen.getByPlaceholderText(
      "Search heroes (minimum 3 characters)"
    );

    // Simuliert die Eingabe eines zu kurzen Suchbegriffs
    fireEvent.change(inputElement, { target: { value: "Ba" } });

    // Wartet darauf, dass die API nicht aufgerufen wird
    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled(); // Erwartet, dass die API nicht aufgerufen wird
      expect(mockOnSearch).toHaveBeenCalledWith(null); // Erwartet, dass onSearch mit null aufgerufen wird
    });

    // Setzt das Mocking von fetch zurück
    mockFetch.mockRestore();
  });
});
