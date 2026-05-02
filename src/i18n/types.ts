export type Locale = "zh" | "en";

export interface Translations {
  // Navbar
  nav: {
    home: string;
    features: string;
    security: string;
    liveDemo: string;
    comparison: string;
    changelog: string;
    download: string;
    subtitle: string;
    skipToContent: string;
    downloadBtn: string;
    ariaLabel: string;
  };
  // Hero
  hero: {
    badge: string;
    badgeFast: string;
    badgeEncrypted: string;
    badgeOffline: string;
    titleLine1: string;
    titleLine2: string;
    animatedSubtitle: string;
    subtitle: string;
    subtitleLine2: string;
    cta: string;
    ctaSecondary: string;
    version: string;
    scrollDown: string;
  };
  // ScrollVelocityBar
  scrollVelocity: {
    text: string;
  };
  // Features
  features: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    learnMore: string;
    items: {
      title: string;
      description: string;
      stat: string;
    }[];
    stats: {
      label: string;
    }[];
  };
  // How It Works
  howItWorks: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    steps: {
      title: string;
      description: string;
      detail: string;
    }[];
    stepLabel: string;
    completed: string;
    flowLabels: {
      sender: string;
      lan: string;
      browser: string;
      receiver: string;
    };
    flowDemo: {
      title: string;
      sender: string;
      lan: string;
      receiver: string;
    };
  };
  // Security
  security: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    items: {
      title: string;
      description: string;
    }[];
    encryption: string;
  };
  // Trust
  trust: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    stars: string;
    starsFallback: string;
    speed: string;
    leaks: string;
    loading: string;
    badges: [
      { aes: string },
      { openSource: string },
      { local: string },
      { zeroLeak: string },
    ];
    quote: string;
    quoteAttribution: string;
    mitLicense: string;
    version: string;
  };
  // Cross Platform
  crossPlatform: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    devices: {
      name: string;
      desc: string;
    }[];
    browserDevices: {
      name: string;
    }[];
    networkFeatures: {
      title: string;
      desc: string;
    }[];
    centerLabel: string;
    receiveNote: string;
  };
  // Architecture
  architecture: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    steps: {
      title: string;
      description: string;
    }[];
    sender: string;
    receiver: string;
    router: string;
    server: string;
    encrypted: string;
    unencrypted: string;
    lanDistribution: string;
    stepLabels: string[];
    senderSublabel: string;
    serverSublabel: string;
    receiverSublabel: string;
    encryptionHoverTitle: string;
    encryptionHoverDetail: string;
    featureCards: {
      title: string;
      description: string;
    }[];
  };
  // Comparison
  comparison: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    tabSpeed: string;
    tabFeatures: string;
    statBadges: { label: string }[];
    barMethods: {
      name: string;
      descriptions: {
        speed: string;
        ease: string;
        security: string;
        noLimit: string;
        noNetwork: string;
      };
      tooltips: {
        speed: string;
        ease: string;
        security: string;
        noLimit: string;
        noNetwork: string;
      };
    }[];
    metricLabels: {
      speed: string;
      ease: string;
      security: string;
      noLimit: string;
      noNetwork: string;
    };
    featureNames: string[];
    matrixToolLabels: {
      neilink: string;
      airdrop: string;
      wechat: string;
      email: string;
      usb: string;
    };
    calculator: {
      title: string;
      subtitle: string;
      sizeLabel: string;
      timeLabel: string;
      methods: {
        name: string;
        speed: string;
      }[];
      timeUnits: {
        lessThanSecond: string;
        second: string;
        minute: string;
        hour: string;
      };
      bottomNote: string;
    };
    table: {
      feature: string;
      neilink: string;
      usb: string;
      cloud: string;
      chat: string;
    };
  };
  // Screenshots
  screenshots: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    items: {
      title: string;
      desc: string;
      badge?: string;
    }[];
    mockups: {
      sidebar: string[];
      main: {
        dragHint: string;
        selectFile: string;
      };
      share: {
        accessCode: string;
        expiry: string;
        downloadCount: string;
        unlimited: string;
        hours: string;
        shareLink: string;
        copy: string;
      };
      manage: {
        downloads: string;
        active: string;
        expired: string;
      };
      stats: {
        totalUpload: string;
        totalDownload: string;
        activeShares: string;
        totalDownloads: string;
      };
      settings: {
        networkAdapter: string;
        servicePort: string;
        autoHotspot: string;
        autoStart: string;
        off: string;
        on: string;
      };
      web: {
        fileShare: string;
        accessCode: string;
        downloadFile: string;
      };
    };
    lightbox: {
      close: string;
      prev: string;
      next: string;
    };
    viewLarge: string;
    autoPlay: string;
    pausePlay: string;
    switchTo: string;
  };
  // FAQ
  faq: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  // Changelog
  changelog: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    versions: {
      version: string;
      label: string;
      date: string;
      description: string;
      features: string[];
    }[];
    viewAll: string;
    starTitle: string;
    starDescription: string;
    starBtn: string;
  };
  // Testimonials
  testimonials: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    items: {
      name: string;
      role: string;
      quote: string;
    }[];
    pageAriaLabel: string;
  };
  // Live Demo
  liveDemo: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    sender: string;
    receiver: string;
    sendBtn: string;
    startBtn: string;
    fileName: string;
    fileSize: string;
    fileDetail: string;
    status: {
      idle: string;
      connecting: string;
      transferring: string;
      complete: string;
      receiverIdle: string;
      receiverTransferring: string;
      receiverComplete: string;
    };
    speed: string;
    progress: string;
    receiveProgress: string;
    encryption: string;
    encryptionLabel: string;
    elapsedTimeLabel: string;
    downloadBtn: string;
    accessCodeHint: string;
    resetBtn: string;
  };
  // Download
  download: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    platforms: {
      name: string;
      version: string;
      size: string;
      ext: string;
      btn: string;
    }[];
    recommended: string;
    downloadInstall: string;
    otherPlatforms: string;
    sourceCode: string;
    viewSource: string;
    allVersions: string;
    systemRequirements: string;
    toastRedirect: string;
  };
  // Footer
  footer: {
    product: string;
    resource: string;
    community: string;
    about: string;
    subtitle: string;
    tagline: string;
    description: string;
    philosophy: string;
    productLinks: { label: string }[];
    resourceLinks: { label: string }[];
    communityLinks: { label: string }[];
    aboutLinks: { label: string }[];
    stats: {
      users: string;
      speed: string;
      speedValue: string;
      encryption: string;
      platforms: string;
      openSource: string;
      stars: string;
      leaks: string;
    };
    madeWith: string;
    copyright: string;
    openSource: string;
    madeBy: string;
    allRightsReserved: string;
  };
  // Utility
  utils: {
    backToTop: string;
    skipToContent: string;
    keyboardShortcuts: string;
    sectionNav: string;
    shortcuts: {
      actions: string;
      navigation: string;
      jumpTo: string;
      toggleTheme: string;
      showShortcuts: string;
      closePanel: string;
      scrollToSection: string;
      jumpToSection: string;
      scrollUp: string;
      scrollDown: string;
      goBackToTop: string;
      downloadPage: string;
      press: string;
      viewShortcuts: string;
    };
    sections: {
      hero: string;
      features: string;
      howItWorks: string;
      security: string;
      trust: string;
      crossPlatform: string;
      architecture: string;
      comparison: string;
      screenshots: string;
      faq: string;
      changelog: string;
      testimonials: string;
      liveDemo: string;
      download: string;
    };
  };
  // Terminal
  terminal: {
    lines: string[];
    copied: string;
    copy: string;
    copyLink: string;
    copiedToClipboard: string;
    copyFailed: string;
    copyFailedDesc: string;
  };
}
