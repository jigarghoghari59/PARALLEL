import React, { createContext, useContext, useEffect, useState } from "react";
import { universeService } from "../services/universeService";

const UniverseContext = createContext(null);
export const useUniverse = () => useContext(UniverseContext);

export const UniverseProvider = ({ children }) => {
  const [universes, setUniverses] = useState([]);

  useEffect(() => {
    setUniverses(universeService.getAll());
  }, []);

  const sync = () => setUniverses(universeService.getAll());

  const create = (payload) => {
    const saved = universeService.save(payload);
    sync();
    return saved;
  };
  const update = (id, patch) => {
    universeService.update(id, patch);
    sync();
  };
  const addReality = (universeId, reality) => {
    const updated = universeService.addReality(universeId, reality);
    sync();
    return updated;
  };
  const remove = (id) => {
    universeService.remove(id);
    sync();
  };
  const toggleBookmark = (id) => {
    universeService.toggleBookmark(id);
    sync();
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
      }}
    >
      {children}
    </UniverseContext.Provider>
  );
};
