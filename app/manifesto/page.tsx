import { basehub } from "basehub"
import { WaitlistWrapper } from "@/components/box"
import { Alex_Brush } from "next/font/google"
import clsx from "clsx"
import type { Metadata } from "next"
import "../../basehub.config"

const font = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: "400",
})

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

export default async function Manifesto() {
  return (
    <WaitlistWrapper>
      <div className="flex flex-col gap-10">
        <div className="text-slate-11 [&>p]:tracking-tight [&>p]:leading-[1.6] [&>p:not(:last-child)]:mb-3 text-pretty text-start">
          <p>我们相信技术应该让生活更美好，而不是更复杂。</p>
          <p>在这个快速变化的数字时代，我们致力于创造简单、优雅且强大的解决方案，帮助个人和团队实现他们的目标。</p>
          <p>我们的使命是通过创新的产品和服务，让每个人都能轻松地将想法转化为现实。</p>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-0.5 items-start">
            <p className={clsx("text-slate-12 text-4xl font-medium italic transform -rotate-12", font.className)}>
              团队签名
            </p>
            <p className="text-slate-11 text-sm font-medium">
              产品团队 <span className="text-slate-10 text-xs">创始人</span>
            </p>
          </div>
        </div>
      </div>
    </WaitlistWrapper>
  )
}
