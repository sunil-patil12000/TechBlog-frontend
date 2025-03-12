import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  FolderClosed, 
  Image, 
  Settings, 
  Users, 
  AlertTriangle,
  ChevronDown,
  BookOpen,
  Tag,
  Calendar,
  BarChart2,
  AlarmClock
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  end?: boolean;
  count?: number;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, end = false, count, onClick }) => {
  return (
    <li className="mb-1">
      <NavLink 
        to={to} 
        end={end}
        onClick={onClick}
        className={({ isActive }) => 
          `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
           ${isActive 
             ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`
        }
      >
        <span className="mr-3">{icon}</span>
        <span className="flex-1">{text}</span>
        {count !== undefined && (
          <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {count}
          </span>
        )}
      </NavLink>
    </li>
  );
};

interface SidebarGroupProps {
  label: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, icon, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        <span className="mr-3">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`mt-1 ml-2 pl-6 border-l border-gray-200 dark:border-gray-700 space-y-1 ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 flex-shrink-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Admin Dashboard</h1>
      </div>
      
      <nav className="space-y-2">
        <ul>
          <SidebarItem 
            to="/admin" 
            icon={<LayoutDashboard size={20} />} 
            text="Dashboard" 
            end 
          />
          
          <SidebarGroup 
            label="Content" 
            icon={<BookOpen size={20} />}
            defaultOpen={true}
          >
            <SidebarItem 
              to="/admin/posts" 
              icon={<FileText size={18} />} 
              text="Posts" 
            />
            <SidebarItem 
              to="/admin/posts/new" 
              icon={<PlusCircle size={18} />} 
              text="Create Post" 
            />
            <SidebarItem 
              to="/admin/scheduled-posts" 
              icon={<AlarmClock size={18} />} 
              text="Scheduled Posts" 
            />
            <SidebarItem 
              to="/admin/categories" 
              icon={<FolderClosed size={18} />} 
              text="Categories" 
            />
            <SidebarItem 
              to="/admin/tags" 
              icon={<Tag size={18} />} 
              text="Tags" 
            />
            <SidebarItem 
              to="/admin/events" 
              icon={<Calendar size={18} />} 
              text="Events" 
            />
          </SidebarGroup>
          
          <SidebarItem 
            to="/admin/media" 
            icon={<Image size={20} />} 
            text="Media Library" 
          />
          
          <SidebarItem 
            to="/admin/users" 
            icon={<Users size={20} />} 
            text="Users" 
          />
          
          <SidebarItem 
            to="/admin/analytics" 
            icon={<BarChart2 size={20} />} 
            text="Analytics" 
          />
          
          <SidebarGroup 
            label="Tools" 
            icon={<Settings size={20} />}
          >
            <SidebarItem 
              to="/admin/broken-links" 
              icon={<AlertTriangle size={18} />} 
              text="Broken Links" 
            />
            <SidebarItem 
              to="/admin/test-upload" 
              icon={<PlusCircle size={18} />} 
              text="Test Upload" 
            />
          </SidebarGroup>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="py-2 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium mr-2">
            A
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white">Admin User</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">admin@example.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
