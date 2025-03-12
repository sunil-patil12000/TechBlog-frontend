import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Article } from '../types/blog';

interface BlogState {
  recentPosts: Article[];
  popularTags: string[];
  viewHistory: string[];
  bookmarks: string[];
  readingStats: {
    articlesRead: number;
    totalTimeSpent: number;
    lastRead: string | null;
  };
}

type BlogAction = 
  | { type: 'SET_RECENT_POSTS'; posts: Article[] }
  | { type: 'ADD_TO_HISTORY'; postId: string }
  | { type: 'TOGGLE_BOOKMARK'; postId: string }
  | { type: 'UPDATE_READING_STATS'; timeSpent: number }
  | { type: 'SET_POPULAR_TAGS'; tags: string[] }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_BOOKMARKS' };

interface BlogContextType {
  state: BlogState;
  addToHistory: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  updateReadingTime: (timeSpent: number) => void;
  setRecentPosts: (posts: Article[]) => void;
  clearHistory: () => void;
  clearBookmarks: () => void;
}

const initialState: BlogState = {
  recentPosts: [],
  popularTags: [],
  viewHistory: [],
  bookmarks: [],
  readingStats: {
    articlesRead: 0,
    totalTimeSpent: 0,
    lastRead: null
  }
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'SET_RECENT_POSTS':
      return { ...state, recentPosts: action.posts };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        viewHistory: [action.postId, ...state.viewHistory].slice(0, 50),
        readingStats: {
          ...state.readingStats,
          articlesRead: state.readingStats.articlesRead + 1,
          lastRead: new Date().toISOString()
        }
      };
    case 'TOGGLE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.postId)
          ? state.bookmarks.filter(id => id !== action.postId)
          : [...state.bookmarks, action.postId]
      };
    case 'UPDATE_READING_STATS':
      return {
        ...state,
        readingStats: {
          ...state.readingStats,
          totalTimeSpent: state.readingStats.totalTimeSpent + action.timeSpent
        }
      };
    case 'SET_POPULAR_TAGS':
      return { ...state, popularTags: action.tags };
    case 'CLEAR_HISTORY':
      return { 
        ...state, 
        viewHistory: [],
        readingStats: {
          ...state.readingStats,
          articlesRead: 0
        }
      };
    case 'CLEAR_BOOKMARKS':
      return { ...state, bookmarks: [] };
    default:
      return state;
  }
}

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load saved state from localStorage
  const savedState = localStorage.getItem('blog-state');
  const parsedState = savedState ? JSON.parse(savedState) : initialState;

  const [state, dispatch] = useReducer(blogReducer, parsedState);

  // Save state to localStorage on updates
  React.useEffect(() => {
    localStorage.setItem('blog-state', JSON.stringify(state));
  }, [state]);

  const addToHistory = useCallback((postId: string) => {
    dispatch({ type: 'ADD_TO_HISTORY', postId });
  }, []);

  const toggleBookmark = useCallback((postId: string) => {
    dispatch({ type: 'TOGGLE_BOOKMARK', postId });
  }, []);

  const updateReadingTime = useCallback((timeSpent: number) => {
    dispatch({ type: 'UPDATE_READING_STATS', timeSpent });
  }, []);

  const setRecentPosts = useCallback((posts: Article[]) => {
    dispatch({ type: 'SET_RECENT_POSTS', posts });
  }, []);
  
  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);
  
  const clearBookmarks = useCallback(() => {
    dispatch({ type: 'CLEAR_BOOKMARKS' });
  }, []);

  return (
    <BlogContext.Provider value={{
      state,
      addToHistory,
      toggleBookmark,
      updateReadingTime,
      setRecentPosts,
      clearHistory,
      clearBookmarks,
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
