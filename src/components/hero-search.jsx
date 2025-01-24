import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { Input } from "./controls/input";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

/**
 * Die HeroSearch-Komponente bietet eine Suchfunktionalität für Superhelden.
 * Sie nutzt ein Eingabefeld, um Benutzer-Eingaben zu erfassen, und führt bei Bedarf API-Aufrufe durch.
 *
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {function} [props.onSearch] - Eine Callback-Funktion, die aufgerufen wird,
 * wenn Suchergebnisse verfügbar sind. Wird mit einer Liste von Ergebnissen oder `null` aufgerufen.
 *
 * @returns {JSX.Element} - Gibt die HeroSearch-Komponente zurück.
 */
export const HeroSearch = ({ onSearch }) => {
  // Der Zustand, der den aktuellen Suchbegriff speichert.
  const [searchTerm, setSearchTerm] = useState("");
  // Der Zustand, der angibt, ob gerade eine Suche durchgeführt wird.
  const [loading, setLoading] = useState(false);

  /**
   * Führt eine Suche basierend auf dem eingegebenen Begriff durch.
   * Die Funktion ist mit `debounce` verzögert, um unnötige API-Aufrufe zu vermeiden.
   *
   * @param {string} term - Der Suchbegriff, der in der API gesucht wird.
   */
  const searchHero = useCallback(
    debounce(async (term) => {
      if (term.length < 3) {
        // Wenn der Begriff kürzer als 3 Zeichen ist, rufe onSearch mit null auf
        onSearch && onSearch(null);
        return;
      }

      // Setzt den Ladezustand auf aktiv
      setLoading(true);
      try {
        // API-Aufruf, um Superhelden zu suchen
        const response = await fetch(`/api/superheroapi/search/${term}`);
        const data = await response.json();

        // Gibt die Ergebnisse über die Callback-Funktion zurück
        onSearch && onSearch(data.results);
      } catch (error) {
        // Fehlerbehandlung: Gibt einen Fehler in der Konsole aus und ruft onSearch mit null auf
        console.error("Search failed:", error);
        onSearch && onSearch(null);
      }
      // Setzt den Ladezustand zurück
      setLoading(false);
    }, 500), // Verzögerung von 500ms
    [onSearch]
  );

  /**
   * Rendert die Benutzeroberfläche mit einem Eingabefeld und optional einem Ladeindikator.
   */
  return (
    <div className="relative w-full">
      <Input
        type="search"
        placeholder="Search heroes (minimum 3 characters)"
        value={searchTerm} // Der aktuelle Wert des Eingabefelds
        onChange={(e) => {
          const value = e.target.value; // Holt den eingegebenen Wert
          setSearchTerm(value); // Aktualisiert den Zustand des Suchbegriffs
          searchHero(value); // Führt die Suche aus
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};

/**
 * Validiert die Eigenschaften der Komponente.
 * @property {function} onSearch - Optional. Eine Funktion, die mit den Suchergebnissen oder `null` aufgerufen wird.
 */
HeroSearch.propTypes = {
  onSearch: PropTypes.func,
};
