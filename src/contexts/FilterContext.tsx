import React, { createContext, useContext, useReducer, useCallback } from 'react';

type FilterState = {
  view: 'grid' | 'list';
  viewMode: 'grid' | 'list'; // Alias for view
  category?: string;
  tag?: string;
  sortBy: string;
  sortOrder: string; // Alias for sortBy
  search?: string;
};

type FilterAction = 
  | { type: 'SET_VIEW'; view: 'grid' | 'list' }
  | { type: 'SET_CATEGORY'; category?: string }
  | { type: 'SET_TAG'; tag?: string }
  | { type: 'SET_SORT'; sortBy: string }
  | { type: 'SET_SEARCH'; search?: string }
  | { type: 'RESET' };

interface FilterContextType {
  state: FilterState;
  setView: (view: 'grid' | 'list') => void;
  updateViewMode: (view: 'grid' | 'list') => void; // Alias for setView
  setCategory: (category?: string) => void;
  setTag: (tag?: string) => void;
  setSort: (sortBy: string) => void;
  updateSortOrder: (sortBy: string) => void; // Alias for setSort
  setSearch: (search?: string) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialState: FilterState = {
  view: 'grid',
  viewMode: 'grid', // Alias
  sortBy: 'newest',
  sortOrder: 'newest', // Alias
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_VIEW':
      return { 
        ...state, 
        view: action.view,
        viewMode: action.view // Keep both in sync
      };
    case 'SET_CATEGORY':
      return { ...state, category: action.category };
    case 'SET_TAG':
      return { ...state, tag: action.tag };
    case 'SET_SORT':
      return { 
        ...state, 
        sortBy: action.sortBy,
        sortOrder: action.sortBy // Keep both in sync
      };
    case 'SET_SEARCH':
      return { ...state, search: action.search };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const setView = useCallback((view: 'grid' | 'list') => {
    dispatch({ type: 'SET_VIEW', view });
  }, []);

  // Alias for setView
  const updateViewMode = useCallback((view: 'grid' | 'list') => {
    dispatch({ type: 'SET_VIEW', view });
  }, []);

  const setCategory = useCallback((category?: string) => {
    dispatch({ type: 'SET_CATEGORY', category });
  }, []);

  const setTag = useCallback((tag?: string) => {
    dispatch({ type: 'SET_TAG', tag });
  }, []);

  const setSort = useCallback((sortBy: string) => {
    dispatch({ type: 'SET_SORT', sortBy });
  }, []);

  // Alias for setSort
  const updateSortOrder = useCallback((sortBy: string) => {
    dispatch({ type: 'SET_SORT', sortBy });
  }, []);

  const setSearch = useCallback((search?: string) => {
    dispatch({ type: 'SET_SEARCH', search });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <FilterContext.Provider value={{
      state,
      setView,
      updateViewMode, // Add alias
      setCategory,
      setTag,
      setSort,
      updateSortOrder, // Add alias
      setSearch,
      resetFilters,
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
