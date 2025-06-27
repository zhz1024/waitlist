"use client"
import clsx from "clsx"
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, Sparkles, Send } from "lucide-react"
import { gsap } from "gsap"

type FormState = "idle" | "loading" | "success" | "error"

const questions = [
  {
    id: "email",
    type: "email" as const,
    label: "邮箱地址",
    placeholder: "请输入您的邮箱地址",
    required: true,
  },
  {
    id: "name",
    type: "text" as const,
    label: "姓名",
    placeholder: "请输入您的姓名",
    required: true,
  },
  {
    id: "company",
    type: "text" as const,
    label: "公司名称",
    placeholder: "请输入您的公司名称（可选）",
    required: false,
  },
]

export function SimpleForm() {
  const [state, setState] = useState<FormState>("idle")
  const [error, setError] = useState<string>()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const errorTimeout = useRef<NodeJS.Timeout | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state === "success" && successRef.current) {
      gsap.fromTo(
        successRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
      )
    }
  }, [state])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (state === "success" || state === "loading") return

    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current)
      setError(undefined)
      setState("idle")
    }

    // 验证必填字段
    const requiredFields = questions.filter((q) => q.required)
    for (const field of requiredFields) {
      if (!formData[field.id]) {
        setError(`请填写：${field.label}`)
        setState("error")
        errorTimeout.current = setTimeout(() => {
          setError(undefined)
          setState("idle")
        }, 3000)
        return
      }
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      setError("请输入有效的邮箱地址")
      setState("error")
      errorTimeout.current = setTimeout(() => {
        setError(undefined)
        setState("idle")
      }, 3000)
      return
    }

    try {
      setState("loading")

      // 模拟提交延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 在控制台输出表单数据（仅用于演示）
      console.log("表单提交数据:", formData)

      setState("success")
      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in",
        })
      }
    } catch (error) {
      setState("error")
      setError("提交失败，请稍后重试")
      console.error(error)
      errorTimeout.current = setTimeout(() => {
        setError(undefined)
        setState("idle")
      }, 3000)
    }
  }

  const updateFormData = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const resetForm = () => {
    setState("idle")
    setFormData({})
    setError(undefined)
    if (formRef.current && successRef.current) {
      gsap.set(formRef.current, { opacity: 1, y: 0 })
      gsap.set(successRef.current, { opacity: 0, scale: 0.8, y: 20 })
    }
  }

  const isSubmitted = state === "success"
  const isLoading = state === "loading"

  if (isSubmitted) {
    return (
      <div ref={successRef} className="flex flex-col items-center gap-6 p-8 text-center max-w-md mx-auto">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-12">提交成功！</h3>
          <p className="text-slate-10 text-sm leading-relaxed">
            感谢您的关注，我们已收到您的申请。我们会尽快与您联系，请留意您的邮箱。
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-9 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>申请已提交</span>
        </div>
        <button
          onClick={resetForm}
          className="text-sm text-slate-9 hover:text-slate-11 transition-colors duration-200 underline underline-offset-2"
        >
          提交另一个申请
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="space-y-2"
          style={{
            animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          <label className="block text-sm font-medium text-slate-12">
            {question.label}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <input
            type={question.type}
            name={question.id}
            placeholder={question.placeholder}
            value={formData[question.id] || ""}
            onChange={(e) => updateFormData(question.id, e.target.value)}
            disabled={isLoading}
            className={clsx(
              "w-full px-4 py-3 bg-white dark:bg-slate-2 border border-slate-200 dark:border-slate-6 rounded-xl text-slate-12 placeholder:text-slate-9",
              "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent",
              "transition-all duration-200 shadow-sm hover:shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className={clsx(
          "group relative w-full h-12 px-6 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 text-white dark:text-slate-900 text-sm rounded-xl font-medium overflow-hidden transition-all duration-300",
          "hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-200 dark:hover:to-slate-300 hover:shadow-lg hover:shadow-slate-900/25 hover:-translate-y-0.5",
          "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100",
        )}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>提交中...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span>提交申请</span>
            </>
          )}
        </div>
      </button>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      )}
    </form>
  )
}
