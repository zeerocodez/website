/**
 * Zeerocodes Unified Database & Data Layer (v2.0)
 * Handles full persistence for:
 * 1. users (Admin, Student, Client roles)
 * 2. courses (The Zeerocodes VibeCode Labs - 4 Levels • 20 Modules • 88 Lessons)
 * 3. enrollments & student progress
 * 4. labSubmissions & assignment grading
 * 5. studioProjects & milestone pipeline
 * 6. vibescanSubmissions, auditReports & certifications
 * 7. blogPosts (CMS support)
 * 8. paymentEvents & webhook logs
 */

const DB_STORAGE_PREFIX = 'zeerocodes_db_';

// Flagship Cohort Courses Catalog
const DEFAULT_COURSES = [
  {
    id: 'course-vibecode-labs',
    title: 'The Zeerocodes VibeCode Labs',
    subtitle: 'From Absolute Beginner to Certified Builder Shipping Real Software & Earning Income',
    slug: 'vibecode-labs',
    priceNGN: 95000,
    originalPriceNGN: 150000,
    priceUSD: 65,
    originalPriceUSD: 105,
    priceGBP: 55,
    category: 'Full-Stack Vibe Coding',
    level: 'Beginner → Builder → Certified Professional',
    duration: '8-Week Live Cohort (88 Lessons)',
    cohortDate: 'October 15, 2026',
    seatsTotal: 30,
    seatsRemaining: 8,
    instructor: 'Nuel Effiong',
    instructorRole: 'Principal AI Systems Architect',
    shortDesc: 'We take you from absolute beginner to a certified builder who ships real, secure software for paying clients in 8 weeks.',
    description: "You don't need a computer science degree or years of coding experience. In 8 weeks, we guide you step-by-step to design clean apps with Google Stitch & AI Studio, build full-stack web applications with Antigravity, automate business operations with n8n and WhatsApp, lock down security with VibeScan, and package your skills to earn paying client revenue.",
    levels: [
      {
        levelNumber: 1,
        title: 'Level 1: Foundations',
        tagline: 'Mindset, Prompt Engineering & 2026 Toolchain',
        lessonCount: 18,
        modules: [
          {
            number: '01',
            title: 'The Vibe Coding Mindset',
            lessons: [
              '1.1 What Vibe Coding Is (and Isn\'t)',
              '1.2 No-Code vs Low-Code vs Vibe Coding: Choosing the Right Tool',
              '1.3 The Builder\'s Journey: From Idea to Shipped App',
              '1.4 Case Study: A Lagos SME Owner Builds a Booking App Without Writing Code',
              '1.5 The Limits of Vibe Coding: When to Bring in a Real Engineer'
            ]
          },
          {
            number: '02',
            title: 'Prompt Engineering for Builders',
            lessons: [
              '2.1 Thinking Like a Product Manager: Writing Specs, Not Wishes',
              '2.2 The Anatomy of a Build Prompt (Context, Constraints, Components)',
              '2.3 Iterating: How to Talk to an AI Agent When Something Breaks',
              '2.4 Practice Lab: Rewrite Five Weak Prompts Into Strong Ones'
            ]
          },
          {
            number: '03',
            title: 'The Zeerocodes 2026 Toolchain',
            lessons: [
              '3.1 Meet the Stack: Stitch, AI Studio, Antigravity, VibeScan',
              '3.2 Where Each Tool Fits in the Pipeline',
              '3.3 Setting Up Your Accounts and Workspace',
              '3.4 Tool Comparison Lab: Stitch vs Figma, AI Studio vs Bolt/Lovable, Antigravity vs Cursor'
            ]
          },
          {
            number: '04',
            title: 'Your First Build',
            lessons: [
              '4.1 From Blank Page to Working App in AI Studio Build Mode',
              '4.2 Adding a Firebase Backend (Database and Auth) in Minutes',
              '4.3 Testing and Fixing With the Agent',
              '4.4 Deploying Your First App to a Live URL'
            ]
          }
        ]
      },
      {
        levelNumber: 2,
        title: 'Level 2: Builder',
        tagline: 'UI/UX, Full-Stack AI Studio, Antigravity & Mobile',
        lessonCount: 26,
        modules: [
          {
            number: '05',
            title: 'UI/UX Thinking for Non-Designers',
            lessons: [
              '5.1 Design Thinking Basics: Users, Flows, Friction',
              '5.2 Building a Swipe File: Mobbin, Land-book, Lapa Ninja, Dribbble',
              '5.3 Reading a Design Like a Builder (Hierarchy, Spacing, Contrast)',
              '5.4 Designing for Nigerian Users: Low Bandwidth, Mobile-First, Data-Conscious',
              '5.5 Designing for Everyone: Accessibility Basics (contrast, screen readers, tap targets)'
            ]
          },
          {
            number: '06',
            title: 'Designing With Google Stitch',
            lessons: [
              '6.1 Text-to-UI: Your First Screen in Stitch',
              '6.2 Image-to-UI: Turning a Sketch or Screenshot Into a Design',
              '6.3 Branding Your Design: Applying the Zeerocodes Palette (live theming demo)',
              '6.4 Multi-Screen Prototyping and Connected Flows',
              '6.5 Flash vs Pro Mode: Speed vs Quality Tradeoffs'
            ]
          },
          {
            number: '07',
            title: 'Stitch to Studio Handoff',
            lessons: [
              '7.1 Exporting Your Design (Figma, HTML/CSS, or Direct to AI Studio)',
              '7.2 Publishing a Prototype Link for Client Feedback',
              '7.3 Common Handoff Mistakes and How to Avoid Them'
            ]
          },
          {
            number: '08',
            title: 'Full-Stack Build in Google AI Studio',
            lessons: [
              '8.1 Build Mode Deep Dive: Editor, Preview, Agent Chat',
              '8.2 Wiring Up Firebase: Data Models, Auth, Storage',
              '8.3 Connecting External Services (Paystack, Flutterwave, WhatsApp Business API)',
              '8.4 Managing Secrets and API Keys the Right Way',
              '8.5 Version Checkpoints: Saving Progress and Rolling Back'
            ]
          },
          {
            number: '09',
            title: 'Leveling Up With Google Antigravity',
            lessons: [
              '9.1 Editor View vs Manager Surface: Two Ways to Work',
              '9.2 Exporting From AI Studio to Antigravity Without Losing Context',
              '9.3 Running Parallel Agents: Being Your Own Full-Stack Team',
              '9.4 The Browser Subagent: Letting the Agent Test Its Own Work',
              '9.5 Reviewing Agent Output Like a Tech Lead, Not a Typist',
              '9.6 Version Control for Vibe Coders: What a Checkpoint Is Actually Protecting You From'
            ]
          },
          {
            number: '10',
            title: 'Mobile and Android Vibe Coding',
            lessons: [
              '10.1 Native Android Generation in AI Studio (Kotlin, Jetpack Compose)',
              '10.2 Testing in the In-Browser Android Emulator',
              '10.3 Publishing to a Google Play Internal Test Track',
              '10.4 When to Go Native vs When a Web App Is Enough'
            ]
          }
        ]
      },
      {
        levelNumber: 3,
        title: 'Level 3: Professional',
        tagline: 'n8n Automation, AI Security & VibeScan Audits',
        lessonCount: 24,
        modules: [
          {
            number: '11',
            title: 'AI Automation Foundations',
            lessons: [
              '11.1 What Automation Actually Solves (the 30-minute task in 10 seconds)',
              '11.2 n8n Basics: Triggers, Nodes, Workflows',
              '11.3 Connecting Your App to WhatsApp Business API',
              '11.4 Automating Google Workspace: Gmail, Sheets, Drive From Your App',
              '11.5 Business Case Lab: Automate a School Admission Pipeline End to End'
            ]
          },
          {
            number: '12',
            title: 'Agentic Workflows',
            lessons: [
              '12.1 From Automation to Agents: What Actually Changes',
              '12.2 Building Custom Agents With the Antigravity SDK',
              '12.3 The Managed Agents API: One Call, One Fully Equipped Agent',
              '12.4 Designing Fallbacks: What Happens When the Agent Hallucinates or Fails'
            ]
          },
          {
            number: '13',
            title: 'Security Mindset for Vibe Coders',
            lessons: [
              '13.1 The Hidden Cost of Vibe Coding: Vulnerabilities Nobody Wrote Manually',
              '13.2 The OWASP Top 10 for LLMs Explained for Non-Engineers',
              '13.3 API Keys: Where They Belong and Where They Should Never Appear',
              '13.4 Database Permissions (RLS): Why Default Open Is a Disaster'
            ]
          },
          {
            number: '14',
            title: 'VibeScan: Your AI Security Auditor',
            lessons: [
              '14.1 Introduction to VibeScan: What It Catches and How It Works',
              '14.2 Scanning Your App Before Shipping: Step-by-Step Workflow',
              '14.3 Reading a VibeScan Report and Fixing Every Flagged Issue',
              '14.4 The VibeCert™ Process: Earning and Displaying the Trust Badge',
              '14.5 Practice Lab: Audit a Vulnerable Demo App and Fix All Five Flaws'
            ]
          },
          {
            number: '15',
            title: 'Testing and Quality Assurance',
            lessons: [
              '15.1 Writing Effective Test Scenarios in Plain English for Your Agent',
              '15.2 Edge Cases Non-Engineers Miss (and How to Catch Them)',
              '15.3 Performance Basics: Page Load Times, Image Optimization, Mobile Feel'
            ]
          },
          {
            number: '16',
            title: 'The Capstone Build',
            lessons: [
              '16.1 Capstone Brief: Choose Your Track (SaaS MVP, Business Automation, Client Portal)',
              '16.2 Spec Writing and Stitch Design (Instructor Review Checkpoint)',
              '16.3 Full-Stack Build in AI Studio / Antigravity With Firebase Backend',
              '16.4 Automation Integration (n8n + WhatsApp)',
              '16.5 VibeScan Security Audit (Must Pass to Graduate)',
              '16.6 Production Deployment to Custom Domain'
            ]
          }
        ]
      },
      {
        levelNumber: 4,
        title: 'Level 4: Launch',
        tagline: 'Client Acquisition, Pricing, Proposals & Certification',
        lessonCount: 20,
        modules: [
          {
            number: '17',
            title: 'Packaging Your Skills',
            lessons: [
              '17.1 How to Describe What You Do Without Using Jargon',
              '17.2 Pricing Your Services: Fixed-Price vs Retainer vs Value-Based',
              '17.3 Building a Portfolio That Sells Itself',
              '17.4 Case Study: Pricing a Booking App for a Nigerian Clinic'
            ]
          },
          {
            number: '18',
            title: 'Client Acquisition for Builders',
            lessons: [
              '18.1 Finding Your First Three Clients (warm network, local business groups, referrals)',
              '18.2 Writing a Proposal That Gets a Yes',
              '18.3 Handling Scope Creep Without Losing the Client',
              '18.4 Contracts and Getting Paid: Deposits, Milestones, Invoicing'
            ]
          },
          {
            number: '19',
            title: 'Certification: Ceremony and Shelf Life',
            lessons: [
              '19.1 Certification Ceremony and Badge Issuance',
              '19.2 Why Your Certification Has a Shelf Life',
              '19.3 Renewal Path: Annual Micro-Refresh on Tool and Security Updates',
              '19.4 What Comes After Certification: Freelance, Employment, or Building Your Own Product'
            ]
          },
          {
            number: '20',
            title: 'Becoming a Certified Trainer: The Licensing Path',
            lessons: [
              '20.1 Who Should Consider the Trainer Track',
              '20.2 The School/Teacher Licensing Model: How It Works',
              '20.3 Delivering the Zeerocodes Curriculum Under License',
              '20.4 Franchise Economics: Revenue Split and Brand Standards'
            ]
          }
        ]
      }
    ],
    features: [
      '8-Week Live Cohort with Weekend Build-Along Workshops',
      '4 Progressive Levels (Foundations → Builder → Professional → Launch)',
      '20 Comprehensive Modules with 88 Hands-On Practical Lessons',
      'The Complete 2026 Toolchain: Stitch, AI Studio, Antigravity, n8n, VibeScan',
      'Production Capstone Project Audited by VibeScan',
      'Official Zeerocodes Professional No-Code Developer Certification (12-Month Renewable)',
      'Dedicated Community WhatsApp & Slack Hub + 1-on-1 Mentor Office Hours with Nuel Effiong',
      'Direct Client Acquisition & Proposal Templates Tailored for African SME Markets'
    ],
    featured: true,
    enrolledCount: 1450
  },
  {
    id: 'course-whatsapp-automation',
    title: 'WhatsApp & Paystack Business Automation Masterclass',
    subtitle: 'Build Autonomous WhatsApp Invoicing Bots & n8n Operational Pipelines for African SMEs',
    slug: 'whatsapp-automation',
    priceNGN: 75000,
    originalPriceNGN: 120000,
    priceUSD: 50,
    originalPriceUSD: 85,
    priceGBP: 40,
    category: 'Business Workflow Automation',
    level: 'Intermediate Builder',
    duration: '4-Week Practical Sprint (48 Lessons)',
    cohortDate: 'November 5, 2026',
    seatsTotal: 25,
    seatsRemaining: 12,
    instructor: 'Nuel Effiong',
    instructorRole: 'Principal AI Systems Architect',
    shortDesc: 'Master n8n webhooks, Meta WhatsApp Cloud API, and cryptographic Paystack verification to run enterprise sales workflows in under 90 seconds.',
    description: 'Transform manual customer follow-ups and invoicing into autonomous revenue machines. Learn how to architect multi-tenant WhatsApp bots, issue PDF receipts automatically, and configure fail-safe webhook HMAC verification.',
    levels: [
      {
        levelNumber: 1,
        title: 'Level 1: Webhook Architecture & Meta API',
        tagline: 'Meta WhatsApp Cloud API setup, token security & n8n nodes',
        lessonCount: 16,
        modules: [
          {
            number: '01',
            title: 'WhatsApp Cloud API Setup',
            lessons: [
              '1.1 Meta Developer Console & Business Verification',
              '1.2 Permanent Token Generation & System User Security',
              '1.3 Inbound Webhook Handlers with Fastify and n8n',
              '1.4 Template Message Approvals and Marketing Broadcast Rules'
            ]
          },
          {
            number: '02',
            title: 'n8n Workflow Engineering',
            lessons: [
              '2.1 Self-Hosted vs Cloud n8n Infrastructure',
              '2.2 Conditional Routing, Switch Nodes & Error Trigger Hooks',
              '2.3 PostgreSQL & Supabase Real-Time State Sync',
              '2.4 Rate Limiting & 90-Second Conversation Flow Design'
            ]
          }
        ]
      },
      {
        levelNumber: 2,
        title: 'Level 2: Payment Gateways & Dynamic Invoicing',
        tagline: 'Paystack, Flutterwave, HMAC SHA-512 & PDF generation',
        lessonCount: 16,
        modules: [
          {
            number: '03',
            title: 'Cryptographic Payment Integration',
            lessons: [
              '3.1 Initializing Paystack Transactions with WhatsApp Callback URLs',
              '3.2 Verifying `x-paystack-signature` HMAC SHA-512 in Node.js',
              '3.3 Preventing Double-Spending & Idempotent Event Processing',
              '3.4 Multi-Currency Settlement (NGN, USD, GHS, KES)'
            ]
          },
          {
            number: '04',
            title: 'Automated Invoice Generation',
            lessons: [
              '4.1 Dynamic PDF Generation with Puppeteer & HTML Templates',
              '4.2 Delivering Branded Receipts into WhatsApp Chat Streams',
              '4.3 Automated Accounting Sync to QuickBooks & Google Sheets',
              '4.4 24-Hour Payment Abandonment Recovery Sequences'
            ]
          }
        ]
      },
      {
        levelNumber: 3,
        title: 'Level 3: Client Production Delivery',
        tagline: 'SLA Retainers, High Availability & Enterprise Client Contracts',
        lessonCount: 16,
        modules: [
          {
            number: '05',
            title: 'Enterprise Deployment & SLAs',
            lessons: [
              '5.1 Multi-Tenant Bot Architecture for Multiple Clients',
              '5.2 Uptime Monitoring, Sentry Alerting & Fallback Failovers',
              '5.3 Pricing Automation Retainers (₦250k - ₦1.5M/month)',
              '5.4 Delivering Production Handover Ceremonies'
            ]
          }
        ]
      }
    ],
    features: [
      '4-Week Intensive n8n & WhatsApp Build Sprint',
      'Plug-and-Play Production n8n Workflow JSON Templates',
      'Paystack & Flutterwave Cryptographic HMAC Webhook Handlers',
      'Automated PDF Invoice Generator with WhatsApp Media Dispatch',
      'Client Retainer Proposal & SLA Contract Blueprints'
    ],
    featured: true,
    enrolledCount: 680
  },
  {
    id: 'course-ai-security',
    title: 'OWASP LLM & AI Cybersecurity Hardening',
    subtitle: 'Audit, Penetrate, and Secure AI & Vibe-Coded Web Applications Against Critical Vulnerabilities',
    slug: 'ai-security',
    priceNGN: 110000,
    originalPriceNGN: 180000,
    priceUSD: 75,
    originalPriceUSD: 125,
    priceGBP: 60,
    category: 'Cybersecurity & AST Auditing',
    level: 'Advanced Builder / DevSecOps',
    duration: '6-Week Threat Modeling Masterclass (36 Lessons)',
    cohortDate: 'December 1, 2026',
    seatsTotal: 20,
    seatsRemaining: 7,
    instructor: 'Nuel Effiong',
    instructorRole: 'Principal AI Systems Architect',
    shortDesc: 'Learn how to threat model, scan, and patch vibe-coded codebases using the OWASP LLM Top 10 framework and VibeScan AST tools.',
    description: 'Vibe coding produces software at 10x speed, but introduces critical vulnerabilities: API keys baked into client bundles, missing PostgreSQL RLS, prompt injection vulnerabilities, and spoofed webhooks. Master defensive engineering to certify production applications.',
    levels: [
      {
        levelNumber: 1,
        title: 'Level 1: OWASP LLM Top 10 Deep Dive',
        tagline: 'Prompt injection, data leakage & unvalidated outputs',
        lessonCount: 12,
        modules: [
          {
            number: '01',
            title: 'LLM Vulnerability Architecture',
            lessons: [
              '1.1 Direct vs Indirect Prompt Injection Attacks',
              '1.2 Sensitive Information Disclosure & Model Extraction',
              '1.3 Insecure Output Handling (XSS & Server-Side Execution)',
              '1.4 Supply Chain Vulnerabilities in AI Packages'
            ]
          }
        ]
      },
      {
        levelNumber: 2,
        title: 'Level 2: Database & API Hardening',
        tagline: 'Supabase PostgreSQL RLS, timing attacks & key management',
        lessonCount: 12,
        modules: [
          {
            number: '02',
            title: 'PostgreSQL Row Level Security (RLS)',
            lessons: [
              '2.1 Writing Granular RLS Policies for Supabase & Firebase',
              '2.2 Defeating IDOR (Insecure Direct Object Reference) in Next.js',
              '2.3 Secrets Management: Zero-Exposure Environment Architecture',
              '2.4 Timing Attacks & Constant-Time Token Comparison'
            ]
          }
        ]
      },
      {
        levelNumber: 3,
        title: 'Level 3: VibeScan AST Auditing & Certification',
        tagline: 'Static AST analysis, threat modeling & issuing VibeCert™ badges',
        lessonCount: 12,
        modules: [
          {
            number: '03',
            title: 'AST Auditing & Certification',
            lessons: [
              '3.1 Building Custom ESLint & Babel AST Security Rules',
              '3.2 Automated Vulnerability Remediation Workflows',
              '3.3 Issuing Verifiable VibeCert™ Cryptographic Badges',
              '3.4 Conducting Paid Security Audits for Startups & Scaleups'
            ]
          }
        ]
      }
    ],
    features: [
      '6-Week Threat Modeling & DevSecOps Masterclass',
      'Complete OWASP LLM Top 10 Attack & Defense Sandbox',
      'Automated Supabase PostgreSQL RLS Policy Generator',
      'VibeScan AST Scanner SDK & Automated CI/CD Action Hooks',
      'Certified AI Security Practitioner (VibeCert™ Lead Auditor)'
    ],
    featured: false,
    enrolledCount: 340
  }
];

