import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { universeService } from "../services/universeService";
import { Toast } from "../components/common/Toast";

const UniverseContext = createContext(null);
export const useUniverse = () => useContext(UniverseContext);

export const UniverseProvider = ({ children }) => {
  const [universes, setUniverses] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setUniverses(universeService.getAll());
  }, []);

  const sync = () => setUniverses(universeService.getAll());

  const showToast = useCallback((message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const create = (payload) => {
    const saved = universeService.save(payload);
    sync();
    showToast("Universe created and auto-saved to quantum memory");
    return saved;
  };
  const update = (id, patch) => {
    universeService.update(id, patch);
    sync();
    showToast("Universe changes auto-saved");
  };
  const addReality = (universeId, reality) => {
    const updated = universeService.addReality(universeId, reality);
    sync();
    showToast("Alternate branch auto-saved to universe");
    return updated;
  };
  const remove = (id) => {
    universeService.remove(id);
    sync();
    showToast("Universe removed from quantum library", "info");
  };
  const toggleBookmark = (id) => {
    const updated = universeService.toggleBookmark(id);
    sync();
    const isBookmarked = updated?.bookmarked;
    showToast(
      isBookmarked
        ? "Universe bookmarked to Archive"
        : "Universe removed from Bookmarks"
    );
  };

  // Compute stats — zero-safe
  const stats = {
    totalUniverses: universes.length,
    totalTimelines: universes.reduce(
      (a, u) => a + (u.realities?.length ?? 0),
      0
    ),
    totalDecisions: universes.length, // each universe = 1 decision
  };

  return (
    <UniverseContext.Provider
      value={{
        universes,
        create,
        update,
        addReality,
        remove,
        toggleBookmark,
        stats,
        refresh: sync,
        showToast,
      }}
    >
      {children}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </UniverseContext.Provider>
  );
};
