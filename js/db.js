/**
 * Zeerocodes Cloud Firestore & Data Layer
 * Handles the 8 core collections:
 * 1. users
 * 2. courses
 * 3. enrollments
 * 4. studioProjects
 * 5. vibescanSubmissions
 * 6. auditReports
 * 7. certifications
 * 8. paymentEvents
 */

const DB_STORAGE_PREFIX = 'zeerocodes_db_';

// Initial Mock Seed Data
const DEFAULT_COURSES = [
  {
    id: 'course-ai-automation-n8n',
    title: 'AI Automation with n8n, WhatsApp & Paystack',
    slug: 'ai-automation-n8n-whatsapp',
    priceNGN: 65000,
    priceUSD: 45,
    level: 'Beginner to Intermediate',
    duration: '4 Weeks (Hands-on)',
    shortDesc: 'Build production-ready, revenue-generating workflows for Nigerian and African businesses with zero server maintenance.',
    description: 'Learn how to engineer high-converting WhatsApp commerce bots, automated Paystack invoice reconciliation, and customer AI support workflows using n8n and Claude/OpenAI.',
    modules: [
      'Module 1: Foundations of Event-Driven Automation in Africa',
      'Module 2: Mastering n8n Nodes, Webhooks & Data Transformation',
      'Module 3: WhatsApp Cloud API & Interactive Flow Engineering',
      'Module 4: Paystack & Flutterwave Webhook Signature Verification',
      'Module 5: Deploying & Securing Self-Hosted n8n on Ubuntu/Docker'
    ],
    featured: true,
    enrolledCount: 142
  },
  {
    id: 'course-vibe-coding-secure',
    title: 'Vibe-Coding Securely: From Cursor/Lovable to Production',
    slug: 'vibe-coding-securely',
    priceNGN: 85000,
    priceUSD: 60,
    level: 'Intermediate to Advanced',
    duration: '3 Weeks Intensive',
    shortDesc: 'Learn how to ship fast with AI coding assistants without introducing OWASP Top 10 vulnerabilities or leaking API keys.',
    description: 'AI code generators produce code fast, but 40%+ contains silent security flaws. Master auth hardening, secret isolation, CORS protection, and how to prepare your app for VibeScan certification.',
    modules: [
      'Module 1: The AI Coding Trap & OWASP LLM Vulnerability Breakdown',
      'Module 2: Hardening Firebase & Supabase Row-Level Security',
      'Module 3: Server-Side Webhook Protection & Secret Rotation',
      'Module 4: Automated CI/CD Security Gates & Static Code Auditing',
      'Module 5: Pre-Audit VibeScan Checklist & Compliance Ready Badging'
    ],
    featured: true,
    enrolledCount: 98
  },
  {
    id: 'course-prompt-to-saas',
    title: 'Prompt-to-SaaS: Building Full-Stack EdTech & Micro-Tools',
    slug: 'prompt-to-saas',
    priceNGN: 55000,
    priceUSD: 40,
    level: 'Beginner',
    duration: '3 Weeks',
    shortDesc: 'Turn business domain expertise into monetized, clean web apps tailored for local logistics and mobile-first users.',
    description: 'A founder-led masterclass on taking software ideas from conversational prompts to live domains with responsive UX, user authentication, and subscription billing.',
    modules: [
      'Module 1: Product Definition & System Architecture for Africa',
      'Module 2: Rapid Prototyping with Modern Frontend Frameworks',
      'Module 3: Database Modeling & Multi-tenant User Management',
      'Module 4: Localized Payment Integration & Access Control',
      'Module 5: Launch Strategy, SEO & Distribution in Emerging Markets'
    ],
    featured: false,
    enrolledCount: 215
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
    status: 'pending_review', // pending_review | in_progress | certified | rejected
    notes: 'Built through Zeerocodes Academy. Looking for full certification before investor demo.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'sub-demo-002',
    userId: 'user-sample-02',
    userEmail: 'tunde@swiftlogistics.co',
    userName: 'Tunde Bakare',
    appName: 'SwiftShip Dispatch Assistant Bot',
    appUrl: 'https://github.com/swiftlogistics/dispatch-bot',
    liveUrl: 'https://swiftlogistics.co/dispatch',
    techStack: 'Node.js, Express, WhatsApp Cloud API, Firebase Firestore',
    buildMethod: 'AI-assisted / vibe-coded',
    referralSource: 'studio',
    status: 'pending_review',
    notes: 'Handles rider routing and dispatching. Need security verification on customer location data.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString()
  },
  {
    id: 'sub-demo-003',
    userId: 'user-sample-03',
    userEmail: 'amara.okafor@eduvault.io',
    userName: 'Amara Okafor',
    appName: 'EduVault Nigeria Exam Prep Platform',
    appUrl: 'https://github.com/eduvault/platform',
    liveUrl: 'https://eduvault.io',
    techStack: 'React, FastAPI, PostgreSQL, Flutterwave',
    buildMethod: 'traditional development',
    referralSource: 'direct',
    status: 'certified',
    notes: 'Passed all 10 OWASP LLM security benchmarks. Score: 96/100 (Grade A).',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    certificationId: 'VIBECERT-2026-0042'
  }
];

