import { SimpleForm } from "@/components/simple-form"
import { WaitlistWrapper } from "@/components/box"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "加入候补名单 - 我们的产品",
  description: "成为第一批体验我们产品的用户，获得独家访问权限和特别优惠。",
  openGraph: {
    type: "website",
    title: "加入候补名单 - 我们的产品",
    description: "成为第一批体验我们产品的用户，获得独家访问权限和特别优惠。",
  },
  twitter: {
    card: "summary_large_image",
    title: "加入候补名单 - 我们的产品",
    description: "成为第一批体验我们产品的用户，获得独家访问权限和特别优惠。",
  },
}

export default function Home() {
  return (
    <WaitlistWrapper>
      {/* 标题 */}
      <div className="space-y-1 text-center">
        <h1 className="text-2xl sm:text-3xl font-medium text-slate-12 whitespace-pre-wrap text-pretty">
          加入我们的候补名单
        </h1>
        <div className="text-slate-10 [&>p]:tracking-tight text-pretty">
          <p>成为第一批体验我们产品的用户，获得独家访问权限和特别优惠。</p>
        </div>
      </div>
      {/* 表单 */}
      <div className="px-1 flex flex-col w-full self-stretch">
        <SimpleForm />
      </div>
    </WaitlistWrapper>
  )
}