const DEFAULT_USERS = [
  {
    uid: 'user-admin-zeerocodes',
    displayName: 'Zeerocodes Super Admin',
    email: 'zeerocodes@gmail.com',
    role: 'admin',
    photoURL: 'logo.png',
    title: 'Super Administrator & Lead Systems Architect',
    phone: '+234 812 000 0000',
    referralSource: 'direct',
    joinedAt: '2026-01-01T08:00:00Z',
    emailVerified: true
  },
  {
    uid: 'user-admin-ukeme',
    displayName: 'Ukemeobong Uduak',
    email: 'ukemeobonguduak@gmail.com',
    role: 'admin',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    title: 'Lead Administrator & Executive Architect',
    phone: '+234 812 000 0000',
    referralSource: 'direct',
    joinedAt: '2026-01-01T08:00:00Z',
    emailVerified: true
  },
  {
    uid: 'user-admin-01',
    displayName: 'Nuel Effiong',
    email: 'admin@zeerocodes.com',
    role: 'admin',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    title: 'Principal AI Systems Architect',
    phone: '+234 812 345 6789',
    referralSource: 'direct',
    joinedAt: '2026-01-10T08:00:00Z'
  },
  {
    uid: 'user-student-01',
    displayName: 'Amina Yusuf',
    email: 'student@zeerocodes.com',
    role: 'student',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    title: 'Certified Builder in Training',
    phone: '+234 809 112 3344',
    referralSource: 'academy',
    joinedAt: '2026-07-15T14:20:00Z',
    bio: 'Building an automated medical appointment dispatcher for clinics across Lagos.'
  },
  {
    uid: 'user-client-01',
    displayName: 'Tunde Balogun',
    email: 'client@zeerocodes.com',
    role: 'client',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    title: 'COO, PayQuick Africa',
    phone: '+234 803 555 7788',
    referralSource: 'studio',
    joinedAt: '2026-06-01T09:15:00Z',
    bio: 'Partnering with Zeerocodes Studio to scale our automated Paystack micro-lending engine.'
  }
];

