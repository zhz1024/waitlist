"use client"
import clsx from "clsx"
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, ChevronDown, Sparkles, Send } from "lucide-react"
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
  {
    id: "role",
    type: "select" as const,
    label: "您的职位",
    required: true,
    options: [
      { value: "", label: "请选择您的职位" },
      { value: "developer", label: "开发者" },
      { value: "designer", label: "设计师" },
      { value: "product-manager", label: "产品经理" },
      { value: "founder", label: "创始人/CEO" },
      { value: "marketing", label: "市场营销" },
      { value: "other", label: "其他" },
    ],
  },
  {
    id: "interests",
    type: "checkbox" as const,
    label: "您对哪些功能感兴趣？（可多选）",
    required: false,
    options: [
      { value: "ai-tools", label: "AI 工具" },
      { value: "automation", label: "自动化功能" },
      { value: "analytics", label: "数据分析" },
      { value: "collaboration", label: "团队协作" },
      { value: "integration", label: "第三方集成" },
    ],
  },
  {
    id: "usage",
    type: "radio" as const,
    label: "您计划如何使用我们的产品？",
    required: true,
    options: [
      { value: "personal", label: "个人使用" },
      { value: "team", label: "团队使用（5-20人）" },
      { value: "enterprise", label: "企业使用（20人以上）" },
    ],
  },
  {
    id: "feedback",
    type: "textarea" as const,
    label: "其他建议或期望",
    placeholder: "请告诉我们您的想法或建议（可选）",
    required: false,
  },
]

export function NetlifyForm() {
  const [state, setState] = useState<FormState>("idle")
  const [error, setError] = useState<string>()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const errorTimeout = useRef<NodeJS.Timeout | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  // 移除自动恢复逻辑，保持在成功页面
  useEffect(() => {
    if (state === "success" && successRef.current) {
      // 成功页面动画
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
      if (!formData[field.id] || (Array.isArray(formData[field.id]) && formData[field.id].length === 0)) {
        setError(`请填写：${field.label}`)
        setState("error")
        errorTimeout.current = setTimeout(() => {
          setError(undefined)
          setState("idle")
        }, 3000)
        return
      }
    }

    try {
      setState("loading")

      // 构建 Netlify 表单数据
      const netlifyFormData = new FormData()
      netlifyFormData.append("form-name", "waitlist")

      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          netlifyFormData.append(key, value.join(", "))
        } else {
          netlifyFormData.append(key, value || "")
        }
      })

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(netlifyFormData as any).toString(),
      })

      if (response.ok) {
        setState("success")
        // 表单提交成功动画
        if (formRef.current) {
          gsap.to(formRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: "power2.in",
          })
        }
      } else {
        throw new Error("提交失败")
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

  const isSubmitted = state === "success"
  const isLoading = state === "loading"

  if (isSubmitted) {
    return (
      <div ref={successRef} className="flex flex-col items-center gap-6 p-8 text-center">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-12 bg-gradient-to-r from-slate-12 to-slate-10 bg-clip-text">
            提交成功！
          </h3>
          <p className="text-slate-10 max-w-sm">
            感谢您的关注，我们已收到您的申请。我们会尽快与您联系，请留意您的邮箱。
          </p>
        </div>
        <div className="flex gap-2 text-xs text-slate-9">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>申请已提交</span>
        </div>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      name="waitlist"
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
      className="space-y-6 w-full"
    >
      <input type="hidden" name="form-name" value="waitlist" />

      {questions.map((question, index) => (
        <div
          key={question.id}
          className="space-y-3"
          style={{
            animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          <label className="block text-sm font-medium text-slate-12">
            {question.label}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <FormField
            question={question}
            value={formData[question.id]}
            onChange={(value) => updateFormData(question.id, value)}
            disabled={isLoading}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className={clsx(
          "group relative w-full h-12 px-6 bg-gradient-to-r from-slate-12 to-slate-11 text-slate-1 text-sm rounded-xl font-medium overflow-hidden transition-all duration-300",
          "hover:from-slate-11 hover:to-slate-10 hover:shadow-lg hover:shadow-slate-12/25 hover:-translate-y-0.5",
          "focus:outline-none focus:ring-2 focus:ring-slate-8 focus:ring-offset-2",
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}
    </form>
  )
}

function FormField({
  question,
  value,
  onChange,
  disabled,
}: {
  question: (typeof questions)[0]
  value: any
  onChange: (value: any) => void
  disabled: boolean
}) {
  const fieldRef = useRef<HTMLElement>(null)

  const handleFocus = () => {
    if (fieldRef.current) {
      gsap.to(fieldRef.current, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out",
      })
    }
  }

  const handleBlur = () => {
    if (fieldRef.current) {
      gsap.to(fieldRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      })
    }
  }

  switch (question.type) {
    case "text":
    case "email":
      return (
        <input
          ref={fieldRef as React.RefObject<HTMLInputElement>}
          type={question.type}
          name={question.id}
          placeholder={question.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={clsx(
            "w-full px-4 py-3 bg-gradient-to-r from-slate-1 to-slate-2 border border-slate-6 rounded-xl text-slate-12 placeholder:text-slate-9",
            "focus:outline-none focus:ring-2 focus:ring-slate-8 focus:border-transparent focus:bg-slate-1",
            "transition-all duration-200 shadow-sm hover:shadow-md",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        />
      )

    case "textarea":
      return (
        <textarea
          ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
          name={question.id}
          placeholder={question.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          rows={4}
          className={clsx(
            "w-full px-4 py-3 bg-gradient-to-r from-slate-1 to-slate-2 border border-slate-6 rounded-xl text-slate-12 placeholder:text-slate-9 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-slate-8 focus:border-transparent focus:bg-slate-1",
            "transition-all duration-200 shadow-sm hover:shadow-md",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        />
      )

    case "select":
      return (
        <div className="relative">
          <select
            ref={fieldRef as React.RefObject<HTMLSelectElement>}
            name={question.id}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={clsx(
              "w-full px-4 py-3 bg-gradient-to-r from-slate-1 to-slate-2 border border-slate-6 rounded-xl text-slate-12 appearance-none cursor-pointer pr-10",
              "focus:outline-none focus:ring-2 focus:ring-slate-8 focus:border-transparent focus:bg-slate-1",
              "transition-all duration-200 shadow-sm hover:shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-9 pointer-events-none transition-transform duration-200" />
        </div>
      )

    case "radio":
      return (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  className="sr-only"
                />
                <div
                  className={clsx(
                    "w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                    value === option.value
                      ? "border-slate-12 bg-slate-12"
                      : "border-slate-6 bg-slate-1 group-hover:border-slate-8",
                  )}
                >
                  {value === option.value && <div className="w-2 h-2 rounded-full bg-slate-1" />}
                </div>
              </div>
              <span className="text-sm text-slate-11 group-hover:text-slate-12 transition-colors duration-200">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )

    case "checkbox":
      return (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  name={`${question.id}[]`}
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      onChange([...currentValues, option.value])
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option.value))
                    }
                  }}
                  disabled={disabled}
                  className="sr-only"
                />
                <div
                  className={clsx(
                    "w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
                    Array.isArray(value) && value.includes(option.value)
                      ? "border-slate-12 bg-slate-12"
                      : "border-slate-6 bg-slate-1 group-hover:border-slate-8",
                  )}
                >
                  {Array.isArray(value) && value.includes(option.value) && <Check className="w-3 h-3 text-slate-1" />}
                </div>
              </div>
              <span className="text-sm text-slate-11 group-hover:text-slate-12 transition-colors duration-200">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )

    default:
      return null
  }
}
