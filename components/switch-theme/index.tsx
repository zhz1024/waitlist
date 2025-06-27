"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import clsx from "clsx"
import { Moon, Sun, Monitor } from "lucide-react"
import { gsap } from "gsap"

const options = [
  { value: "light", label: "浅色", icon: Sun },
  { value: "system", label: "系统", icon: Monitor },
  { value: "dark", label: "深色", icon: Moon },
] as const

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const sliderRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const iconsRef = React.useRef<(HTMLElement | null)[]>([])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted || !sliderRef.current) return

    const activeIndex = options.findIndex((opt) => opt.value === theme)
    if (activeIndex === -1) return

    // GSAP 动画：滑块移动
    gsap.to(sliderRef.current, {
      x: `${activeIndex * 100}%`,
      duration: 0.4,
      ease: "power2.out",
    })

    // GSAP 动画：图标旋转和缩放
    iconsRef.current.forEach((icon, index) => {
      if (!icon) return

      const isActive = index === activeIndex

      gsap.to(icon, {
        scale: isActive ? 1.1 : 1,
        rotation: isActive ? 0 : 0, // 修复倾斜问题，所有图标都不旋转
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    })

    // 主题切换时的全局动画
    if (typeof document !== "undefined") {
      gsap.to(document.documentElement, {
        duration: 0.5,
        ease: "power2.out",
        onStart: () => {
          document.documentElement.style.transition = "none"
        },
        onComplete: () => {
          document.documentElement.style.transition = ""
        },
      })
    }
  }, [theme, mounted])

  if (!mounted) {
    return (
      <div className={clsx(className, "flex gap-1 opacity-0")}>
        <div className="w-32 h-8 bg-slate-3 rounded-full animate-pulse" />
      </div>
    )
  }

  const handleThemeChange = (newTheme: string) => {
    const button = document.activeElement as HTMLElement

    // 按钮点击动画
    if (button) {
      gsap.to(button, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      })
    }

    setTheme(newTheme)
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        className,
        "relative flex items-center bg-gradient-to-r from-slate-2 to-slate-3 rounded-full p-1 shadow-inner border border-slate-4/50",
      )}
    >
      {/* 背景滑块 */}
      <div
        ref={sliderRef}
        className={clsx(
          "absolute top-1 bottom-1 bg-gradient-to-r from-slate-12 to-slate-11 rounded-full shadow-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:rounded-full",
        )}
        style={{
          width: `calc(${100 / options.length}% - 4px)`,
          left: "2px",
        }}
      />

      {options.map((option, index) => {
        const Icon = option.icon
        const isActive = theme === option.value

        return (
          <button
            key={option.value}
            className={clsx(
              "relative z-10 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full min-w-[70px] transition-colors duration-200",
              isActive ? "text-slate-1 font-semibold" : "text-slate-10 hover:text-slate-12",
            )}
            onClick={() => handleThemeChange(option.value)}
          >
            <Icon ref={(el) => (iconsRef.current[index] = el)} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline tracking-wide">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