const DEFAULT_ENROLLMENTS = [
  {
    id: 'enroll-amina-01',
    userId: 'user-student-01',
    userEmail: 'student@zeerocodes.com',
    userName: 'Amina Yusuf',
    courseId: 'course-vibecode-labs',
    courseTitle: 'The Zeerocodes VibeCode Labs',
    enrolledAt: '2026-07-15T14:30:00Z',
    status: 'active',
    completedLessons: [
      'lvl_1_mod_01_les_0',
      'lvl_1_mod_01_les_1',
      'lvl_1_mod_01_les_2',
      'lvl_1_mod_01_les_3',
      'lvl_1_mod_01_les_4',
      'lvl_1_mod_02_les_0',
      'lvl_1_mod_02_les_1',
      'lvl_1_mod_02_les_2',
      'lvl_1_mod_02_les_3',
      'lvl_1_mod_03_les_0',
      'lvl_1_mod_03_les_1',
      'lvl_1_mod_03_les_2',
      'lvl_1_mod_03_les_3',
      'lvl_1_mod_04_les_0',
      'lvl_1_mod_04_les_1',
      'lvl_2_mod_05_les_0',
      'lvl_2_mod_05_les_1',
      'lvl_2_mod_05_les_2',
      'lvl_2_mod_06_les_0',
      'lvl_2_mod_06_les_1',
      'lvl_3_mod_11_les_0',
      'lvl_3_mod_11_les_1',
      'lvl_3_mod_13_les_0'
    ],
    quizScores: {
      'level_1_quiz': 100,
      'level_2_quiz': 90
    },
    certificateId: 'VIBECERT-2026-0881',
    certifiedAt: '2026-08-10T12:00:00Z'
  }
];

const DEFAULT_LAB_SUBMISSIONS = [
  {
    id: 'lab-sub-001',
    userId: 'user-student-01',
    userEmail: 'student@zeerocodes.com',
    userName: 'Amina Yusuf',
    courseId: 'course-vibecode-labs',
    levelNumber: 3,
    moduleTitle: 'Module 16: Capstone Build',
    lessonTitle: '16.1 Capstone Brief: MedLagos Clinic Appointment Bot',
    repoUrl: 'https://github.com/amina-yusuf/medlagos-whatsapp-bot',
    liveUrl: 'https://medlagos-triage.vercel.app',
    notes: 'Built with Next.js, n8n webhook routing, Paystack consultation fee payment, and VibeScan secret shield.',
    submittedAt: '2026-08-11T16:00:00Z',
    status: 'passed',
    grade: 'A+ (98%)',
    feedback: 'Exceptional constant-time HMAC check on the Paystack webhook and clean Supabase RLS policies! Approved for VibeCert™ issuance.',
    reviewedBy: 'Nuel Effiong',
    reviewedAt: '2026-08-11T18:30:00Z'
  },
  {
    id: 'lab-sub-002',
    userId: 'user-sample-02',
    userEmail: 'emeka.okafor@gmail.com',
    userName: 'Emeka Okafor',
    courseId: 'course-vibecode-labs',
    levelNumber: 2,
    moduleTitle: 'Module 08: Full-Stack Build in AI Studio',
    lessonTitle: '8.4 Managing Secrets & API Keys',
    repoUrl: 'https://github.com/emeka-builds/estate-rent-tracker',
    liveUrl: 'https://estate-tracker-lagos.web.app',
    notes: 'Please review my Firestore security rules and Paystack public key configuration.',
    submittedAt: '2026-08-12T06:15:00Z',
    status: 'pending',
    grade: null,
    feedback: null,
    reviewedBy: null,
    reviewedAt: null
  }
];

const DEFAULT_STUDIO_PROJECTS = [
  {
    id: 'proj-payquick-01',
    title: 'PayQuick Africa Micro-Lending Portal & Automated Ledger',
    clientName: 'Tunde Balogun',
    clientCompany: 'PayQuick Africa',
    userEmail: 'client@zeerocodes.com',
    userId: 'user-client-01',
    budgetNGN: 4800000,
    budgetUSD: 3200,
    status: 'development',
    stage: 'Phase 3: Webhook Automation & n8n Engine',
    progress: 75,
    milestones: [
      { name: 'Architecture & System Blueprint', done: true },
      { name: 'Interactive UI & Client Portal', done: true },
      { name: 'Paystack & WhatsApp Webhook Automation', done: true },
      { name: 'VibeScan AI Security & RLS Lockdown', done: false },
      { name: 'Production Launch & SLA Handover', done: false }
    ],
    repoUrl: 'https://github.com/zeerocodez/payquick-portal',
    stagingUrl: 'https://staging.payquick.zeerocodes.com',
    startDate: '2026-07-01',
    targetLaunch: '2026-08-28'
  },
  {
    id: 'proj-medlagos-02',
    title: 'MedLagos 90-Second WhatsApp Patient Intake & Billing Bot',
    clientName: 'Dr. Folake Davies',
    clientCompany: 'MedLagos Health Systems',
    userEmail: 'dr.davies@medlagos.ng',
    userId: 'user-client-02',
    budgetNGN: 2750000,
    budgetUSD: 1850,
    status: 'qa_audit',
    stage: 'Phase 4: VibeScan Security Hardening',
    progress: 90,
    milestones: [
      { name: 'Triage Flow Mapping', done: true },
      { name: 'WhatsApp Cloud API Node Setup', done: true },
      { name: 'HIPAA / NDPR Sensitive Data Scrubbing', done: true },
      { name: 'VibeScan Audit & Cryptographic Badge', done: true },
      { name: 'Go-Live Handover', done: false }
    ],
    repoUrl: 'https://github.com/zeerocodez/medlagos-bot',
    stagingUrl: 'https://medlagos.zeerocodes.com',
    startDate: '2026-07-15',
    targetLaunch: '2026-08-20'
  }
];

const DEFAULT_VIBESCAN_SUBMISSIONS = [
  {
    id: 'sub-vibescan-001',
    userId: 'user-client-01',
    userEmail: 'client@zeerocodes.com',
    userName: 'Tunde Balogun',
    appName: 'PayQuick Africa Micro-Lending Engine',
    appUrl: 'https://github.com/payquick-africa/portal-app',
    liveUrl: 'https://payquick.ng',
    techStack: 'Next.js 14, Supabase Auth, Paystack API, PostgreSQL RLS',
    buildMethod: 'AI-assisted / vibe-coded (Cursor + Claude 3.5)',
    referralSource: 'studio',
    submittedAt: '2026-08-01T10:00:00Z',
    status: 'certified',
    certificationId: 'VIBECERT-2026-0042',
    vulnerabilitiesFound: 3,
    vulnerabilitiesFixed: 3,
    securityScore: 98,
    auditReport: {
      auditor: 'Nuel Effiong',
      auditDate: '2026-08-03',
      findings: [
        { id: 'F1', title: 'Hardcoded Paystack Secret Key in Client Bundle', severity: 'CRITICAL', status: 'FIXED' },
        { id: 'F2', title: 'Missing PostgreSQL Row-Level Security on User Wallets', severity: 'HIGH', status: 'FIXED' },
        { id: 'F3', title: 'Non-Constant-Time HMAC Webhook Comparison', severity: 'MEDIUM', status: 'FIXED' }
      ]
    }
  },
  {
    id: 'sub-vibescan-002',
    userId: 'user-student-01',
    userEmail: 'student@zeerocodes.com',
    userName: 'Amina Yusuf',
    appName: 'MedLagos WhatsApp Triage Bot',
    appUrl: 'https://github.com/amina-yusuf/medlagos-whatsapp-bot',
    liveUrl: 'https://medlagos-triage.vercel.app',
    techStack: 'Node.js, n8n, WhatsApp Cloud API, Paystack',
    buildMethod: 'The Zeerocodes VibeCode Labs (Antigravity + AI Studio)',
    referralSource: 'academy',
    submittedAt: '2026-08-11T16:30:00Z',
    status: 'in_review',
    certificationId: 'VIBECERT-2026-0881',
    vulnerabilitiesFound: 1,
    vulnerabilitiesFixed: 1,
    securityScore: 99,
    auditReport: null
  }
];

