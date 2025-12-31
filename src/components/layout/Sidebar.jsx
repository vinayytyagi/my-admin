'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  LayoutDashboard,
  Gift,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Briefcase,
  Megaphone,
  BookOpen,
  LogOut,
} from 'lucide-react'
import Image from 'next/image'

const Tooltip = ({ children, text }) => {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return children

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 8
    })
    setIsVisible(true)
  }

  return (
    <>
      <span
        className="inline-flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      {mounted && createPortal(
        isVisible && (
          <div
            className="fixed px-2 py-1 bg-gray-800 text-white text-xs rounded transition-all duration-200 whitespace-nowrap z-[9999]"
            style={{
              top: position.top,
              left: position.left,
              transform: 'translateY(-50%)'
            }}
          >
            {text}
          </div>
        ),
        document.body
      )}
    </>
  )
}

const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState(['products'])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setLoggingOut(false)
    }
  }

  const toggleExpand = (itemKey) => {
    setExpandedItems(prev =>
      prev.includes(itemKey)
        ? prev.filter(item => item !== itemKey)
        : [...prev, itemKey]
    )
  }

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev)
    if (!isCollapsed) {
      setExpandedItems([])
    } else {
      setExpandedItems(['products'])
    }
    document.documentElement.classList.toggle('sidebar-expanded', !isCollapsed)
  }

  useEffect(() => {
    document.documentElement.classList.toggle('sidebar-expanded', isCollapsed)
    return () => {
      document.documentElement.classList.remove('sidebar-expanded')
    }
  }, [])

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={17} color={pathname === '/dashboard' ? '#f97316' : '#153052'} />
    },
    {
      label: 'Home',
      key: 'home',
      icon: <LayoutDashboard size={17} color={pathname.startsWith('/home') ? '#f97316' : '#153052'} />,
      subItems: [
        {
          label: 'Hero',
          href: '/home/hero'
        },
        {
          label: 'Feature',
          href: '/home/feature'
        },
        {
          label: 'Feature Blogs',
          href: '/home/feature/blogs'
        },
        {
          label: 'Client',
          href: '/home/client'
        },
        {
          label: 'Contact',
          href: '/home/contact'
        }
      ]
    },
    {
      label: 'Blogs',
      href: '/blogs',
      icon: <FileText size={17} color={pathname === '/blogs' ? '#f97316' : '#153052'}  />
    },
    {
      label: 'Portfolio',
      href: '/portfolio',
      icon: <Briefcase size={17} color={pathname === '/portfolio' ? '#f97316' : '#153052'}  />
    },
    {
      label: "Services",
      href: "/services",
      icon: <BookOpen size={17} color={pathname.startsWith('/services') ? '#f97316' : '#153052'} />
    },
    {
      label: 'Sponsored Carousel',
      href: '/sponsored-carousel',
      icon: <Megaphone size={17} color={pathname === '/sponsored-carousel' ? '#f97316' : '#153052'} />
    },
    {
      label: 'Contact Requests',
      href: '/contact',
      icon: <User size={17} color={pathname === '/contact' ? '#f97316' : '#153052'} />
    },
  ]

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 group border px-2 hidden md:block ${isCollapsed ? 'w-16' : 'w-60'
        }`}
      style={{ zIndex: 40 }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute hidden -right-3 top-4 p-1.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
      >
        {isCollapsed ? (
          <ChevronRight size={14} className="text-gray-600" />
        ) : (
          <ChevronLeft size={14} className="text-gray-600" />
        )}
      </button>

      <div className='flex gap-x-2 items-center justify-center py-2 border-b border-dashed'>
        <Image
          src={'/xenotix.png'}
          width={30}
          height={30}
          alt=''
        />
        {!isCollapsed && (
          <p className='text-xl font-bold transition-all duration-150 ease-linear'>{"Xenotix Tech"}</p>
        )}
      </div>

      <nav className="flex flex-col items-center h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-4 px-2">
        <div className="flex-1 py-4 space-y-4">
          {menuItems.map((item) => (
            <div  key={item.href || item.key}>
              {item.subItems ? (
                <div className="space-y-2">
                  <button
                    onClick={() => !isCollapsed && toggleExpand(item.key)}
                    className={`w-full flex items-center text-sm font-bold transition-colors rounded-lg ${pathname.startsWith('/products')
                      ? 'text-orange-500 bg-gray-50'
                      : 'text-gray-600 hover:bg-gray-100'
                      } ${isCollapsed ? 'justify-center p-3' : 'px-6 py-3 justify-between'}`}
                  >
                    <div className="flex items-center justify-center min-w-0">
                      <Tooltip text={item.label}>
                        <span className={`inline-flex items-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
                      </Tooltip>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform flex-shrink-0 ${expandedItems.includes(item.key) ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </button>
                  {!isCollapsed && expandedItems.includes(item.key) && (
                    <div className="bg-gray-50 rounded  mt-1 w-full ">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center text-sm transition-colors rounded-lg ${pathname === subItem.href
                            ? 'text-orange-500 bg-gray-50'
                            : 'text-gray-600 hover:bg-gray-100'
                            } ${isCollapsed ? 'justify-center p-2.5' : 'px-6 py-2.5 justify-start'}`}
                        >
                          <div className="flex items-center">
                            <span className="truncate">{subItem.label}</span>
                            {subItem.beta && (
                              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded flex-shrink-0">
                                BETA
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center text-sm  font-medium transition-colors rounded ${pathname === item.href
                    ? 'text-orange-400 bg-gray-50'
                    : 'text-black hover:bg-gray-100'
                    } ${isCollapsed ? 'justify-center p-3' : 'px-6 py-2'}`
                  }
                  style={{
                    fontFamily: 'inherit'
                  }}
                >
                  <Tooltip text={item.label}>
                    <span className={`inline-flex items-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
                  </Tooltip>
                  {!isCollapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.beta && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded flex-shrink-0">
                          BETA
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>

        {!isCollapsed && (
          <div className="p-4 hidden">
            <div className="bg-[#4A332F] rounded-lg p-4 text-white cursor-pointer">
              <div className="flex items-center mb-2">
                <Gift size={20} fill="white" strokeWidth={0} className="mr-2" />
                <span className="font-medium">Join TagMango's Refer and Earn Program!</span>
              </div>
              <p className="text-sm text-gray-200">Refer others and earn rewards effortlessly.</p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-auto pb-4 px-2">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`w-full flex items-center text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg ${isCollapsed ? 'justify-center p-3' : 'px-6 py-2'} disabled:opacity-50`}
          >
            <Tooltip text="Logout">
              <span className={`inline-flex items-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                <LogOut size={17} />
              </span>
            </Tooltip>
            {!isCollapsed && <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>}
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