const DEFAULT_STUDIO_PROJECTS = [
  {
    id: 'proj-demo-101',
    userId: 'user-sample-02',
    userEmail: 'tunde@swiftlogistics.co',
    title: 'WhatsApp Automated Dispatch & Waybill Reconciliation',
    status: 'building', // scoping | building | testing | deployed
    milestone: 'Milestone 2: Payment Webhook Integration',
    progressPercent: 65,
    summary: 'Automating customer delivery status inquiries, payment receipts via Paystack webhook, and rider dispatch matching.',
    startedAt: '2026-07-15'
  }
];

class DatabaseService {
  constructor() {
    this.initLocalCollections();
  }

  initLocalCollections() {
    if (!this.getLocal('courses')) {
      this.setLocal('courses', DEFAULT_COURSES);
    }
    if (!this.getLocal('vibescanSubmissions')) {
      this.setLocal('vibescanSubmissions', DEFAULT_SUBMISSIONS);
    }
    if (!this.getLocal('studioProjects')) {
      this.setLocal('studioProjects', DEFAULT_STUDIO_PROJECTS);
    }
    if (!this.getLocal('enrollments')) {
      this.setLocal('enrollments', []);
    }
    if (!this.getLocal('users')) {
      this.setLocal('users', [
        {
          uid: 'admin-sample',
          email: 'admin@zeerocodes.com',
          displayName: 'Zeerocodes Admin',
          role: 'admin',
          emailVerified: true,
          createdAt: new Date().toISOString()
        },
        {
          uid: 'user-sample-01',
          email: 'kemi.adebayo@payquick.ng',
          displayName: 'Kemi Adebayo',
          role: 'user',
          emailVerified: true,
          createdAt: new Date().toISOString()
        }
      ]);
    }
    if (!this.getLocal('auditReports')) {
      this.setLocal('auditReports', []);
    }
    if (!this.getLocal('certifications')) {
      this.setLocal('certifications', [
        {
          certId: 'VIBECERT-2026-0042',
          appName: 'EduVault Nigeria Exam Prep Platform',
          recipient: 'Amara Okafor',
          grade: 'A (96%)',
          issuedDate: '2026-08-01',
          expiryDate: '2027-08-01',
          badgeUrl: '#',
          owaspPassed: 10,
          owaspTotal: 10
        }
      ]);
    }
    if (!this.getLocal('paymentEvents')) {
      this.setLocal('paymentEvents', []);
    }
  }

  getLocal(collectionName) {
    try {
      const raw = localStorage.getItem(DB_STORAGE_PREFIX + collectionName);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("DB read error:", collectionName, e);
      return null;
    }
  }

  setLocal(collectionName, data) {
    try {
      localStorage.setItem(DB_STORAGE_PREFIX + collectionName, JSON.stringify(data));
    } catch (e) {
      console.warn("DB write error:", collectionName, e);
    }
  }