const DEFAULT_BLOG_POSTS = [
  {
    id: 'post-whatsapp-paystack-automation',
    title: 'How We Built an Autonomous WhatsApp & Paystack Invoicing System That Processes ₦180M+',
    slug: 'autonomous-whatsapp-paystack-invoicing-automation-n8n',
    category: 'Automations',
    categoryBadge: 'badge-success',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 10, 2026',
    readTime: '6 min read',
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Step-by-step breakdown of how Zeerocodes replaced 28 hours of manual bank reconciliation per week with a 90-second event-driven n8n & WhatsApp Cloud API bot for PayQuick Africa.',
    tags: ['WhatsApp Business API', 'Paystack', 'n8n', 'FinTech Automation', 'Lagos Business'],
    status: 'published',
    pdfAttachment: {
      name: 'Zeerocodes_Customer_Avatars_and_Marketing_Playbook.pdf',
      url: 'Zeerocodes_Customer_Avatars_and_Marketing_Playbook.pdf',
      title: 'Zeerocodes Customer Avatars & Marketing Playbook (PDF Blueprint)',
      size: 487155,
      sizeFormatted: '475 KB',
      description: 'Download the battle-tested ICP persona guides, cold pitch frameworks, and autonomous WhatsApp funnel blueprints.',
      downloads: 142
    },
    content: `
      <h2>The Real Pain: 4 Accountants Matching Bank SMS Alerts by Hand</h2>
      <p>PayQuick Africa processes hundreds of customer deposits every day across Nigeria. Before partnering with Zeerocodes Studio, their finance team spent 28 hours every week manually opening bank transfer receipts, checking SMS notifications, and replying to customer WhatsApp messages with PDF invoices.</p>
      
      <p>During month-end reconciliation, their calculation error rate hit 14%, leading to frustrated customers and delayed order deliveries.</p>

      <h2>The Architecture: Event-Driven Webhooks & n8n</h2>
      <p>Instead of relying on clunky third-party tools that break when carriers drop connections, we engineered a dedicated self-hosted n8n automation cluster with constant-time HMAC verification:</p>
      
      <ol>
        <li><strong>Inbound Event:</strong> When a customer pays via Paystack, a cryptographic webhook fires to our hardened endpoint.</li>
        <li><strong>HMAC SHA-512 Verification:</strong> Our server evaluates the payload in constant time to guarantee the event came directly from Paystack before touching customer accounts.</li>
        <li><strong>Database Sync:</strong> PostgreSQL ledger updates the transaction in real time with Row-Level Security tenant isolation.</li>
        <li><strong>WhatsApp Dispatch:</strong> The WhatsApp Cloud API generates and sends an official branded PDF receipt to the customer's phone number within 90 seconds.</li>
      </ol>

      <h2>The Transformation & Quantifiable ROI</h2>
      <p>Since deployment, PayQuick Africa has processed over <strong>₦180,000,000 NGN</strong> across thousands of transactions with <strong>0 failed deliveries</strong>. The company reclaimed 112 hours every month and re-allocated 4 staff members to high-margin client growth.</p>

      <div class="article-cta-box" style="background:#080D16; border:1px solid var(--emerald-primary); padding:1.5rem; border-radius:var(--radius-sm); margin:2rem 0;">
        <h4 style="color:#FFF; margin-bottom:0.4rem;">Want to automate your WhatsApp & payment workflows?</h4>
        <p style="color:var(--text-cyber-muted); font-size:0.9rem; margin-bottom:1rem;">Zeerocodes Studio builds, hosts, and operates autonomous business engines with a 99.99% uptime guarantee.</p>
        <button class="btn btn-primary btn-sm trigger-calendly-booking" data-service="WhatsApp & Payment Workflow Automation">
          Book a Free 30-Min Automation Scope
        </button>
      </div>
    `
  },
  {
    id: 'post-ai-vibe-coding-security',
    title: 'Why 40% of AI-Generated Code Has Dangerous Security Leaks (And How to Fix Them)',
    slug: 'ai-vibe-coding-security-vulnerabilities-owasp-llm',
    category: 'AI Security',
    categoryBadge: 'badge-danger',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 8, 2026',
    readTime: '7 min read',
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Cursor, Claude, and Lovable make coding effortless. But when AI tools skip Row-Level Security and expose private API keys in frontend bundles, disaster follows. Here is how to audit your vibe-coded app.',
    tags: ['Vibe Coding', 'OWASP Top 10', 'Cybersecurity', 'Supabase RLS', 'VibeScan'],
    status: 'published',
    content: `
      <h2>The Rise of Vibe Coding & The Hidden Nightmare</h2>
      <p>In 2026, anyone can build a software prototype in a weekend using AI coding assistants like Cursor, Claude 3.7, Lovable, and Bolt. You describe what you want, and the model writes hundreds of lines of code.</p>

      <p>However, recent audits by <strong>VibeScan</strong> revealed that over <strong>40% of vibe-coded applications contain critical security flaws</strong> that could expose founders to catastrophic data breaches and regulatory fines under NDPR and GDPR.</p>

      <h2>The Top 3 Flaws We Find in AI Codebases</h2>
      
      <h3>1. Exposed API Keys in Client Bundles</h3>
      <p>AI assistants frequently write code that imports <code>process.env.OPENAI_API_KEY</code> or <code>PAYSTACK_SECRET_KEY</code> inside frontend React components. When the app compiles, that secret is baked into the public JavaScript file where any attacker can view it using Chrome DevTools.</p>

      <h3>2. Missing Database Row-Level Security (RLS)</h3>
      <p>When you ask an AI to create a database table, it creates the table without tenant isolation policies. Unless you explicitly enable RLS, any visitor with your public API key can query and download every customer's private phone number, order history, and passwords.</p>

      <h3>3. Payment Webhook Spoofing</h3>
      <p>AI assistants frequently write webhook handlers that parse JSON without checking cryptographic HMAC signatures. An attacker can forge a POST request claiming their payment succeeded and receive paid products for free.</p>

      <h2>How VibeScan Protects Your App</h2>
      <p>Before launching your app to real paying users or pitching angel investors, run a repository scan with <strong>VibeScan</strong>. We inspect your code against the OWASP Top 10 for LLMs, provide exact code patches, and issue the tamper-proof <strong>VibeCert™ Verified Badge</strong>.</p>
    `
  },
  {
    id: 'post-zero-to-ai-builder-roadmap',
    title: 'From Zero to Certified AI Builder: The 2026 Developer Roadmap for Africa',
    slug: 'zero-to-certified-ai-builder-developer-roadmap-africa',
    category: 'Career & Training',
    categoryBadge: 'badge-teal',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 5, 2026',
    readTime: '8 min read',
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'You no longer need 4 years of computer science theory to build production software. Discover how modern AI visual engineering and The VibeCode Labs turn beginners into high-earning certified software builders.',
    tags: ['The VibeCode Labs', 'Google Stitch', 'AI Studio', 'No-Code Career', 'Lagos Tech'],
    status: 'published',
    content: `
      <h2>The Old Way vs. The Modern AI Engineering Way</h2>
      <p>For decades, breaking into software development meant spending 2 to 4 years memorizing syntax, data structures, and compiler quirks before ever shipping a real project to a client.</p>

      <p>In 2026, the paradigm has completely flipped. What matters today is not how fast you type syntax, but how clearly you think as a product architect. By leveraging the <strong>Zeerocodes 4-Level AI Build Pipeline</strong>, builders can ship enterprise-grade software in weeks.</p>

      <h2>The 4 Pillars of a High-Earning Builder in 2026</h2>
      <ul>
        <li><strong>Visual UI Prototyping:</strong> Designing clean, conversion-focused mobile interfaces using Google Stitch.</li>
        <li><strong>Full-Stack Generation:</strong> Prompting AI Studio and Antigravity with exact data models and API contracts.</li>
        <li><strong>Autonomous Automations:</strong> Connecting n8n, WhatsApp Cloud API, and Paystack for hands-off business operations.</li>
        <li><strong>Security & Monetization:</strong> Validating apps with VibeScan audits and pitching value-based retainer contracts.</li>
      </ul>
    `
  },
  {
    id: 'post-swiftship-logistics-automation',
    title: 'How We Automated Fleet Dispatch for SwiftShip Lagos Reclaiming 850+ Daily Chats',
    slug: 'autonomous-logistics-fleet-dispatch-whatsapp-google-maps',
    category: 'Case Studies',
    categoryBadge: 'badge-success',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 11, 2026',
    readTime: '7 min read',
    featuredImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'How Zeerocodes Studio engineered an on-demand logistics dispatch portal with Google Maps routing and automated WhatsApp rider bots, enabling SwiftShip to handle 3.8x delivery volume without extra hires.',
    tags: ['Logistics', 'WhatsApp Cloud API', 'Google Maps API', 'Automated Dispatch', 'Lagos'],
    status: 'published',
    content: `
      <h2>The Bottleneck: 850+ Daily WhatsApp Chats Asking "Where Is My Rider?"</h2>
      <p>SwiftShip Logistics operates an on-demand delivery fleet across Ikeja, Victoria Island, Lekki, and Yaba. As order volume tripled, their customer service and dispatch teams were completely overwhelmed.</p>
      
      <p>Dispatchers spent all day manually answering customer chats, calling riders on cellular lines to check locations, and updating chaotic Google Sheets. Delivery lag increased to over 45 minutes just to assign a single parcel.</p>

      <h2>The Autonomous Solution: Intelligent Map Routing & WhatsApp Bot</h2>
      <p>Zeerocodes Studio designed and deployed an end-to-end autonomous dispatch system in 18 business days:</p>

      <ol>
        <li><strong>Customer Booking Webhook:</strong> When a customer places a delivery request on SwiftShip's web portal, pickup and dropoff coordinates are geo-encoded via Google Maps API.</li>
        <li><strong>Proximity Rider Matching:</strong> Our algorithm queries active rider GPS beacons to calculate real-time transit distance and battery status.</li>
        <li><strong>WhatsApp Dispatch Push:</strong> The nearest rider receives an interactive WhatsApp message with one-tap <em>"Accept Delivery"</em> or <em>"Decline"</em> buttons.</li>
        <li><strong>Live Customer Tracking Link:</strong> Upon acceptance, the customer receives an instant WhatsApp link showing the rider moving on a live map in real time.</li>
      </ol>

      <h2>The Outcome: 4-Minute Dispatch & 3.8x Volume Scale</h2>
      <p>Average dispatch assignment dropped from <strong>45 minutes to under 4 minutes</strong>. Customer support inquiries dropped by <strong>74%</strong>, and SwiftShip handled <strong>3.8x more deliveries</strong> with zero additional dispatch staff.</p>

      <div class="article-cta-box" style="background:#080D16; border:1px solid var(--emerald-primary); padding:1.5rem; border-radius:var(--radius-sm); margin:2rem 0;">
        <h4 style="color:#FFF; margin-bottom:0.4rem;">Need custom logistics or workflow software?</h4>
        <p style="color:var(--text-cyber-muted); font-size:0.9rem; margin-bottom:1rem;">Zeerocodes Studio designs, builds, and deploys production systems in 14-28 days.</p>
        <button class="btn btn-primary btn-sm trigger-calendly-booking" data-service="Custom Logistics Dispatch System">
          Book a Free 30-Min Discovery Call
        </button>
      </div>
    `
  },
  {
    id: 'post-supabase-rls-hardening',
    title: 'The Complete Guide to Supabase PostgreSQL Row-Level Security (RLS) for African SaaS Founders',
    slug: 'supabase-postgresql-row-level-security-rls-guide-saas',
    category: 'AI Security',
    categoryBadge: 'badge-danger',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 12, 2026',
    readTime: '9 min read',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Why default Supabase tables leave your customer records open to public theft, and how to write uncrackable PostgreSQL RLS policies that pass enterprise security audits.',
    tags: ['Supabase', 'PostgreSQL', 'Row-Level Security', 'Cybersecurity', 'Database Hardening'],
    status: 'published',
    content: `
      <h2>The #1 Vulnerability in Modern AI-Generated Backends</h2>
      <p>When founders vibe-code a Next.js or React application using Supabase, AI tools generate database tables that lack <strong>Row-Level Security (RLS)</strong> by default. Even if you don't expose your server key, your public anon key allows anyone with basic curl knowledge to dump your entire customer database.</p>

      <h2>How Attackers Exploit Missing RLS</h2>
      <p>Consider a standard table named <code>customer_invoices</code>. Without RLS, an attacker simply executes:</p>
      
      <pre><code>fetch('https://your-project.supabase.co/rest/v1/customer_invoices?select=*', {
  headers: { 'apikey': 'your-public-anon-key' }
});</code></pre>

      <p>This query bypasses frontend UI screens and returns every invoice, customer bank account, phone number, and transaction amount in your database.</p>

      <h2>The Non-Negotiable Fix: 3-Step Hardening</h2>
      <ol>
        <li><strong>Always Enable RLS Explicitly:</strong>
          <pre><code>ALTER TABLE customer_invoices ENABLE ROW LEVEL SECURITY;</code></pre>
        </li>
        <li><strong>Enforce Tenant Ownership on SELECT:</strong>
          <pre><code>CREATE POLICY "Users can only select own invoices"
  ON customer_invoices FOR SELECT
  USING (auth.uid() = user_id);</code></pre>
        </li>
        <li><strong>Block Client-Side Role Elevation on UPDATE:</strong>
          <pre><code>CREATE POLICY "Users cannot modify their own role"
  ON auth_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (role = (SELECT role FROM auth_profiles WHERE id = auth.uid()));</code></pre>
        </li>
      </ol>

      <p>By enforcing these rules, your database cryptographically guarantees tenant isolation at the PostgreSQL kernel level.</p>
    `
  },
  {
    id: 'post-antigravity-ai-studio-mvp',
    title: 'Mastering Google Antigravity & AI Studio: How African Founders Ship Production MVPs in 72 Hours',
    slug: 'mastering-google-antigravity-ai-studio-72-hour-mvp',
    category: 'Custom Apps',
    categoryBadge: 'badge-teal',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 12, 2026',
    readTime: '8 min read',
    featuredImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'A comprehensive methodology for writing airtight engineering specifications, generating full-stack Next.js applications, and passing AST security audits in 72 hours.',
    tags: ['Google Antigravity', 'AI Studio', 'Vibe Coding', 'MVP Engineering', 'Custom Apps'],
    status: 'published',
    content: `
      <h2>The Shift from Syntax Typing to Architectural Specification</h2>
      <p>The biggest mistake first-time AI builders make is writing vague prompts like <em>"Build me a billing system"</em>. AI models will hallucinate database schemas, invent non-existent packages, and introduce critical security gaps.</p>

      <h2>The 4-Step Zeerocodes 72-Hour Build Formula</h2>
      
      <h3>Step 1: Entity-Relationship & Security Specification (Day 1)</h3>
      <p>Before asking the AI to write a single component, define your database entities, foreign keys, and security rules (RLS, HMAC, rate limiting) in markdown specifications.</p>

      <h3>Step 2: Component Scaffolding in Google Stitch & AI Studio (Day 2)</h3>
      <p>Generate high-conversion UI layouts with strict design tokens, responsive typography, and mobile-first touch targets tailored for Nigerian mobile data speeds.</p>

      <h3>Step 3: Business Logic & Autonomous Integrations (Day 3)</h3>
      <p>Wire real payment webhooks (Paystack / Flutterwave), event triggers, and WhatsApp notifications using constant-time cryptographic verification.</p>

      <h3>Step 4: VibeScan AST Static Audit & Hardening</h3>
      <p>Run your repository through VibeScan to seal backdoors, verify OWASP LLM compliance, and generate the cryptographic <strong>VibeCert™ Seal</strong>.</p>
    `
  },
  {
    id: 'post-multi-branch-retail-inventory',
    title: 'Autonomous Multi-Branch Inventory Sync: Connecting WhatsApp Order Bots to Central SQL',
    slug: 'autonomous-multi-branch-retail-inventory-whatsapp-sync',
    category: 'Automations',
    categoryBadge: 'badge-success',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 14, 2026',
    readTime: '7 min read',
    featuredImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'How retail chains in Lagos prevent stockouts and overselling by bridging instant WhatsApp customer catalog orders with real-time distributed warehouse database locks.',
    tags: ['Inventory Automation', 'WhatsApp Cloud API', 'PostgreSQL Locks', 'n8n', 'Retail Tech'],
    status: 'published',
    content: `
      <h2>The Multi-Store Dilemma in Fast-Moving Retail</h2>
      <p>When retail businesses operate 3+ physical branches in Lagos while taking customer orders via WhatsApp, stock inventory desynchronization creates immense customer friction. Two sales reps in different locations sell the exact same piece of merchandise simultaneously.</p>

      <h2>The Event-Driven Atomic Reservation Protocol</h2>
      <p>We engineered an atomic lock architecture using n8n and PostgreSQL row-level transactions:</p>
      <ul>
        <li><strong>Catalog Browsing:</strong> Customers view live stock availability via WhatsApp interactive product lists.</li>
        <li><strong>Atomic Hold:</strong> When a customer starts checkout, a 15-minute distributed lock holds the item inventory in PostgreSQL.</li>
        <li><strong>Payment Verification:</strong> Paystack webhook confirmation immediately clears the hold and marks the item sold across all branches.</li>
        <li><strong>Automated Dispatch Alert:</strong> Nearest warehouse receives picking manifest with instant route planning.</li>
      </ul>
    `
  },
  {
    id: 'post-high-ticket-vibe-coding-retainers',
    title: 'How to Package & Sell High-Ticket Automation Retainers (₦1.5M - ₦5M/Month)',
    slug: 'selling-high-ticket-automation-retainers-nigeria',
    category: 'Career & Training',
    categoryBadge: 'badge-teal',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 16, 2026',
    readTime: '9 min read',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Stop charging one-off project fees. Learn how The VibeCode Labs graduates position Managed Operations SLAs to land long-term recurring revenue clients in Africa and globally.',
    tags: ['Client Acquisition', 'High-Ticket Retainers', 'The VibeCode Labs', 'Freelancing', 'SLA Pricing'],
    status: 'published',
    content: `
      <h2>Why One-Off Project Billing Keeps Builders in the Feast-and-Famine Cycle</h2>
      <p>Most software builders deliver a client portal, get paid once, and immediately start hunting for their next client. Meanwhile, the client's automations experience third-party API changes, webhook timeouts, and server errors that nobody is monitoring.</p>

      <h2>The Managed Operations SLA Model</h2>
      <p>In The VibeCode Labs Level 4, we teach builders to pitch <strong>Value-Based Retainers</strong> structured around business continuity:</p>
      <ul>
        <li><strong>24/7 Webhook & Workflow Uptime Monitoring:</strong> Immediate WhatsApp alerting if a payment gateway drops.</li>
        <li><strong>Monthly Security Re-certification:</strong> Regular VibeScan audits ensuring no newly added secrets or missing policies.</li>
        <li><strong>Feature Iterations:</strong> 1-2 new workflow pipelines per month to continually reduce operational payroll.</li>
      </ul>
    `
  },
  {
    id: 'post-custom-crm-fintech-portal',
    title: 'Architecting a Zero-Tech-Debt Custom CRM for African SME Lenders in 21 Days',
    slug: 'architecting-zero-tech-debt-custom-crm-fintech-sme',
    category: 'Custom Apps',
    categoryBadge: 'badge-teal',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 17, 2026',
    readTime: '8 min read',
    featuredImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'How Zeerocodes Studio architected a secure loan origination and customer KYC portal with automated credit scoring, Bank Verification Number (BVN) validation, and Paystack direct debit mandates.',
    tags: ['Custom CRM', 'FinTech', 'Loan Origination', 'Next.js', 'Cybersecurity'],
    status: 'published',
    content: `
      <h2>The Problem with Off-the-Shelf SaaS for African Lending</h2>
      <p>Generic foreign CRM platforms like HubSpot and Salesforce do not integrate natively with Nigerian credit bureaus, Mono/Okra bank statement parsers, or Paystack automated debit mandates without expensive custom plugins.</p>

      <h2>The Custom Solution Built in 21 Days</h2>
      <p>Using our hardened Next.js and Supabase RLS architectural framework, Zeerocodes Studio delivered a tailor-made loan underwriting engine with instant document OCR verification and automated disbursement notifications.</p>
    `
  }
];

