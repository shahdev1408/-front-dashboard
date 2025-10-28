'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  FolderOpen,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Learners', href: '/learners', icon: Users },
  { name: 'SME Management', href: '/smes', icon: GraduationCap },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Content Library', href: '/library', icon: FolderOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative shadow-lg ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-10 w-6 h-6 rounded-full bg-linear-to-r from-cyan-500 to-blue-400 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo */}
      <div
        className={`p-6 border-b border-gray-200 h-[89px] flex items-center ${
          collapsed ? 'px-3 py-6 justify-center' : ''
        }`}
      >
        {collapsed ? (
          <Image
            src="/logo-icon.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain transition-all duration-300 drop-shadow-md"
          />
        ) : (
          <Image
            src="/logo_orantsai.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain transition-all duration-300 drop-shadow-md"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative hover:bg-blue-50/50 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-50 to-blue-100 text-blue-700 shadow-sm before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-linear-to-b before:from-cyan-500 before:to-blue-400'
                  : 'text-gray-500 hover:text-gray-900'
              } ${collapsed ? 'justify-center px-3' : ''}`}
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 flex-shrink-0 ${
                  isActive ? 'text-cyan-500 scale-110' : 'group-hover:scale-110'
                }`}
              />
              {!collapsed && (
                <span
                  className={`relative ${
                    isActive ? 'font-semibold text-cyan-500' : ''
                  }`}
                >
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={`p-4 border-t border-gray-200 ${collapsed ? 'px-3' : ''}`}>
        {!collapsed ? (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-cyan-500 to-blue-400 flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john@learnhub.com</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-cyan-500 to-blue-400 flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
