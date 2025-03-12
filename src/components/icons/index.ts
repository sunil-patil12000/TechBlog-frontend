/**
 * Icon exports with proper aliasing
 * 
 * This file centralizes our icon imports and provides aliases
 * for icons that might change in the future or for icons with 
 * different naming conventions across libraries.
 */

// Import icons from lucide-react
import { 
  LayoutGrid,
  // Navigation icons
  Menu as MenuIcon,
  Search as SearchIcon,
  X as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  ArrowRight as ArrowRightIcon,
  
  // Theme icons
  Moon as MoonIcon,
  Sun as SunIcon,
  Monitor as SystemIcon,
  
  // Content icons
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Heart as HeartIcon,
  MessageSquare as CommentIcon,
  User as UserIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Link as LinkIcon,
  
  // Social icons
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  
  // Layout icons
  Grid as GridIcon,
  List as ListIcon,
  LayoutList as LayoutListIcon,
  Filter as FilterIcon,
  
  // Misc icons
  AlertTriangle as WarningIcon,
  CheckCircle as SuccessIcon,
  XCircle as ErrorIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
  RefreshCw as RefreshIcon,
} from 'lucide-react';

// Export the GridLayoutIcon as an alias of LayoutGrid 
export const GridLayoutIcon = LayoutGrid;

// Re-export all icons
export {
  // Navigation
  MenuIcon,
  SearchIcon,
  CloseIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  
  // Theme
  MoonIcon,
  SunIcon,
  SystemIcon,
  
  // Content
  ClockIcon,
  CalendarIcon,
  HeartIcon,
  CommentIcon,
  UserIcon,
  BookmarkIcon,
  ShareIcon,
  LinkIcon,
  
  // Social
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  GithubIcon,
  
  // Layout
  GridIcon,
  ListIcon,
  LayoutListIcon,
  LayoutGrid,
  FilterIcon,
  
  // Misc
  WarningIcon,
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
  SettingsIcon,
  HelpIcon,
  RefreshIcon,
}; 