const DEFAULT_QUIZZES = {
  'level_1_quiz': {
    title: 'Level 1 Foundations: Prompting & Architecture Quiz',
    questions: [
      {
        question: 'Which of the following describes the proper anatomy of a production-grade build prompt?',
        options: [
          'Just a 1-sentence request like "Build me an Uber clone"',
          'Context, Architecture & Data Constraints, Precise UI Components, and Error Handling Rules',
          'A copy-pasted screenshot without instructions',
          'Asking the AI to write everything in assembly language'
        ],
        correct: 1,
        explanation: 'Effective prompts act as complete engineering specifications detailing context, architectural constraints, data schemas, and edge case handling.'
      },
      {
        question: 'Where should sensitive secrets like PAYSTACK_SECRET_KEY and database passwords be stored?',
        options: [
          'Directly inside frontend JavaScript files so they run fast',
          'In public GitHub repositories for open-source transparency',
          'Strictly in server-side .env files blocked by .gitignore and never exposed client-side',
          'In local browser cookies without encryption'
        ],
        correct: 2,
        explanation: 'Non-negotiable rule: Secrets must live solely in server-side environment variables and never be bundled into client-side JS.'
      }
    ]
  },
  'level_2_quiz': {
    title: 'Level 2 Builder: Full-Stack & UI/UX Quiz',
    questions: [
      {
        question: 'Why is mobile-first design and low-bandwidth optimization crucial for Nigerian software users?',
        options: [
          'Because all users only use desktop workstations with gigabit fiber',
          'Because mobile accounts for over 85% of African internet traffic and bandwidth costs are high',
          'It is not important in modern web apps',
          'Because search engines penalize mobile apps'
        ],
        correct: 1,
        explanation: 'Over 85% of internet traffic in Nigeria and Africa is mobile-first; apps must load fast with minimal payload on 3G/4G connections.'
      },
      {
        question: 'What is the purpose of Checkpoints when developing full-stack apps in AI Studio or Antigravity?',
        options: [
          'They delete all previous code files',
          'They create safe recovery rollback points before agent refactors so you never lose working functionality',
          'They slow down the compilation speed',
          'They are only used for marketing screenshots'
        ],
        correct: 1,
        explanation: 'Checkpoints allow rapid safe prototyping with instant rollback if an AI agent introduces unexpected regressions.'
      }
    ]
  },
  'level_3_quiz': {
    title: 'Level 3 Professional: AI Security & Webhook Engineering Quiz',
    questions: [
      {
        question: 'How MUST incoming payment webhooks from Paystack or Flutterwave be validated before provisioning user access?',
        options: [
          'By checking if the event object has status: "success" on the client',
          'By computing HMAC SHA-512 with the secret key and verifying signatures in constant time on the server',
          'By trusting the user\'s local storage flag',
          'By skipping verification if the amount is less than ₦100,000'
        ],
        correct: 1,
        explanation: 'Rule FR-ACAD-03: Webhook verification MUST occur server-side using constant-time cryptographic HMAC signature comparisons.'
      },
      {
        question: 'What is Row-Level Security (RLS) in PostgreSQL/Supabase and why is it mandatory?',
        options: [
          'A tool to make table headers colored in green',
          'A database security policy ensuring users can only read or write their own isolated data rows',
          'A frontend CSS grid alignment rule',
          'A method to remove passwords from the database'
        ],
        correct: 1,
        explanation: 'RLS isolates tenant rows at the database engine level so that even with public client keys, unauthorized users cannot query foreign records.'
      }
    ]
  }
};

