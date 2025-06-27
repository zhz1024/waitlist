import { WaitlistWrapper } from "@/components/box"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "我们的宣言",
  description: "了解我们的使命和愿景",
}

export default function ManifestoPage() {
  return (
    <WaitlistWrapper>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-slate-12">我们的宣言</h1>
          <p className="text-slate-10">我们的使命和愿景</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="space-y-6 text-slate-11">
            <p className="text-lg leading-relaxed">
              我们相信技术应该让生活变得更美好，而不是更复杂。我们致力于创造简单、优雅且强大的产品，帮助人们更好地工作和生活。
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-12">我们的价值观</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>简单至上：</strong>我们追求简洁的设计和直观的用户体验
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>用户第一：</strong>用户的需求和反馈是我们产品发展的核心驱动力
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>持续创新：</strong>我们不断探索新技术，为用户带来更好的体验
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>开放透明：</strong>我们与用户保持开放的沟通，倾听每一个声音
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-12">加入我们的旅程</h2>
              <p>
                我们正在构建一个令人兴奋的产品，希望您能成为我们早期用户社区的一员。
                您的参与和反馈将帮助我们打造更好的产品。
              </p>
            </div>
          </div>
        </div>
      </div>
    </WaitlistWrapper>
  )
}
