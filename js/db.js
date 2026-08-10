/**
 * Zeerocodes Cloud Firestore & Data Layer
 * Handles the 8 core collections:
 * 1. users
 * 2. courses (The Zeerocodes VibeCode Labs - Flagship Cohort)
 * 3. enrollments
 * 4. studioProjects
 * 5. vibescanSubmissions
 * 6. auditReports
 * 7. certifications
 * 8. paymentEvents
 */

const DB_STORAGE_PREFIX = 'zeerocodes_db_';

// Flagship Cohort Course: The Zeerocodes VibeCode Labs (4 Levels • 20 Modules • 88 Lessons)
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
    level: 'Beginner → Builder → Certified Professional',
    duration: '8-Week Live Cohort (88 Lessons)',
    cohortDate: 'October 15, 2026',
    seatsTotal: 30,
    seatsRemaining: 8,
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
              '12.4 Scheduling Background Agent Tasks',
              '12.5 Guardrails: Keeping Autonomous Agents From Doing Something Dumb'
            ]
          },
          {
            number: '13',
            title: 'AI Security Fundamentals',
            lessons: [
              '13.1 Why Vibe-Coded Apps Get Hacked (real failure patterns)',
              '13.2 The OWASP LLM Top 10, Explained for Non-Engineers',
              '13.3 Prompt Injection: What It Is and How to Defend Against It',
              '13.4 Secrets Hygiene: API Keys, Environment Variables, .env Files',
              '13.5 Authentication Done Right: Hashing, Sessions, Common Mistakes',
              '13.6 NDPR and Data Protection Basics for Nigerian Builders'
            ]
          },
          {
            number: '14',
            title: 'Auditing With VibeScan',
            lessons: [
              '14.1 Introducing VibeScan: VibeAudit, SecretShield, AgentGuard',
              '14.2 Running Your First Security Scan',
              '14.3 Reading a VibeCert Report and Fixing What It Finds',
              '14.4 Case Study: Catching a Non-Bcrypt Password Bug Before Launch'
            ]
          },
          {
            number: '15',
            title: 'Deployment, Cost Control, and Local Payments',
            lessons: [
              '15.1 Deploying to Cloud Run and Firebase Hosting',
              '15.2 Reading Your Gemini and Firebase Bill Before It Surprises You',
              '15.3 Integrating Paystack and Flutterwave',
              '15.4 Designing for Nigerian Bandwidth and Data Costs'
            ]
          },
          {
            number: '16',
            title: 'Capstone Build',
            lessons: [
              '16.1 Capstone Brief: Build, Automate, Secure, and Ship a Real Business App',
              '16.2 Peer Review and Client-Style Presentation',
              '16.3 VibeScan Certification Audit'
            ]
          }
        ]
      },
      {
        levelNumber: 4,
        title: 'Level 4: Launch (Earn, Sell, Scale)',
        tagline: 'Monetization, Client Acquisition & Certification',
        lessonCount: 20,
        modules: [
          {
            number: '17',
            title: 'Turning Skill Into Income',
            lessons: [
              '17.1 Packaging What You Build Into a Sellable Service',
              '17.2 Pricing in Naira: Value-Based vs Hourly vs Retainer',
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
    enrolledCount: 450
  }
];

const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub-demo-001',
    userId: 'user-sample-01',
    userEmail: 'kemi.adebayo@payquick.ng',
    userName: 'Kemi Adebayo',
    appName: 'PayQuick Africa Micro-Lending Portal',
    appUrl: 'https://github.com/payquick-africa/portal-app',
    liveUrl: 'https://payquick.ng',
    techStack: 'Next.js 14, Supabase Auth, Paystack API, Tailwind',
    buildMethod: 'AI-assisted / vibe-coded (Cursor + Claude 3.5)',
    referralSource: 'academy',
    submittedAt: '2026-08-01T10:00:00Z',
    status: 'certified',
    certificationId: 'VIBECERT-2026-0042',
    notes: 'Pre-seed pitch audit requested. Customer data encryption validated.'
  }
];

class DatabaseLayer {
  constructor() {
    this.init();
  }

  init() {
    // Populate localStorage with initial seed data if not present or if outdated
    const storedCourses = this.getLocal('courses');
    if (!storedCourses || storedCourses.length === 0 || !storedCourses[0].levels) {
      this.setLocal('courses', DEFAULT_COURSES);
    }

    if (!this.getLocal('submissions')) {
      this.setLocal('submissions', DEFAULT_SUBMISSIONS);
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

  async getUser(uid) {
    const users = this.getLocal('users') || [];
    return users.find(u => u.uid === uid) || null;
  }

  async saveUser(user) {
    const users = this.getLocal('users') || [];
    const index = users.findIndex(u => u.uid === user.uid);
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    this.setLocal('users', users);
  }

  async getAllUsers() {
    return this.getLocal('users') || [];
  }

  async saveEnrollment(enrollment) {
    const enrollments = this.getLocal('enrollments') || [];
    enrollments.push(enrollment);
    this.setLocal('enrollments', enrollments);
  }

  async getUserEnrollments(userId) {
    const enrollments = this.getLocal('enrollments') || [];
    return enrollments.filter(e => e.userId === userId);
  }

  async saveSubmission(sub) {
    const submissions = this.getLocal('submissions') || [];
    submissions.push(sub);
    this.setLocal('submissions', submissions);
  }

  async getSubmissionsForUser(userId) {
    const submissions = this.getLocal('submissions') || [];
    return submissions.filter(s => s.userId === userId);
  }

  async getAllPendingSubmissions() {
    return this.getLocal('submissions') || [];
  }

  async updateSubmission(id, updates) {
    const submissions = this.getLocal('submissions') || [];
    const idx = submissions.findIndex(s => s.id === id);
    if (idx >= 0) {
      submissions[idx] = { ...submissions[idx], ...updates };
      this.setLocal('submissions', submissions);
    }
  }

  async getStudioProjectsForUser(userId) {
    return this.getLocal('studioProjects') || [];
  }

  resetToSampleData() {
    this.setLocal('courses', DEFAULT_COURSES);
    this.setLocal('submissions', DEFAULT_SUBMISSIONS);
  }
}

window.db = new DatabaseLayer();
