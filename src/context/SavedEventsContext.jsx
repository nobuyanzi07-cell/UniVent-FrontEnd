import { createContext, useContext, useEffect, useState } from "react";

const SavedEventsContext = createContext(null);
const STORAGE_KEY = "savedEvents";

function loadSaved() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to read saved events:", error);
    return [];
  }
}

export function SavedEventsProvider({ children }) {
  const [saved, setSaved] = useState(loadSaved);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (error) {
      console.error("Failed to save events:", error);
    }
  }, [saved]);

  const isSaved = (id) => saved.some((e) => String(e.id) === String(id));

  const toggleSaved = (event) =>
    setSaved((prev) =>
      prev.some((e) => String(e.id) === String(event.id))
        ? prev.filter((e) => String(e.id) !== String(event.id))
        : [...prev, event]
    );

  return (
    <SavedEventsContext.Provider value={{ saved, isSaved, toggleSaved }}>
      {children}
    </SavedEventsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSavedEvents() {
  const ctx = useContext(SavedEventsContext);
  if (!ctx) {
    throw new Error("useSavedEvents must be used within SavedEventsProvider");
  }
  return ctx;
}