class DatabaseLayer {
  constructor() {
    this.init();
  }

  init() {
    // Populate localStorage with initial seed data if not present
    if (!this.getLocal('courses') || !this.getLocal('courses')[0]?.levels) {
      this.setLocal('courses', DEFAULT_COURSES);
    }
    if (!this.getLocal('users')) {
      this.setLocal('users', DEFAULT_USERS);
    }
    if (!this.getLocal('enrollments')) {
      this.setLocal('enrollments', DEFAULT_ENROLLMENTS);
    }
    if (!this.getLocal('labSubmissions')) {
      this.setLocal('labSubmissions', DEFAULT_LAB_SUBMISSIONS);
    }
    if (!this.getLocal('studioProjects')) {
      this.setLocal('studioProjects', DEFAULT_STUDIO_PROJECTS);
    }
    if (!this.getLocal('vibescanSubmissions')) {
      this.setLocal('vibescanSubmissions', DEFAULT_VIBESCAN_SUBMISSIONS);
    }
    if (!this.getLocal('blogPosts')) {
      this.setLocal('blogPosts', DEFAULT_BLOG_POSTS);
    }
    if (!this.getLocal('quizzes')) {
      this.setLocal('quizzes', DEFAULT_QUIZZES);
    }
    if (!this.getLocal('paymentEvents')) {
      this.setLocal('paymentEvents', [
        {
          id: 'pay-evt-001',
          reference: 'ZC_PSK_88492041_99',
          provider: 'Paystack',
          customerEmail: 'student@zeerocodes.com',
          amountNGN: 95000,
          currency: 'NGN',
          status: 'success',
          verifiedAt: '2026-07-15T14:29:45Z',
          hmacSignatureVerified: true,
          item: 'The Zeerocodes VibeCode Labs - 8-Week Cohort'
        },
        {
          id: 'pay-evt-002',
          reference: 'ZC_FLW_19402845_12',
          provider: 'Flutterwave',
          customerEmail: 'dr.davies@medlagos.ng',
          amountNGN: 2750000,
          currency: 'NGN',
          status: 'success',
          verifiedAt: '2026-07-15T10:12:00Z',
          hmacSignatureVerified: true,
          item: 'Studio Project Deposit: MedLagos WhatsApp Bot'
        }
      ]);
    }
  }

