'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Settings,
  Gift,
  Trophy,
  CreditCard,
  ChevronDown,
  BookOpen,
  Users2,
  X,
  TrendingUp,
  Calendar,
  Globe,
  MousePointerClick,
  FileText
} from 'lucide-react'

const MobileSidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState(['products'])

  const toggleExpand = (itemKey) => {
    setExpandedItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(item => item !== itemKey)
        : [...prev, itemKey]
    )
  }
 
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={24} fill={pathname === '/dashboard' ? '#f97316' : '#153052'} strokeWidth={0} />
    },
    {
      label: 'Blogs',
      href: '/blogs',
      icon: <FileText size={24} fill={pathname === '/blogs' ? '#f97316' : '#153052'} strokeWidth={0} />
    },
  ]

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 pt-16 z-50 md:hidden">
        <button
          onClick={onClose}
          className="absolute right-2 top-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <nav className="flex flex-col items-center h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-4 px-2">
          <div className="flex-1 py-4 w-full">
            {menuItems.map((item) => (
              <div key={item.href || item.key}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.key)}
                      className={`w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition-colors rounded-lg ${
                        pathname.startsWith('/products')
                          ? 'text-orange-500 bg-orange-50'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-center min-w-0">
                        <span className="mr-3">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform flex-shrink-0 ${
                          expandedItems.includes(item.key) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedItems.includes(item.key) && (
                      <div className="pl-12 bg-gray-50 rounded-lg mt-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={onClose}
                            className={`flex items-center px-6 py-2.5 text-sm transition-colors rounded-lg ${
                              pathname === subItem.href
                                ? 'text-orange-500 bg-orange-50'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="mr-3">{subItem.icon}</span>
                            <span className="truncate">{subItem.label}</span>
                            {subItem.beta && (
                              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded flex-shrink-0">
                                BETA
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center px-6 py-3 text-sm font-bold transition-colors rounded-lg ${
                      pathname === item.href
                        ? 'text-orange-500 bg-orange-50'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                    {item.beta && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded flex-shrink-0">
                        BETA
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 w-full hidden">
            <div className="bg-[#4A332F] rounded-lg p-4 text-white cursor-pointer">
              <div className="flex items-center mb-2">
                <Gift size={20} fill="white" strokeWidth={0} className="mr-2" />
                <span className="font-medium">Join TagMango's Refer and Earn Program!</span>
              </div>
              <p className="text-sm text-gray-200">Refer others and earn rewards effortlessly.</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default MobileSidebar
