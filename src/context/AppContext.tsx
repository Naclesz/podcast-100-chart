import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { podcastService } from "services/podcast.service";
import type { ApiError, Podcast, PodcastDetails } from "types/types";
import { isStale } from "utils/utils";

type AppState = {
  podcasts: Podcast[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: ApiError | null;
  hydrated: boolean;
};

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: ApiError | null }
  | { type: "SET_PODCASTS"; payload: Podcast[] }
  | {
      type: "SET_PODCAST_DETAILS";
      payload: { id: string; details: PodcastDetails };
    }
  | { type: "HYDRATE_STATE"; payload: Partial<AppState> };

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadPodcasts: () => Promise<void>;
  loadPodcastDetails: (podcastId: string) => Promise<void>;
  clearError: () => void;
};

const initialState: AppState = {
  podcasts: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
  hydrated: false,
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
      return {
        ...state,
        podcasts: action.payload,
        lastUpdated: new Date(),
        isLoading: false,
      };
    case "SET_PODCAST_DETAILS":
      return {
        ...state,
        podcasts: state.podcasts.map((podcast) =>
          podcast.id === action.payload.id
            ? {
                ...podcast,
                details: action.payload.details,
                lastUpdated: new Date(),
              }
            : podcast
        ),
        isLoading: false,
      };

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
      const hydratedState = {
        ...persistedState,
        lastUpdated: persistedState.lastUpdated
          ? new Date(persistedState.lastUpdated)
          : null,
        hydrated: true,
      };
      dispatch({ type: "HYDRATE_STATE", payload: hydratedState });
    } else {
      dispatch({
        type: "HYDRATE_STATE",
        payload: { hydrated: true, lastUpdated: null, podcasts: [] },
      });
    }
  }, []);

  useEffect(() => {
    StorageService.save({
      podcasts: state.podcasts,
      lastUpdated: state.lastUpdated,
    });
  }, [state.podcasts, state.lastUpdated]);

  const loadPodcasts = useCallback(async (): Promise<void> => {
    if (state.isLoading) {
      return;
    }

    if (state?.lastUpdated && !isStale(state.lastUpdated.getTime())) {
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const podcasts = await podcastService.getListPodcasts();

      dispatch({ type: "SET_PODCASTS", payload: podcasts });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          message:
            error instanceof Error ? error.message : "Error loading podcasts",
          status: (error as ApiError)?.status,
          code: (error as ApiError)?.code,
        },
      });
    }
  }, [state.isLoading, state.lastUpdated]);

  const loadPodcastDetails = useCallback(
    async (podcastId: string): Promise<void> => {
      if (state.isLoading) {
        return;
      }

      const podcast = state.podcasts.find(
        (podcast) => podcast.id === podcastId
      );

      if (
        podcast?.lastUpdated &&
        !isStale(new Date(podcast.lastUpdated).getTime())
      ) {
        return;
      }

      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const podcastDetail = await podcastService.getPodcastDetails(podcastId);
        if (podcastDetail) {
          dispatch({
            type: "SET_PODCAST_DETAILS",
            payload: { id: podcastId, details: podcastDetail },
          });
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: {
            message:
              error instanceof Error
                ? error.message
                : "Error loading podcast details",
            status: (error as ApiError)?.status,
            code: (error as ApiError)?.code,
          },
        });
      }
    },
    [state.isLoading, state.podcasts]
  );

  const clearError = useCallback((): void => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      loadPodcasts,
      loadPodcastDetails,
      clearError,
    }),
    [state, loadPodcasts, loadPodcastDetails, clearError]
  );

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

export type { Podcast } from "types/types";
export type { AppState };
