"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

// NavbarLink component
export const NavbarLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const linkRef = useRef<HTMLAnchorElement>(null)
  const isActive = pathname === href

  useEffect(() => {
    if (!linkRef.current) return

    if (isActive) {
      gsap.to(linkRef.current, {
        scale: 1.05,
        fontWeight: 600,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    } else {
      gsap.to(linkRef.current, {
        scale: 1,
        fontWeight: 500,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [isActive])

  const handleMouseEnter = () => {
    if (!isActive && linkRef.current) {
      gsap.to(linkRef.current, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out",
      })
    }
  }

  const handleMouseLeave = () => {
    if (!isActive && linkRef.current) {
      gsap.to(linkRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      })
    }
  }

  return (
    <Link
      ref={linkRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "relative text-sm py-1 px-3 text-slate-12 w-[90px] flex items-center justify-center rounded-full transition-opacity duration-200",
        isActive ? "opacity-100" : "opacity-30 hover:opacity-60",
      )}
    >
      {children}
    </Link>
  )
}

// NavbarLinkBackground component
export const NavbarLinkBackground = ({ links }: { links: string[] }) => {
  const pathname = usePathname()
  const activeIndex = links.indexOf(pathname)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bgRef.current) return

    gsap.to(bgRef.current, {
      x: `calc(${activeIndex} * 90px)`,
      opacity: activeIndex >= 0 ? 1 : 0,
      scale: activeIndex >= 0 ? 1 : 0.8,
      duration: 0.4,
      ease: "back.out(1.7)",
    })
  }, [activeIndex])

  return <div ref={bgRef} className="absolute top-1 bottom-1 w-[82px] left-1 bg-slate-3 rounded-full shadow-sm" />
}
