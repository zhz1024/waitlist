import { basehub } from "basehub"
import { NetlifyForm } from "@/components/netlify-form"
import { WaitlistWrapper } from "@/components/box"
import type { Metadata } from "next"
import "../basehub.config"

export const dynamic = "force-static"
export const revalidate = 30

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await basehub().query({
    settings: {
      metadata: {
        titleTemplate: true,
        defaultTitle: true,
        defaultDescription: true,
        favicon: {
          url: true,
        },
        ogImage: {
          url: true,
        },
      },
    },
  })
  return {
    title: {
      template: data.settings.metadata.titleTemplate,
      default: data.settings.metadata.defaultTitle,
    },
    description: data.settings.metadata.defaultDescription,
    openGraph: {
      type: "website",
      images: [data.settings.metadata.ogImage.url],
    },
    twitter: {
      card: "summary_large_image",
      images: [data.settings.metadata.ogImage.url],
    },
    icons: [data.settings.metadata.favicon.url],
  }
}

export default async function Home() {
  return (
    <WaitlistWrapper>
      {/* 标题 */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-medium text-slate-12 whitespace-pre-wrap text-pretty">
          加入我们的候补名单
        </h1>
        <div className="text-slate-10 [&>p]:tracking-tight text-pretty">
          <p>成为第一批体验我们产品的用户，获得独家访问权限和特别优惠。</p>
        </div>
      </div>
      {/* 表单 */}
      <div className="px-1 flex flex-col w-full self-stretch">
        <NetlifyForm />
      </div>
    </WaitlistWrapper>
  )
}