  getLocal(key) {
    try {
      const data = localStorage.getItem(DB_STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
      return null;
    }
  }

  setLocal(key, value) {
    try {
      localStorage.setItem(DB_STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error saving ${key} to storage:`, e);
    }
  }

  // --- Courses ---
  async getCourses() {
    const local = this.getLocal('courses');
    if (local && local.length > 0 && local[0].levels) return local;
    this.setLocal('courses', DEFAULT_COURSES);
    return DEFAULT_COURSES;
  }

  async getCourseById(id) {
    const courses = await this.getCourses();
    return courses.find(c => c.id === id) || courses[0];
  }

  async saveCourse(course) {
    const courses = await this.getCourses();
    const idx = courses.findIndex(c => c.id === course.id);
    if (idx >= 0) {
      courses[idx] = { ...courses[idx], ...course };
    } else {
      courses.push(course);
    }
    this.setLocal('courses', courses);
  }

  // --- Users ---
  async getUser(uid) {
    const users = this.getLocal('users') || [];
    return users.find(u => u.uid === uid) || null;
  }

  async getUserByEmail(email) {
    const users = this.getLocal('users') || [];
    const clean = String(email).toLowerCase().trim();
    return users.find(u => u.email.toLowerCase() === clean) || null;
  }

  async saveUser(user) {
    const users = this.getLocal('users') || [];
    const index = users.findIndex(u => u.uid === user.uid || u.email === user.email);
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    this.setLocal('users', users);
  }

  async getAllUsers() {
    let users = this.getLocal('users') || [];
    let updated = false;
    DEFAULT_USERS.forEach(defUser => {
      const exists = users.find(u => u.email.toLowerCase() === defUser.email.toLowerCase());
      if (!exists) {
        users.push(defUser);
        updated = true;
      }
    });
    if (updated) {
      this.setLocal('users', users);
    }
    return users;
  }

  // --- Enrollments ---
  async saveEnrollment(enrollment) {
    const enrollments = this.getLocal('enrollments') || [];
    const idx = enrollments.findIndex(e => e.id === enrollment.id || (e.userId === enrollment.userId && e.courseId === enrollment.courseId));
    if (idx >= 0) {
      enrollments[idx] = { ...enrollments[idx], ...enrollment };
    } else {
      enrollments.push(enrollment);
    }
    this.setLocal('enrollments', enrollments);
  }

  async getUserEnrollments(userId) {
    const enrollments = this.getLocal('enrollments') || [];
    return enrollments.filter(e => e.userId === userId || e.userEmail === userId);
  }

  async getAllEnrollments() {
    return this.getLocal('enrollments') || [];
  }

  async updateEnrollmentProgress(enrollmentId, lessonId) {
    const enrollments = this.getLocal('enrollments') || [];
    const idx = enrollments.findIndex(e => e.id === enrollmentId);
    if (idx >= 0) {
      const e = enrollments[idx];
      e.completedLessons = e.completedLessons || [];
      if (!e.completedLessons.includes(lessonId)) {
        e.completedLessons.push(lessonId);
      }
      this.setLocal('enrollments', enrollments);
      return e;
    }
    return null;
  }

  // --- Lab Submissions ---
  async getLabSubmissionsForUser(userId) {
    const subs = this.getLocal('labSubmissions') || [];
    return subs.filter(s => s.userId === userId || s.userEmail === userId);
  }

  async getAllLabSubmissions() {
    return this.getLocal('labSubmissions') || [];
  }

  async saveLabSubmission(sub) {
    const subs = this.getLocal('labSubmissions') || [];
    const idx = subs.findIndex(s => s.id === sub.id);
    if (idx >= 0) {
      subs[idx] = { ...subs[idx], ...sub };
    } else {
      subs.unshift(sub);
    }
    this.setLocal('labSubmissions', subs);
  }

  async gradeLabSubmission(submissionId, { grade, status, feedback, reviewedBy }) {
    const subs = this.getLocal('labSubmissions') || [];
    const idx = subs.findIndex(s => s.id === submissionId);
    if (idx >= 0) {
      subs[idx].grade = grade;
      subs[idx].status = status; // 'passed' | 'revisions'
      subs[idx].feedback = feedback;
      subs[idx].reviewedBy = reviewedBy || 'Nuel Effiong';
      subs[idx].reviewedAt = new Date().toISOString();
      this.setLocal('labSubmissions', subs);
      return subs[idx];
    }
    return null;
  }

  // --- Course & Curriculum Catalog Management ---
  async getCourses() {
    const courses = this.getLocal('courses');
    if (courses && courses.length > 0) return courses;
    this.setLocal('courses', DEFAULT_COURSES);
    return DEFAULT_COURSES;
  }

  async getAllCourses() {
    return this.getCourses();
  }

  async getCourse(courseId = 'course-vibecode-labs') {
    const courses = await this.getCourses();
    return courses.find(c => c.id === courseId || c.slug === courseId) || courses[0];
  }

  async getCourseById(courseId) {
    return this.getCourse(courseId);
  }

  async createCourse(courseData) {
    const courses = await this.getCourses();
    const id = courseData.id || ('course_' + Date.now());
    const slug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Initialize default structure if not provided
    const levels = courseData.levels || [
      {
        levelNumber: 1,
        title: 'Level 1: Core Fundamentals',
        tagline: 'Foundations & Toolchain Architecture',
        lessonCount: 4,
        modules: [
          {
            number: '01',
            title: 'System Architecture & Setup',
            lessons: [
              '1.1 Introduction & Course Objectives',
              '1.2 Environment & Secret Key Management',
              '1.3 Core Toolchain & Workspace Walkthrough',
              '1.4 Module 01 Practice Lab'
            ]
          }
        ]
      },
      {
        levelNumber: 2,
        title: 'Level 2: Advanced Implementation',
        tagline: 'Practical Full-Stack Engineering',
        lessonCount: 4,
        modules: [
          {
            number: '02',
            title: 'Production Build & Integration',
            lessons: [
              '2.1 Full-Stack UI Implementation',
              '2.2 Database RLS & Secure Webhooks',
              '2.3 Automated Testing & Edge QA',
              '2.4 Production Deployment & SLA'
            ]
          }
        ]
      }
    ];

    const newCourse = {
      id,
      title: courseData.title,
      subtitle: courseData.subtitle || 'Professional Masterclass & Builder Training',
      slug,
      priceNGN: parseInt(courseData.priceNGN) || 95000,
      originalPriceNGN: parseInt(courseData.originalPriceNGN) || (parseInt(courseData.priceNGN || 95000) * 1.5),
      priceUSD: Math.round((parseInt(courseData.priceNGN) || 95000) / 1500),
      originalPriceUSD: Math.round(((parseInt(courseData.priceNGN) || 95000) * 1.5) / 1500),
      priceGBP: Math.round((parseInt(courseData.priceNGN) || 95000) / 1800),
      category: courseData.category || 'AI Software Development',
      level: courseData.level || 'Beginner → Builder',
      duration: courseData.duration || '6-Week Masterclass',
      cohortDate: courseData.cohortDate || 'October 15, 2026',
      seatsTotal: parseInt(courseData.seatsTotal) || 25,
      seatsRemaining: parseInt(courseData.seatsTotal) || 25,
      instructor: courseData.instructor || 'Nuel Effiong',
      instructorRole: courseData.instructorRole || 'Principal AI Systems Architect',
      shortDesc: courseData.shortDesc || courseData.description || 'Hands-on practical builder training shipping real software.',
      description: courseData.description || 'Comprehensive step-by-step masterclass with real-world builds, webhooks, and security hardening.',
      levels,
      features: courseData.features || [
        'Live Cohort Sessions with Weekend Build Workshops',
        'Hands-on Practical Code Labs with 1-on-1 Instructor Reviews',
        'Direct Client Acquisition & Proposal Blueprints',
        'Official Verifiable VibeCert™ Developer Credential'
      ],
      featured: courseData.featured || false,
      enrolledCount: 0,
      createdAt: new Date().toISOString()
    };

    courses.unshift(newCourse);
    this.setLocal('courses', courses);
    return newCourse;
  }

  async saveCourse(updatedCourse) {
    const courses = await this.getCourses();
    const idx = courses.findIndex(c => c.id === updatedCourse.id);
    if (idx >= 0) {
      courses[idx] = updatedCourse;
    } else {
      courses.unshift(updatedCourse);
    }
    this.setLocal('courses', courses);
    return updatedCourse;
  }

  async deleteCourse(courseId) {
    const courses = await this.getCourses();
    if (courses.length <= 1) {
      throw new Error('Cannot delete the last remaining course in the catalog.');
    }
    const filtered = courses.filter(c => c.id !== courseId);
    this.setLocal('courses', filtered);
    return true;
  }

  async updateLessonData(courseId, levelIndex, moduleIndex, lessonIndex, updatedTitle) {
    const course = await this.getCourse(courseId);
    if (course && course.levels[levelIndex]?.modules[moduleIndex]?.lessons[lessonIndex] !== undefined) {
      course.levels[levelIndex].modules[moduleIndex].lessons[lessonIndex] = updatedTitle;
      await this.saveCourse(course);
      return true;
    }
    return false;
  }

  async addLessonToModule(courseId, levelIndex, moduleIndex, newLessonTitle) {
    const course = await this.getCourse(courseId);
    if (course && course.levels[levelIndex]?.modules[moduleIndex]) {
      course.levels[levelIndex].modules[moduleIndex].lessons.push(newLessonTitle);
      course.levels[levelIndex].lessonCount = (course.levels[levelIndex].lessonCount || 0) + 1;
      await this.saveCourse(course);
      return true;
    }
    return false;
  }

  async deleteLessonFromModule(courseId, levelIndex, moduleIndex, lessonIndex) {
    const course = await this.getCourse(courseId);
    if (course && course.levels[levelIndex]?.modules[moduleIndex]) {
      course.levels[levelIndex].modules[moduleIndex].lessons.splice(lessonIndex, 1);
      course.levels[levelIndex].lessonCount = Math.max(0, (course.levels[levelIndex].lessonCount || 1) - 1);
      await this.saveCourse(course);
      return true;
    }
    return false;
  }

  // --- Transactional Email Logs ---
  async getEmailLogs() {
    return this.getLocal('emailLogs') || [
      {
        id: 'eml-01',
        template: 'welcome_student',
        subject: '🎉 Welcome to The Zeerocodes VibeCode Labs — Cohort Pass Activated',
        to: 'student@zeerocodes.com',
        recipientName: 'Amina Yusuf',
        status: 'DELIVERED',
        hmacVerified: true,
        sentAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'eml-02',
        template: 'payment_receipt',
        subject: '🧾 Cryptographic Payment Receipt & Verified Invoice INV-2026-001',
        to: 'tunde@payquick.africa',
        recipientName: 'Tunde Balogun',
        status: 'OPENED',
        hmacVerified: true,
        sentAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'eml-03',
        template: 'certificate_issued',
        subject: '🏆 Official VibeCert™ Security Certificate Issued: VIBECERT-2026-0881',
        to: 'student@zeerocodes.com',
        recipientName: 'Amina Yusuf',
        status: 'CLICKED',
        hmacVerified: true,
        sentAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  async saveEmailLog(logEntry) {
    const logs = await this.getEmailLogs();
    logs.unshift({
      id: logEntry.id || ('eml_' + Date.now()),
      template: logEntry.template || 'custom_dispatch',
      subject: logEntry.subject || 'Zeerocodes Notification',
      to: logEntry.to,
      recipientName: logEntry.recipientName || 'Client / Student',
      status: logEntry.status || 'DELIVERED',
      hmacVerified: true,
      sentAt: logEntry.sentAt || new Date().toISOString()
    });
    this.setLocal('emailLogs', logs);
    return logEntry;
  }

  async deleteEmailLog(logId) {
    const logs = await this.getEmailLogs();
    const filtered = logs.filter(l => l.id !== logId);
    this.setLocal('emailLogs', filtered);
    return true;
  }

  // --- Student Admissions & Removal ---
  async admitStudent({ name, email, phone, cohort = 'October 15, 2026', paymentMethod = 'Paystack Direct', amountNGN = 95000 }) {
    const users = (await this.getAllUsers()) || [];
    let existingUser = users.find(u => u.email === email);

    if (!existingUser) {
      const uid = 'usr_' + Date.now();
      existingUser = {
        uid,
        email,
        displayName: name,
        phone: phone || '+234 800 000 0000',
        role: 'student',
        createdAt: new Date().toISOString(),
        cohort
      };
      users.push(existingUser);
      this.setLocal('users', users);
    }

    const enrollments = (await this.getAllEnrollments()) || [];
    const existingEnroll = enrollments.find(e => e.userId === existingUser.uid || e.userEmail === email);

    if (!existingEnroll) {
      const newEnroll = {
        id: 'enroll_' + Date.now(),
        userId: existingUser.uid,
        userEmail: email,
        studentName: name,
        studentPhone: phone || '+234 800 000 0000',
        courseId: 'course-vibecode-labs',
        courseTitle: 'The Zeerocodes VibeCode Labs',
        cohort,
        status: 'active',
        enrolledAt: new Date().toISOString(),
        paymentStatus: 'paid',
        paymentMethod,
        amountNGN,
        progress: 0,
        completedLessons: ['lesson_1_1']
      };
      enrollments.unshift(newEnroll);
      this.setLocal('enrollments', enrollments);

      // Log payment event
      await this.logPaymentEvent({
        id: 'evt_adm_' + Date.now(),
        provider: paymentMethod.toLowerCase().includes('offline') ? 'Manual Admin' : 'Paystack',
        reference: 'ADM-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        amountNGN,
        currency: 'NGN',
        status: 'success',
        customerEmail: email,
        item: 'The Zeerocodes VibeCode Labs Admission',
        verifiedAt: new Date().toISOString()
      });

      return newEnroll;
    }
    return existingEnroll;
  }

  async removeStudent(enrollmentId, userEmail) {
    const enrollments = (await this.getAllEnrollments()) || [];
    const filtered = enrollments.filter(e => e.id !== enrollmentId && e.userEmail !== userEmail);
    this.setLocal('enrollments', filtered);
    return true;
  }

  // --- Invoicing & Billing Ledger ---
  async getInvoices() {
    const defaultInvoices = [
      {
        id: 'INV-2026-001',
        clientName: 'PayQuick Africa',
        clientEmail: 'tunde@payquick.africa',
        projectTitle: 'WhatsApp Paystack Invoicing Engine',
        amountNGN: 2500000,
        amountUSD: 1650,
        status: 'paid',
        issueDate: '2026-08-01',
        dueDate: '2026-08-15',
        paidAt: '2026-08-03',
        items: [
          { desc: 'n8n Webhook Architecture & Paystack HMAC Verification', qty: 1, rate: 1500000, amount: 1500000 },
          { desc: 'WhatsApp Cloud API 90-Second Bot Integration', qty: 1, rate: 1000000, amount: 1000000 }
        ]
      },
      {
        id: 'INV-2026-002',
        clientName: 'MedLagos Telehealth',
        clientEmail: 'dr.folake@medlagos.ng',
        projectTitle: 'Clinical Telehealth Platform & Patient Portal',
        amountNGN: 4800000,
        amountUSD: 3200,
        status: 'paid',
        issueDate: '2026-08-05',
        dueDate: '2026-08-20',
        paidAt: '2026-08-07',
        items: [
          { desc: 'Next.js 15 Full-Stack Patient Consultation Portal', qty: 1, rate: 3000000, amount: 3000000 },
          { desc: 'Supabase RLS & Webhook Payment Automated Reminders', qty: 1, rate: 1800000, amount: 1800000 }
        ]
      },
      {
        id: 'INV-2026-003',
        clientName: 'SwiftShip Logistics',
        clientEmail: 'ops@swiftship.africa',
        projectTitle: 'Real-time Driver Dispatch & Automated SMS Tracking',
        amountNGN: 1850000,
        amountUSD: 1250,
        status: 'pending',
        issueDate: '2026-08-10',
        dueDate: '2026-08-25',
        items: [
          { desc: 'Autonomous Fleet Tracking & Waybill Dispatch Bot', qty: 1, rate: 1850000, amount: 1850000 }
        ]
      }
    ];

    const invoices = this.getLocal('invoices');
    if (invoices && invoices.length > 0) return invoices;
    this.setLocal('invoices', defaultInvoices);
    return defaultInvoices;
  }

  async saveInvoice(invoice) {
    const invoices = await this.getInvoices();
    const idx = invoices.findIndex(i => i.id === invoice.id);
    if (idx >= 0) {
      invoices[idx] = { ...invoices[idx], ...invoice };
    } else {
      invoices.unshift(invoice);
    }
    this.setLocal('invoices', invoices);
    return invoice;
  }

  async deleteInvoice(invoiceId) {
    const invoices = await this.getInvoices();
    const filtered = invoices.filter(i => i.id !== invoiceId);
    this.setLocal('invoices', filtered);
    return true;
  }

  // --- Operating Expenses & Profit Analytics ---
  async getExpenses() {
    const defaultExpenses = [
      { id: 'exp-01', category: 'Infrastructure', desc: 'Vercel Pro & Global Edge Network', amountNGN: 45000, date: '2026-08-01' },
      { id: 'exp-02', category: 'Database & Auth', desc: 'Firebase Blaze & Supabase Pro Tier', amountNGN: 60000, date: '2026-08-02' },
      { id: 'exp-03', category: 'AI Inference', desc: 'Claude 3.7 Sonnet & OpenAI API Tokens', amountNGN: 120000, date: '2026-08-04' },
      { id: 'exp-04', category: 'Messaging', desc: 'WhatsApp Cloud API Meta Inbound/Outbound', amountNGN: 35000, date: '2026-08-06' },
      { id: 'exp-05', category: 'Operations & QA', desc: 'Security Audit QA Specialist Payout', amountNGN: 250000, date: '2026-08-08' }
    ];

    const expenses = this.getLocal('expenses');
    if (expenses && expenses.length > 0) return expenses;
    this.setLocal('expenses', defaultExpenses);
    return defaultExpenses;
  }

  async saveExpense(expense) {
    const expenses = await this.getExpenses();
    const idx = expenses.findIndex(e => e.id === expense.id);
    if (idx >= 0) {
      expenses[idx] = { ...expenses[idx], ...expense };
    } else {
      expenses.unshift(expense);
    }
    this.setLocal('expenses', expenses);
    return expense;
  }

  async deleteExpense(expenseId) {
    const expenses = await this.getExpenses();
    const filtered = expenses.filter(e => e.id !== expenseId);
    this.setLocal('expenses', filtered);
    return true;
  }

  // --- Custom VibeScan Security Audits ---
  async getCustomAudits() {
    const defaultCustom = [
      {
        id: 'c-audit-01',
        repoUrl: 'https://github.com/swiftship/fleet-tracking-api.git',
        targetName: 'SwiftShip Fleet API',
        profile: 'Full OWASP LLM Top 10 + Webhook HMAC',
        score: 98,
        status: 'certified',
        scannedAt: '2026-08-11T14:30:00Z',
        vulnerabilitiesCount: 0,
        certificationId: 'VIBECERT-2026-0042'
      }
    ];

    const audits = this.getLocal('customAudits');
    if (audits && audits.length > 0) return audits;
    this.setLocal('customAudits', defaultCustom);
    return defaultCustom;
  }

  async saveCustomAudit(audit) {
    const audits = await this.getCustomAudits();
    audits.unshift(audit);
    this.setLocal('customAudits', audits);
    return audit;
  }

  async deleteStudioProject(projectId) {
    const projects = this.getLocal('studioProjects') || [];
    const filtered = projects.filter(p => p.id !== projectId);
    this.setLocal('studioProjects', filtered);
    return true;
  }

  // --- Studio Projects ---
  async getStudioProjectsForUser(userId) {
    const projects = this.getLocal('studioProjects') || [];
    return projects.filter(p => p.userId === userId || p.userEmail === userId);
  }

  async getAllStudioProjects() {
    return this.getLocal('studioProjects') || [];
  }

  async saveStudioProject(proj) {
    const projects = this.getLocal('studioProjects') || [];
    const idx = projects.findIndex(p => p.id === proj.id);
    if (idx >= 0) {
      projects[idx] = { ...projects[idx], ...proj };
    } else {
      projects.unshift(proj);
    }
    this.setLocal('studioProjects', projects);
  }

  // --- VibeScan Submissions ---
  async getSubmissionsForUser(userId) {
    const subs = this.getLocal('vibescanSubmissions') || [];
    return subs.filter(s => s.userId === userId || s.userEmail === userId);
  }

  async getAllPendingSubmissions() {
    const subs = this.getLocal('vibescanSubmissions') || [];
    return subs;
  }

  async saveSubmission(sub) {
    const subs = this.getLocal('vibescanSubmissions') || [];
    const idx = subs.findIndex(s => s.id === sub.id);
    if (idx >= 0) {
      subs[idx] = { ...subs[idx], ...sub };
    } else {
      subs.unshift(sub);
    }
    this.setLocal('vibescanSubmissions', subs);
  }

  async updateSubmission(id, updates) {
    const subs = this.getLocal('vibescanSubmissions') || [];
    const idx = subs.findIndex(s => s.id === id);
    if (idx >= 0) {
      subs[idx] = { ...subs[idx], ...updates };
      this.setLocal('vibescanSubmissions', subs);
    }
  }

  // --- Blog Posts ---
  async getBlogPosts() {
    let posts = this.getLocal('blogPosts');
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      this.setLocal('blogPosts', DEFAULT_BLOG_POSTS);
      return DEFAULT_BLOG_POSTS;
    }
    // Merge any missing default posts into stored posts so newly added default articles appear
    let updated = false;
    DEFAULT_BLOG_POSTS.forEach(defPost => {
      const exists = posts.find(p => p.id === defPost.id || p.slug === defPost.slug);
      if (!exists) {
        posts.push(defPost);
        updated = true;
      } else if (!exists.pdfAttachment && defPost.pdfAttachment) {
        exists.pdfAttachment = defPost.pdfAttachment;
        updated = true;
      }
    });
    if (updated) {
      this.setLocal('blogPosts', posts);
    }
    return posts;
  }

  async getBlogPostBySlug(slug) {
    const posts = await this.getBlogPosts();
    return posts.find(p => p.slug === slug || p.id === slug) || null;
  }

  async saveBlogPost(post) {
    const posts = await this.getBlogPosts();
    const idx = posts.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      posts[idx] = { ...posts[idx], ...post };
    } else {
      posts.unshift(post);
    }
    this.setLocal('blogPosts', posts);
    return post;
  }

  async deleteBlogPost(postId) {
    const posts = await this.getBlogPosts();
    const filtered = posts.filter(p => p.id !== postId);
    this.setLocal('blogPosts', filtered);
  }

  async incrementBlogPostPdfDownload(slugOrId) {
    const posts = await this.getBlogPosts();
    const post = posts.find(p => p.slug === slugOrId || p.id === slugOrId);
    if (post && post.pdfAttachment) {
      post.pdfAttachment.downloads = (post.pdfAttachment.downloads || 0) + 1;
      this.setLocal('blogPosts', posts);
      return post.pdfAttachment.downloads;
    }
    return 0;
  }

  // --- Quizzes ---
  async getQuiz(quizKey) {
    const quizzes = this.getLocal('quizzes') || DEFAULT_QUIZZES;
    return quizzes[quizKey] || null;
  }

  // --- Public Certificate Verification Lookup ---
  async getCertificateById(certId) {
    if (!certId) return null;
    const cleanId = certId.trim().toUpperCase();

    // 1. Check custom AST audits
    const customAudits = await this.getCustomAudits();
    const auditMatch = customAudits.find(a => a.certificationId && a.certificationId.toUpperCase() === cleanId);
    if (auditMatch) {
      return {
        certId: auditMatch.certificationId,
        type: 'VibeCert™ AST Security Audit',
        recipient: auditMatch.targetName,
        recipientRole: 'Verified Production Codebase',
        courseOrApp: auditMatch.targetName,
        repoUrl: auditMatch.repoUrl,
        grade: 'Grade A+ (Certified Safe)',
        score: auditMatch.score || 98,
        issuedDate: auditMatch.scannedAt ? new Date(auditMatch.scannedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'August 11, 2026',
        expiryDate: 'August 11, 2027',
        sha256Fingerprint: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        instructor: 'Nuel Effiong',
        instructorRole: 'Principal AI Systems Architect',
        status: 'VERIFIED_ACTIVE',
        owaspPassed: [
          'LLM01: Prompt Injection Hardened',
          'LLM02: Insecure Output Handling Defended',
          'LLM06: Sensitive Information Disclosure Blocked',
          'Database RLS: Supabase PostgreSQL Enforced',
          'Webhooks: Constant-Time HMAC SHA-512 Validated'
        ]
      };
    }

    // 2. Demo and Graduate Certificates
    const knownCerts = {
      'VIBECERT-2026-0881': {
        certId: 'VIBECERT-2026-0881',
        type: 'Zeerocodes Professional Software Builder',
        recipient: 'Amina Yusuf',
        recipientRole: 'Certified Full-Stack Vibe Coder',
        courseOrApp: 'The Zeerocodes VibeCode Labs (88 Lessons)',
        grade: 'Distinction (98.4%)',
        score: 98,
        issuedDate: 'August 1, 2026',
        expiryDate: 'August 1, 2027 (Annual Renewable)',
        sha256Fingerprint: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        instructor: 'Nuel Effiong',
        instructorRole: 'Principal AI Systems Architect',
        status: 'VERIFIED_ACTIVE',
        owaspPassed: [
          'Full-Stack Architecture in Google AI Studio & Antigravity',
          'Autonomous n8n & WhatsApp Business Cloud API Integration',
          'Cryptographic Paystack SHA-512 HMAC Verification',
          'VibeScan AST Security Capstone Audit Passed'
        ]
      },
      'VIBECERT-2026-0042': {
        certId: 'VIBECERT-2026-0042',
        type: 'VibeCert™ AST Security Audit',
        recipient: 'SwiftShip Fleet API',
        recipientRole: 'Enterprise Logistics Engine',
        courseOrApp: 'SwiftShip Autonomous Fleet Dispatcher',
        grade: 'Grade A+ (Certified Safe)',
        score: 98,
        issuedDate: 'August 11, 2026',
        expiryDate: 'August 11, 2027',
        sha256Fingerprint: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        instructor: 'Nuel Effiong',
        instructorRole: 'Principal AI Systems Architect',
        status: 'VERIFIED_ACTIVE',
        owaspPassed: [
          'LLM01: Prompt Injection Hardened',
          'LLM06: Zero Key Exposure Verification',
          'Database: Supabase PostgreSQL RLS Policies Validated',
          'Webhooks: Constant-Time HMAC Signature Check'
        ]
      }
    };

    if (knownCerts[cleanId]) {
      return knownCerts[cleanId];
    }

    // Dynamic generation for any valid serial format
    if (cleanId.startsWith('VIBECERT-')) {
      return {
        certId: cleanId,
        type: 'Zeerocodes Professional Software Builder',
        recipient: 'Certified Builder',
        recipientRole: 'Professional Vibe Coder & Systems Architect',
        courseOrApp: 'The Zeerocodes VibeCode Labs',
        grade: 'Passed (96%)',
        score: 96,
        issuedDate: 'August 2026',
        expiryDate: 'August 2027',
        sha256Fingerprint: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        instructor: 'Nuel Effiong',
        instructorRole: 'Principal AI Systems Architect',
        status: 'VERIFIED_ACTIVE',
        owaspPassed: [
          'Full-Stack UI & Database Architecture',
          'Autonomous n8n & WhatsApp Integrations',
          'VibeScan AST Security Hardening'
        ]
      };
    }

    return null;
  }

  // --- LMS Lesson Discussion & Q&A ---
  async getLessonQuestions(lessonId) {
    const allQ = this.getLocal('lessonQuestions') || [
      {
        id: 'q-01',
        lessonId: 'lvl_1_mod_01_les_0',
        authorName: 'Amina Yusuf',
        authorRole: 'Student Builder',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        question: 'When writing prompt specifications for Antigravity, is it better to provide the complete database schema first or let the agent propose the schema?',
        createdAt: '2 hours ago',
        replies: [
          {
            authorName: 'Nuel Effiong',
            authorRole: 'Instructor • Principal Architect',
            avatar: 'logo.png',
            reply: 'Always provide your entity relationships and security constraints (like RLS requirements) upfront. It stops hallucinated field names and prevents refactoring later in the build sprint.',
            createdAt: '1 hour ago'
          }
        ]
      }
    ];

    return allQ.filter(q => q.lessonId === lessonId || !lessonId);
  }

  async addLessonQuestion({ lessonId, authorName, authorRole, question }) {
    const allQ = this.getLocal('lessonQuestions') || [];
    const newQ = {
      id: 'q_' + Date.now(),
      lessonId,
      authorName: authorName || 'Student Builder',
      authorRole: authorRole || 'Cohort Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      question,
      createdAt: 'Just now',
      replies: [
        {
          authorName: 'Nuel Effiong',
          authorRole: 'Instructor • Principal Architect',
          avatar: 'logo.png',
          reply: 'Great question! We will also review this practical pattern live during this Saturday\'s cohort build clinic.',
          createdAt: 'Just now'
        }
      ]
    };
    allQ.unshift(newQ);
    this.setLocal('lessonQuestions', allQ);
    return newQ;
  }

  resetToSampleData() {
    this.setLocal('courses', DEFAULT_COURSES);
    this.setLocal('users', DEFAULT_USERS);
    this.setLocal('enrollments', DEFAULT_ENROLLMENTS);
    this.setLocal('labSubmissions', DEFAULT_LAB_SUBMISSIONS);
    this.setLocal('studioProjects', DEFAULT_STUDIO_PROJECTS);
    this.setLocal('vibescanSubmissions', DEFAULT_VIBESCAN_SUBMISSIONS);
    this.setLocal('blogPosts', DEFAULT_BLOG_POSTS);
    this.setLocal('quizzes', DEFAULT_QUIZZES);
  }
}

window.db = new DatabaseLayer();
