import type { Translations } from "./types";

const en: Translations = {
  nav: {
    home: "Home",
    features: "Features",
    security: "Security",
    liveDemo: "Live Demo",
    comparison: "Comparison",
    changelog: "Changelog",
    download: "Download",
    subtitle: "NeiLink",
    skipToContent: "Skip to main content",
    downloadBtn: "Download",
    ariaLabel: "Main navigation",
  },
  hero: {
    badge: "A New LAN File Transfer Experience",
    badgeFast: "Blazing Fast",
    badgeEncrypted: "E2E Encrypted",
    badgeOffline: "No Internet Needed",
    titleLine1: "Lightning-Fast",
    titleLine2: "LAN Sharing",
    animatedSubtitle: "Making LAN File Sharing Simpler",
    subtitle: "Cross-platform LAN file sharing tool for personal users",
    subtitleLine2: "Focus on fast, secure file sharing in local networks",
    cta: "Download Now",
    ctaSecondary: "View Repository",
    version: "Supports Windows · macOS · Linux",
    scrollDown: "Explore More",
  },
  scrollVelocity: {
    text: "Blazing Fast · E2E Encrypted · Zero Config · Open Source · Cross-Platform · LAN First · Resume Transfer · Access Code · No Internet · Browser Receive",
  },
  features: {
    badge: "Features",
    title1: "Powerful Features",
    title2: ", Simple to Use",
    description:
      "From file encryption to hotspot adaptation, NeiLink provides a complete solution for LAN file transfer",
    learnMore: "Learn More",
    items: [
      {
        title: "File & Folder Sharing",
        description:
          "Drag & drop, right-click share, automatic folder packing, one-click sharing",
        stat: "Drag Share",
      },
      {
        title: "AES-256-CBC Encryption",
        description:
          "End-to-end encryption protects sensitive files, ensuring data security during transfer",
        stat: "AES-256",
      },
      {
        title: "File Code System",
        description:
          "Quickly locate and download files via file codes — simple and efficient",
        stat: "File Code",
      },
      {
        title: "Cross-Device Access",
        description:
          "PC, phone and other devices can access directly via browser — no installation needed on receiver",
        stat: "0 Install",
      },
      {
        title: "Access Control",
        description:
          "Set access codes, expiration, and max download counts for flexible sharing permissions",
        stat: "Access Code",
      },
      {
        title: "Share Management",
        description:
          "Real-time share status, download statistics, and batch operation management",
        stat: "Live Monitor",
      },
      {
        title: "Hotspot Feature",
        description:
          "Built-in hotspot creation for AP isolation and special network environments — transfer even offline",
        stat: "Hotspot",
      },
      {
        title: "Resume Transfer",
        description:
          "Supports large file resume — network fluctuations won't affect your download experience",
        stat: "Resume",
      },
    ],
    stats: [
      { label: "Encryption Standard" },
      { label: "Supported Platforms" },
      { label: "Internet Required" },
      { label: "File Size Limit" },
    ],
  },
  howItWorks: {
    badge: "How It Works",
    title1: "Four Steps,",
    title2: "Lightning Transfer",
    description: "From selecting files to completing transfer — simple, efficient, no complex setup",
    steps: [
      {
        title: "Select File",
        description:
          "Click the 'Select File' button or drag files/folders to the interface — batch adding supported",
        detail: "Drag & Drop · Right-Click Share · Auto Pack",
      },
      {
        title: "Configure Share",
        description:
          "Set access code, expiration, download count and other options, then click 'Start Sharing'",
        detail: "Access Code · Expiry · Download Limit",
      },
      {
        title: "Send Link",
        description:
          "Copy the generated share link and send it — recipients can download via browser",
        detail: "One-Click Copy · Browser Access · No Install",
      },
      {
        title: "Complete Transfer",
        description:
          "Recipients enter the access code and download — resume supported for stable large file transfers",
        detail: "Resume Transfer · Real-time Monitor · Traffic Stats",
      },
    ],
    stepLabel: "Step",
    completed: "Done",
    flowLabels: {
      sender: "Sender",
      lan: "LAN",
      browser: "Browser",
      receiver: "Receiver",
    },
    flowDemo: {
      title: "Transfer Flow Demo",
      sender: "Sender",
      lan: "LAN",
      receiver: "Receiver",
    },
  },
  security: {
    badge: "Security",
    title1: "Data Security,",
    title2: "Full Control",
    description:
      "AES-256 end-to-end encryption with multi-layer access control makes your file transfer rock solid",
    items: [
      {
        title: "AES-256-CBC Encryption",
        description:
          "Industry-standard encryption algorithm with end-to-end protection for transferred data",
      },
      {
        title: "Access Code Verification",
        description:
          "Optional access codes ensure only authorized users can download files",
      },
      {
        title: "Expiration Control",
        description:
          "Set validity period for share links — auto-expire when time's up",
      },
      {
        title: "Download Count Limit",
        description:
          "Limit maximum downloads to prevent unrestricted file distribution",
      },
      {
        title: "Real-time Monitoring",
        description:
          "Detailed logging and traffic statistics — all operations traceable",
      },
      {
        title: "Local Transfer",
        description:
          "Data stays within the LAN — never uploaded to any cloud server",
      },
    ],
    encryption: "Same standard as bank-grade encryption, ensuring data transfer security",
  },
  trust: {
    badge: "Trusted",
    title1: "Trusted by",
    title2: "Thousands",
    description: "Secure, fast, reliable — the numbers speak for themselves",
    stars: "Stars",
    starsFallback: "Open Source & Free",
    speed: "LAN Transfer Speed",
    leaks: "Data Breaches",
    loading: "Loading…",
    badges: [
      { aes: "AES-256 Encryption" },
      { openSource: "Open Source" },
      { local: "Local Transfer" },
      { zeroLeak: "Zero Breaches" },
    ],
    quote:
      "NeiLink has made sharing files with colleagues simpler than ever — no more USB drives back and forth.",
    quoteAttribution: "— Early User Feedback",
    mitLicense: "MIT License",
    version: "v1.0.0",
  },
  crossPlatform: {
    badge: "Cross-Platform",
    title1: "One Link,",
    title2: "All Platforms",
    description:
      "Covers Windows, macOS, and Linux desktop systems, with browser access for all receiving devices",
    devices: [
      { name: "Windows", desc: "Win 7+ supported" },
      { name: "macOS", desc: "Intel & Apple Silicon" },
      { name: "Linux", desc: "Major distros covered" },
    ],
    browserDevices: [
      { name: "Phone Browser" },
      { name: "Tablet Browser" },
      { name: "Any Browser" },
    ],
    networkFeatures: [
      { title: "Auto LAN Detection", desc: "Automatically identifies Wi-Fi, Ethernet, and other network environments — no manual configuration" },
      { title: "Hotspot Mode", desc: "Automatically starts hotspot when offline — supports file transfer in AP isolation scenarios" },
      { title: "Reconnection", desc: "Auto-updates share link IP when network recovers, keeping share configuration intact" },
    ],
    centerLabel: "LAN Hub",
    receiveNote:
      "Phones and tablets can receive via browser — no app installation needed",
  },
  architecture: {
    badge: "Architecture",
    title1: "Network Topology",
    title2: ", At a Glance",
    description: "From sender encryption to receiver decryption, data flows securely within the LAN — fully visible and under control",
    steps: [
      {
        title: "Device Discovery",
        description: "Automatically scans for available devices on the LAN",
      },
      {
        title: "Secure Handshake",
        description: "Establishes an AES-256 encrypted channel",
      },
      {
        title: "Data Transfer",
        description: "Peer-to-peer high-speed file data transfer",
      },
      {
        title: "Integrity Check",
        description: "Verifies file integrity to ensure lossless transfer",
      },
    ],
    sender: "Sender",
    receiver: "Receiver",
    router: "Router",
    server: "NeiLink Server",
    encrypted: "Encrypted",
    unencrypted: "Unencrypted",
    lanDistribution: "LAN Distribution",
    stepLabels: ["Select File", "E2E Encryption", "LAN Transfer", "Browser Receive"],
    senderSublabel: "Select File → Encrypt → Upload",
    serverSublabel: "Route · Distribute · Access Control",
    receiverSublabel: "Browser Open → Download → Decrypt",
    encryptionHoverTitle: "AES-256-CBC E2E Encryption",
    encryptionHoverDetail: "Access Code · Access Control · Expiration",
    featureCards: [
      { title: "E2E Encryption", description: "AES-256-CBC encryption algorithm ensures data transfer security" },
      { title: "LAN Direct", description: "Data never goes through the public internet — speeds up to 50MB/s" },
      { title: "Zero Install", description: "Recipients simply open the link in a browser to download" },
    ],
  },
  comparison: {
    badge: "Comparison",
    title1: "Clear Advantages",
    title2: ", At a Glance",
    description:
      "Comprehensive comparison with traditional transfer methods — NeiLink leads in speed, convenience, and security",
    tabSpeed: "Speed Comparison",
    tabFeatures: "Feature Comparison",
    statBadges: [
      { label: "50MB/s" },
      { label: "AES-256" },
      { label: "0 Dependencies" },
    ],
    barMethods: [
      {
        name: "NeiLink",
        descriptions: {
          speed: "LAN bandwidth",
          ease: "One-click share",
          security: "AES-256 encrypted",
          noLimit: "No file size limit",
          noNetwork: "No internet required",
        },
        tooltips: {
          speed: "NeiLink: 50MB/s",
          ease: "NeiLink: 95/100",
          security: "NeiLink: AES-256",
          noLimit: "NeiLink: No limit",
          noNetwork: "NeiLink: No internet needed",
        },
      },
      {
        name: "USB Drive",
        descriptions: {
          speed: "Limited by interface speed",
          ease: "Plug/browse hassle",
          security: "Physical access risk",
          noLimit: "Capacity limited",
          noNetwork: "No internet required",
        },
        tooltips: {
          speed: "USB: ~15MB/s",
          ease: "USB: 30/100",
          security: "USB: Physical contact",
          noLimit: "USB: Capacity limited",
          noNetwork: "USB: No internet needed",
        },
      },
      {
        name: "Cloud Storage",
        descriptions: {
          speed: "Throttled by internet",
          ease: "Upload + download steps",
          security: "Data via third party",
          noLimit: "Capacity/plan limited",
          noNetwork: "Internet required",
        },
        tooltips: {
          speed: "Cloud: ~3MB/s",
          ease: "Cloud: 40/100",
          security: "Cloud: Third-party storage",
          noLimit: "Cloud: Plan limited",
          noNetwork: "Cloud: Internet required",
        },
      },
      {
        name: "Chat App",
        descriptions: {
          speed: "Throttled by internet",
          ease: "Send + receive",
          security: "Relayed via server",
          noLimit: "Explicit size limit",
          noNetwork: "Internet required",
        },
        tooltips: {
          speed: "Chat: ~2MB/s",
          ease: "Chat: 60/100",
          security: "Chat: Server relay",
          noLimit: "Chat: Size limit",
          noNetwork: "Chat: Internet required",
        },
      },
    ],
    metricLabels: {
      speed: "Transfer Speed",
      ease: "Ease of Use",
      security: "Security",
      noLimit: "File Limits",
      noNetwork: "No Internet Required",
    },
    featureNames: [
      "LAN Transfer",
      "E2E Encryption",
      "Cross-Platform",
      "No Installation",
      "Large File Support",
      "Resume Transfer",
      "Access Control",
      "Open Source & Free",
    ],
    matrixToolLabels: {
      neilink: "NeiLink",
      airdrop: "AirDrop",
      wechat: "WeChat Transfer",
      email: "Email Attachment",
      usb: "USB Drive",
    },
    calculator: {
      title: "Transfer Time Calculator",
      subtitle: "Enter file size to compare transfer times in real time",
      sizeLabel: "File Size:",
      timeLabel: "Estimated Time",
      methods: [
        { name: "NeiLink", speed: "50 MB/s" },
        { name: "USB Drive", speed: "15 MB/s" },
        { name: "Cloud Storage", speed: "3 MB/s" },
        { name: "Chat App", speed: "2 MB/s" },
      ],
      timeUnits: {
        lessThanSecond: "< 1 sec",
        second: "sec",
        minute: "min",
        hour: "hr",
      },
      bottomNote: "NeiLink LAN transfer speed is approximately 50 MB/s — actual speed depends on network conditions",
    },
    table: {
      feature: "Feature",
      neilink: "NeiLink",
      usb: "USB Drive",
      cloud: "Cloud Storage",
      chat: "Chat App",
    },
  },
  screenshots: {
    badge: "Preview",
    title1: "Carefully Crafted",
    title2: ", Simple & Efficient",
    description:
      "Every interface is carefully polished, making file sharing easier than ever",
    items: [
      { title: "Main Interface", desc: "Clean and intuitive — clear at a glance", badge: "Core" },
      { title: "Share Settings", desc: "Flexible sharing options — share with one click" },
      { title: "Share Management", desc: "Real-time share status and download stats" },
      { title: "Traffic Stats", desc: "Monitor share traffic and network usage in real time" },
      { title: "Settings", desc: "Network adapter, hotspot config, and other preferences" },
      { title: "Share Webpage", desc: "Receiver accesses download page directly in browser", badge: "No Install" },
    ],
    mockups: {
      sidebar: ["Main", "Shares", "Logs", "Traffic", "Settings"],
      main: {
        dragHint: "Drag files here, or click to select",
        selectFile: "Select File",
      },
      share: {
        accessCode: "Access Code",
        expiry: "Expiry",
        downloadCount: "Downloads",
        unlimited: "Unlimited",
        hours: "24 hours",
        shareLink: "Share Link",
        copy: "Copy",
      },
      manage: {
        downloads: "downloads",
        active: "Active",
        expired: "Expired",
      },
      stats: {
        totalUpload: "Total Upload",
        totalDownload: "Total Download",
        activeShares: "Active Shares",
        totalDownloads: "Total Downloads",
      },
      settings: {
        networkAdapter: "Network Adapter",
        servicePort: "Service Port",
        autoHotspot: "Auto Hotspot",
        autoStart: "Auto Start",
        off: "Off",
        on: "On",
      },
      web: {
        fileShare: "NeiLink File Share",
        accessCode: "Access Code",
        downloadFile: "Download File",
      },
    },
    lightbox: {
      close: "Close",
      prev: "Previous",
      next: "Next",
    },
    viewLarge: "View Large",
    autoPlay: "Auto Play",
    pausePlay: "Pause",
    switchTo: "Switch to",
  },
  faq: {
    badge: "FAQ",
    title1: "Questions?",
    title2: "Answers Here",
    description: "Most frequently asked questions about NeiLink",
    items: [
      {
        question: "Does NeiLink require internet?",
        answer:
          "No. NeiLink runs entirely within your local network — no internet connection needed. Even in offline environments, you can transfer files via hotspot mode.",
      },
      {
        question: "Are transferred files secure?",
        answer:
          "NeiLink supports AES-256-CBC end-to-end encryption. You can set access codes, expiration, and download limits for each share, ensuring only authorized users can access your files.",
      },
      {
        question: "Does the receiver need to install NeiLink?",
        answer:
          "No. The receiver simply opens the share link in a browser to download the file — no software installation required.",
      },
      {
        question: "What's the maximum file size?",
        answer:
          "NeiLink has no file size limit — transfer speed depends on your LAN bandwidth. Resume is also supported for stable large file transfers.",
      },
      {
        question: "Which operating systems are supported?",
        answer:
          "Currently supports Windows, macOS, and Linux desktop operating systems. Receivers use a browser, so phones and tablets can also receive files.",
      },
      {
        question: "Is NeiLink free?",
        answer:
          "Yes, NeiLink is completely free and open source under the MIT license. You can view the source code on GitHub — contributions are welcome.",
      },
    ],
  },
  changelog: {
    badge: "Changelog",
    title1: "Version Evolution",
    title2: ", Continuous Iteration",
    description: "We constantly refine every detail of NeiLink, making LAN file sharing safer and more efficient",
    versions: [
      {
        version: "v1.2.0",
        label: "Latest",
        date: "2025-01",
        description: "Hotspot optimization + resume improvements",
        features: [
          "Hotspot mode stability improved with auto-reconnect",
          "Resume transfer supports pause and recovery — more reliable for large files",
          "Transfer speed optimized, LAN peak up to 50MB/s",
        ],
      },
      {
        version: "v1.1.0",
        label: "",
        date: "2024-12",
        description: "Access control system + access code verification",
        features: [
          "New access code verification to protect file security",
          "Support for expiration and download count limits",
          "Access log recording for traceable share history",
        ],
      },
      {
        version: "v1.0.0",
        label: "",
        date: "2024-11",
        description: "Official release · AES-256 encryption",
        features: [
          "Official release with fully stable core features",
          "AES-256-CBC end-to-end encryption ensuring data security",
          "Cross-platform support for Windows, macOS, and Linux",
        ],
      },
      {
        version: "v0.9.0",
        label: "",
        date: "2024-10",
        description: "Public beta · Basic file sharing",
        features: [
          "First public beta with basic file sharing features",
          "Automatic LAN device discovery, one-click sharing",
          "Browser-based receiving, no extra software needed",
        ],
      },
    ],
    viewAll: "View All Updates",
    starTitle: "Give NeiLink a Star",
    starDescription: "If NeiLink helps you, please give us a Star on GitHub to support this open source project",
    starBtn: "Star on GitHub",
  },
  testimonials: {
    badge: "Testimonials",
    title1: "What Users",
    title2: "Say",
    description:
      "Real feedback from the community — see how people use NeiLink to improve file sharing",
    items: [
      {
        name: "Alex W.",
        role: "Student",
        quote:
          "After using NeiLink, I never need USB drives to transfer files between office computers anymore. The speed is incredible!",
      },
      {
        name: "Chen E.",
        role: "Software Engineer",
        quote:
          "Finally a great tool for large LAN file transfers. The encryption makes sharing sensitive documents worry-free.",
      },
      {
        name: "Liu T.",
        role: "Professor",
        quote:
          "The best part is that receivers don't need to install anything — just open a browser to download. So convenient.",
      },
      {
        name: "Zhao M.",
        role: "Project Manager",
        quote:
          "The resume feature saved me — even with unstable company WiFi, large files still get through.",
      },
      {
        name: "Zhou D.",
        role: "UI Designer",
        quote:
          "Open source and free — that's so generous. Way better than paid file transfer tools.",
      },
      {
        name: "Wu S.",
        role: "Graduate Researcher",
        quote:
          "Setting access codes and expiration times is really practical — gives me more control when sharing files.",
      },
    ],
    pageAriaLabel: "View page {page} testimonials",
  },
  liveDemo: {
    badge: "Live Demo",
    title1: "File Transfer",
    title2: ", See It In Action",
    description:
      "Watch NeiLink's transfer process in action — fast, secure, intuitive",
    sender: "Sender",
    receiver: "Receiver",
    sendBtn: "Send File",
    startBtn: "Start Demo",
    fileName: "project-report.pdf",
    fileSize: "12.3 MB",
    fileDetail: "12.3 MB · Enter access code",
    status: {
      idle: "Ready to send...",
      connecting: "Connecting…",
      transferring: "Transferring...",
      complete: "Transfer complete ✓",
      receiverIdle: "Waiting to receive...",
      receiverTransferring: "Receiving...",
      receiverComplete: "Receive complete ✓",
    },
    speed: "Transfer Speed",
    progress: "Progress",
    receiveProgress: "Receiving Progress",
    encryption: "AES-256 Encrypted",
    encryptionLabel: "Encryption",
    elapsedTimeLabel: "Elapsed",
    downloadBtn: "Download File",
    accessCodeHint: "Enter access code",
    resetBtn: "Reset",
  },
  download: {
    badge: "Download",
    title1: "Get Started ",
    title2: "with NeiLink",
    description:
      "Free and open source — cross-platform support, download now to experience lightning-fast LAN file transfer",
    platforms: [
      { name: "Windows", version: "v1.0.0", size: "65 MB", ext: ".exe", btn: "Download .exe" },
      { name: "macOS", version: "v1.0.0", size: "72 MB", ext: ".dmg", btn: "Download .dmg" },
      { name: "Linux", version: "v1.0.0", size: "58 MB", ext: ".AppImage", btn: "Download .AppImage" },
    ],
    recommended: "Recommended",
    downloadInstall: "Download & Install",
    otherPlatforms: "Other Platforms",
    sourceCode: "Build from Source",
    viewSource: "View Source",
    allVersions: "All Versions",
    systemRequirements: "System Requirements: Windows 10+ / macOS 10.14+ / Ubuntu 18.04+ · LAN connection required",
    toastRedirect: "Redirecting to GitHub Releases...",
  },
  footer: {
    product: "Product",
    resource: "Resources",
    community: "Community",
    about: "About",
    subtitle: "NeiLink",
    tagline: "LAN File Sharing Tool",
    description: "A cross-platform LAN file sharing tool for personal users — making LAN file sharing simpler, safer, and more efficient.",
    philosophy: "No internet needed, no registration required — share at LAN speed. That's the NeiLink philosophy.",
    productLinks: [
      { label: "Features" },
      { label: "How It Works" },
      { label: "Security" },
      { label: "Cross-Platform" },
      { label: "Download" },
    ],
    resourceLinks: [
      { label: "GitHub Repository" },
      { label: "Documentation" },
      { label: "Report Issues" },
      { label: "Changelog" },
    ],
    communityLinks: [
      { label: "Contributing Guide" },
      { label: "License" },
      { label: "Star on GitHub" },
      { label: "Discussions" },
    ],
    aboutLinks: [
      { label: "About Project" },
      { label: "Tech Stack" },
      { label: "Dev Team" },
      { label: "Contact Us" },
    ],
    stats: {
      users: "Active Users",
      speed: "LAN Transfer",
      speedValue: "Fast",
      encryption: "E2E Encryption",
      platforms: "Desktop Platforms",
      openSource: "MIT License",
      stars: "GitHub Stars",
      leaks: "Data Breaches",
    },
    madeWith: "Made with ❤️",
    copyright: "© 2024 NeiLink. MIT Open Source License",
    openSource: "Open Source · Free to Use",
    madeBy: "Made with ❤️ by Qiyao-sudo",
    allRightsReserved: "All rights reserved.",
  },
  utils: {
    backToTop: "Back to top",
    skipToContent: "Skip to main content",
    keyboardShortcuts: "Keyboard Shortcuts",
    sectionNav: "Section navigation",
    shortcuts: {
      actions: "Actions",
      navigation: "Navigation",
      jumpTo: "Jump To",
      toggleTheme: "Toggle theme",
      showShortcuts: "Show shortcuts",
      closePanel: "Close this panel",
      scrollToSection: "Go to %s",
      jumpToSection: "Jump to section",
      scrollUp: "Scroll up",
      scrollDown: "Scroll down",
      goBackToTop: "Back to top",
      downloadPage: "Download page",
      press: "Press",
      viewShortcuts: "View shortcuts",
    },
    sections: {
      hero: "Home",
      features: "Features",
      howItWorks: "How It Works",
      security: "Security",
      trust: "Trust",
      crossPlatform: "Cross-Platform",
      architecture: "Architecture",
      comparison: "Comparison",
      screenshots: "Screenshots",
      faq: "FAQ",
      changelog: "Changelog",
      testimonials: "Testimonials",
      liveDemo: "Live Demo",
      download: "Download",
    },
  },
  terminal: {
    lines: [
      "$ neilink share ./project.zip",
      "📦 Sharing: project.zip (156 MB)",
      "🔑 Access code: abc123",
      "🔗 http://192.168.1.100:8080/s/abc123",
      "✓ Share successful! Accessible on LAN devices",
    ],
    copied: "Copied!",
    copy: "Copy",
    copyLink: "Copy link",
    copiedToClipboard: "Copied to clipboard",
    copyFailed: "Copy failed",
    copyFailedDesc: "Please copy the link manually",
  },
};

export default en;