  // ==========================================
  // COURSES
  // ==========================================
  async getCourses() {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const snap = await window.zeerocodesFirebase.getDb().collection('courses').get();
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn("Live Firestore getCourses failed, using local", err);
      }
    }
    return this.getLocal('courses') || DEFAULT_COURSES;
  }

  async getCourseById(courseId) {
    const courses = await this.getCourses();
    return courses.find(c => c.id === courseId);
  }

  // ==========================================
  // USERS
  // ==========================================
  async getUser(uid) {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const doc = await window.zeerocodesFirebase.getDb().collection('users').doc(uid).get();
        if (doc.exists) return { uid: doc.id, ...doc.data() };
      } catch (e) {
        console.warn("Live Firestore getUser failed", e);
      }
    }
    const users = this.getLocal('users') || [];
    return users.find(u => u.uid === uid);
  }

  async saveUser(userProfile) {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        await window.zeerocodesFirebase.getDb().collection('users').doc(userProfile.uid).set(userProfile, { merge: true });
      } catch (e) {
        console.warn("Live Firestore saveUser failed", e);
      }
    }
    const users = this.getLocal('users') || [];
    const idx = users.findIndex(u => u.uid === userProfile.uid);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...userProfile };
    } else {
      users.push(userProfile);
    }
    this.setLocal('users', users);
  }

  async getAllUsers() {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const snap = await window.zeerocodesFirebase.getDb().collection('users').get();
        return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      } catch (e) {
        console.warn("Live Firestore getAllUsers error", e);
      }
    }
    return this.getLocal('users') || [];
  }

  // ==========================================
  // ENROLLMENTS
  // ==========================================
  async getUserEnrollments(userId) {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const snap = await window.zeerocodesFirebase.getDb().collection('enrollments')
          .where('userId', '==', userId).get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn("Live Firestore getUserEnrollments error", e);
      }
    }
    const enrollments = this.getLocal('enrollments') || [];
    return enrollments.filter(e => e.userId === userId);
  }

  async createEnrollment(enrollmentData) {
    const record = {
      id: 'enr-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active',
      progressPercent: 0,
      completedLessons: [],
      ...enrollmentData
    };

    if (window.zeerocodesFirebase?.isLive()) {
      try {
        await window.zeerocodesFirebase.getDb().collection('enrollments').doc(record.id).set(record);
      } catch (e) {
        console.warn("Live Firestore createEnrollment error", e);
      }
    }
    const enrollments = this.getLocal('enrollments') || [];
    enrollments.push(record);
    this.setLocal('enrollments', enrollments);
    return record;
  }

  // ==========================================
  // VIBESCAN SUBMISSIONS
  // ==========================================
  async getSubmissionsForUser(userId) {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const snap = await window.zeerocodesFirebase.getDb().collection('vibescanSubmissions')
          .where('userId', '==', userId).get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn("Live Firestore getSubmissionsForUser error", e);
      }
    }
    const submissions = this.getLocal('vibescanSubmissions') || [];
    return submissions.filter(s => s.userId === userId);
  }

  async getAllPendingSubmissions() {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const snap = await window.zeerocodesFirebase.getDb().collection('vibescanSubmissions').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn("Live Firestore getAllPendingSubmissions error", e);
      }
    }
    return this.getLocal('vibescanSubmissions') || [];
  }

  async createVibescanSubmission(subData) {
    const record = {
      id: 'sub-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      ...subData
    };

    if (window.zeerocodesFirebase?.isLive()) {
      try {
        await window.zeerocodesFirebase.getDb().collection('vibescanSubmissions').doc(record.id).set(record);
      } catch (e) {
        console.warn("Live Firestore createVibescanSubmission error", e);
      }
    }

    const submissions = this.getLocal('vibescanSubmissions') || [];
    submissions.unshift(record);
    this.setLocal('vibescanSubmissions', submissions);
    return record;
  }

  async updateSubmissionStatus(subId, newStatus, certData = null) {
    const submissions = this.getLocal('vibescanSubmissions') || [];
    const idx = submissions.findIndex(s => s.id === subId);
    if (idx >= 0) {
      submissions[idx].status = newStatus;
      submissions[idx].reviewedAt = new Date().toISOString();
      if (certData) {
        submissions[idx].certificationId = certData.certId;
      }
      this.setLocal('vibescanSubmissions', submissions);
    }

    if (window.zeerocodesFirebase?.isLive()) {
      try {
        await window.zeerocodesFirebase.getDb().collection('vibescanSubmissions').doc(subId).update({
          status: newStatus,
          reviewedAt: new Date().toISOString(),
          ...(certData ? { certificationId: certData.certId } : {})
        });
      } catch (e) {
        console.warn("Live Firestore updateSubmissionStatus error", e);
      }
    }

    if (certData) {
      await this.issueCertification(certData);
    }
  }

  // ==========================================
  // CERTIFICATIONS
  // ==========================================
  async getCertifications() {
    return this.getLocal('certifications') || [];
  }

  async issueCertification(certData) {
    const cert = {
      certId: certData.certId || 'VIBECERT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      grade: 'A (Verified Safe)',
      owaspPassed: 10,
      owaspTotal: 10,
      ...certData
    };

    const certs = this.getLocal('certifications') || [];
    certs.unshift(cert);
    this.setLocal('certifications', certs);

    if (window.zeerocodesFirebase?.isLive()) {
      try {
        await window.zeerocodesFirebase.getDb().collection('certifications').doc(cert.certId).set(cert);
      } catch (e) {
        console.warn("Live Firestore issueCertification error", e);
      }
    }
    return cert;
  }

  // ==========================================
  // STUDIO PROJECTS
  // ==========================================
  async getStudioProjectsForUser(userId) {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const snap = await window.zeerocodesFirebase.getDb().collection('studioProjects')
          .where('userId', '==', userId).get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn("Live Firestore getStudioProjectsForUser error", e);
      }
    }
    const projects = this.getLocal('studioProjects') || [];
    return projects.filter(p => p.userId === userId);
  }

  async createStudioBooking(bookingData) {
    const record = {
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'scoping',
      milestone: 'Discovery Call Scheduled',
      progressPercent: 10,
      ...bookingData
    };

    const projects = this.getLocal('studioProjects') || [];
    projects.push(record);
    this.setLocal('studioProjects', projects);

    if (window.zeerocodesFirebase?.isLive()) {
      try {
        await window.zeerocodesFirebase.getDb().collection('studioProjects').doc(record.id).set(record);
      } catch (e) {
        console.warn("Live Firestore createStudioBooking error", e);
      }
    }
    return record;
  }

  // Reset/Seed helper for testing
  resetToSampleData() {
    localStorage.removeItem(DB_STORAGE_PREFIX + 'courses');
    localStorage.removeItem(DB_STORAGE_PREFIX + 'vibescanSubmissions');
    localStorage.removeItem(DB_STORAGE_PREFIX + 'studioProjects');
    localStorage.removeItem(DB_STORAGE_PREFIX + 'enrollments');
    localStorage.removeItem(DB_STORAGE_PREFIX + 'users');
    localStorage.removeItem(DB_STORAGE_PREFIX + 'certifications');
    this.initLocalCollections();
  }
}

window.db = new DatabaseService();
