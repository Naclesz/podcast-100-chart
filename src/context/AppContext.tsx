import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { Podcast } from "types/types";

type AppState = {
  podcasts: Podcast[];
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
};

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PODCASTS"; payload: Podcast[] }
  | { type: "HYDRATE_STATE"; payload: Partial<AppState> };

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  loadPodcasts: () => Promise<void>;
  clearError: () => void;
};

const initialState: AppState = {
  podcasts: [],
  lastUpdated: new Date(),
  isLoading: false,
  error: null,
};

class StorageService {
  private static readonly STORAGE_KEY = "podcast-app-state";

  static save(data: Partial<AppState>): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.STORAGE_KEY, serializedData);
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  static load(): Partial<AppState> | null {
    try {
      const serializedData = localStorage.getItem(this.STORAGE_KEY);
      return serializedData ? JSON.parse(serializedData) : null;
    } catch (error) {
      console.error("Error loading from storage:", error);
      return null;
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_PODCASTS":
      return { ...state, podcasts: action.payload, isLoading: false };

    case "HYDRATE_STATE":
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({
  children,
}: AppProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const persistedState = StorageService.load();
    if (persistedState) {
      dispatch({ type: "HYDRATE_STATE", payload: persistedState });
    }
  }, []);

  async function loadPodcasts(): Promise<void> {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const mockPodcasts: Podcast[] = [
        {
          id: "1",
          title: "Sample Podcast",
          author: "A sample podcast",
          imageUrl: "/sample.jpg",
          details: {
            episodes: [],
          },
          lastUpdated: new Date(),
        },
      ];

      dispatch({ type: "SET_PODCASTS", payload: mockPodcasts });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error loading podcasts",
      });
    }
  }

  function clearError(): void {
    dispatch({ type: "SET_ERROR", payload: null });
  }

  const contextValue: AppContextType = {
    state,
    dispatch,
    loadPodcasts,
    clearError,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}

export type { AppState, Podcast };
