export default function JsonLd() {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NeiLink",
    alternateName: "NeiLink 轻连",
    description:
      "面向个人用户的跨平台局域网文件分享工具，专注在本地网络中快速、安全地分享文件",
    url: "https://github.com/Qiyao-sudo/NeiLink",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: ["Windows", "macOS", "Linux"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
    license: "https://opensource.org/licenses/MIT",
    programmingLanguage: "TypeScript",
    featureList: [
      "文件/文件夹分享",
      "AES-256-CBC加密",
      "文件码系统",
      "跨设备访问",
      "访问控制",
      "断点续传",
      "热点功能",
    ],
    securityFeature: [
      "AES-256-CBC端到端加密",
      "提取码验证",
      "访问控制",
      "有效期设置",
    ],
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NeiLink",
    url: "https://github.com/Qiyao-sudo/NeiLink",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "NeiLink 需要联网吗？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不需要。NeiLink 完全在局域网内运行，无需互联网连接。即使在断网环境下，也可以通过热点模式进行文件传输。",
        },
      },
      {
        "@type": "Question",
        name: "传输的文件安全吗？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NeiLink 支持 AES-256-CBC 端到端加密，你可以为每个分享设置提取码、有效期和下载次数限制，确保文件只被授权人员访问。",
        },
      },
      {
        "@type": "Question",
        name: "接收方需要安装 NeiLink 吗？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不需要。接收方只需在浏览器中打开分享链接即可下载文件，无需安装任何软件。",
        },
      },
      {
        "@type": "Question",
        name: "支持传输多大的文件？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NeiLink 没有文件大小限制，传输速度取决于你的局域网带宽。同时支持断点续传，大文件也能稳定传输。",
        },
      },
      {
        "@type": "Question",
        name: "支持哪些操作系统？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "目前支持 Windows、macOS 和 Linux 三大桌面操作系统。接收方使用浏览器访问，因此手机、平板等设备也可以接收文件。",
        },
      },
      {
        "@type": "Question",
        name: "NeiLink 是免费的吗？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "是的，NeiLink 完全免费开源，采用 MIT 协议。你可以在 GitHub 上查看源码，也欢迎贡献代码。",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplication),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faq),
        }}
      />
    </>
  );
}
