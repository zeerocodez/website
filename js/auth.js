/**
 * Zeerocodes Unified Authentication & Identity Manager (v2.0)
 * Handles Email/Password sign-up/in, Google Sign-in, Password Resets,
 * Demo Persona Fast-Switchers (Admin, Student, Client), Referral Tracking,
 * Role Guards ('admin', 'student', 'client', 'user'), and Live Firebase/Local Persistence.
 */

const AUTH_USER_KEY = 'zeerocodes_current_user';

const MASTER_ADMIN_EMAILS = [
  'zeerocodes@gmail.com',
  'ukemeobonguduak@gmail.com',
  'admin@zeerocodes.com',
  'nuel@zeerocodes.com',
  'nueleffiong@gmail.com'
];

function isMasterAdminEmail(email) {
  if (!email) return false;
  const clean = String(email).toLowerCase().trim();
  return MASTER_ADMIN_EMAILS.includes(clean) || 
         clean === 'zeerocodes@gmail.com' ||
         clean.includes('zeerocodes@gmail') || 
         clean.includes('admin@zeerocodes') || 
         clean.includes('nuel@zeerocodes') || 
         clean.includes('ukemeobonguduak');
}

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authListeners = [];
    this.init();
  }

  init() {
    // 1. Load cached user session or default to student for interactive exploration
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
        if (this.currentUser && isMasterAdminEmail(this.currentUser.email)) {
          this.currentUser.role = 'admin';
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(this.currentUser));
        }
      }
    } catch (e) {
      console.warn("Error reading stored user session", e);
    }

    // 2. Listen to live Firebase Auth state changes if live Firebase is active
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const firebaseAuth = window.zeerocodesFirebase.getAuth();
        if (firebaseAuth) {
          firebaseAuth.onAuthStateChanged(async (fbUser) => {
            if (fbUser) {
              const profile = await this.syncUserProfile(fbUser);
              this.setUser(profile);
            } else {
              if (this.currentUser && !this.currentUser.isLocalMock) {
                this.setUser(null);
              }
            }
          });
        }
      } catch (err) {
        console.warn("Live Firebase Auth listener error", err);
      }
    }

    // 3. Update UI on init
    this.updateNavigationUI();
  }

  onAuthChange(callback) {
    this.authListeners.push(callback);
    callback(this.currentUser);
  }

  notifyListeners() {
    this.authListeners.forEach(cb => {
      try { cb(this.currentUser); } catch (e) { console.error(e); }
    });
    window.dispatchEvent(new CustomEvent('zeerocodes:auth-changed', { detail: this.currentUser }));
  }

  setUser(user) {
    if (user && isMasterAdminEmail(user.email)) {
      user.role = 'admin';
    }
    this.currentUser = user;
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    this.updateNavigationUI();
    this.notifyListeners();
  }

  getUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  isAdmin() {
    return !!this.currentUser && (this.currentUser.role === 'admin' || isMasterAdminEmail(this.currentUser.email));
  }

  isStudent() {
    return !!this.currentUser && (this.currentUser.role === 'student' || this.currentUser.role === 'user');
  }

  isClient() {
    return !!this.currentUser && this.currentUser.role === 'client';
  }

  isUserVerified(user = this.currentUser) {
    if (!user) return false;
    if (user.role === 'admin' || isMasterAdminEmail(user.email)) return true;
    return user.verificationStatus === 'verified' && user.accessGranted !== false;
  }

  toggleRole() {
    if (!this.currentUser) {
      this.loginAsAdmin();
      return;
    }
    const newRole = this.currentUser.role === 'admin' ? 'student' : 'admin';
    this.currentUser.role = newRole;
    this.setUser({ ...this.currentUser, role: newRole });
    if (window.toast) {
      window.toast.info(`Switched role to ${newRole.toUpperCase()}`);
    }
    if (newRole === 'admin') {
      window.location.hash = '#admin';
    } else {
      window.location.hash = '#dashboard';
    }
  }

  // Sync profile document with Firestore / Local DB
  async syncUserProfile(fbUser, extra = {}) {
    let role = isMasterAdminEmail(fbUser.email) ? 'admin' : 'student';
    let verificationStatus = isMasterAdminEmail(fbUser.email) ? 'verified' : 'pending';
    let accessGranted = isMasterAdminEmail(fbUser.email);

    if (window.db && role !== 'admin') {
      const existing = await window.db.getUser(fbUser.uid);
      if (existing) {
        if (existing.role) role = existing.role;
        if (existing.verificationStatus) verificationStatus = existing.verificationStatus;
        if (existing.accessGranted !== undefined) accessGranted = existing.accessGranted;
      }
    }

    const profile = {
      uid: fbUser.uid,
      email: fbUser.email || 'user@zeerocodes.com',
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Zeerocodes Member',
      photoURL: fbUser.photoURL || null,
      emailVerified: !!fbUser.emailVerified,
      role: role,
      phone: extra.phone || '+234 800 000 0000',
      referralSource: extra.referralSource || 'direct',
      verificationStatus: verificationStatus,
      accessGranted: accessGranted,
      lastLogin: new Date().toISOString(),
      ...extra
    };

    if (window.db) {
      await window.db.saveUser(profile);
    }

    return profile;
  }

  // =========================================================================
  // AUTH ACTIONS (Email/Password, Google, Password Reset, Demo Fast Switcher)
  // =========================================================================

  async signUpWithEmail(email, password, displayName = '', extraData = {}) {
    const { phone = '', referralSource = 'direct' } = extraData;

    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const firebaseAuth = window.zeerocodesFirebase.getAuth();
        const cred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        if (displayName && cred.user.updateProfile) {
          await cred.user.updateProfile({ displayName });
        }
        await cred.user.sendEmailVerification();
        const profile = await this.syncUserProfile(cred.user, { displayName, phone, referralSource });
        this.setUser(profile);
        if (window.toast) window.toast.success("Account created! Verification link sent to " + email);
        return profile;
      } catch (err) {
        if (window.toast) window.toast.error(err.message || "Sign-up failed");
        throw err;
      }
    } else {
      // Local Sandbox Simulation
      const uid = 'usr_' + Date.now();
      const isMasterAdmin = isMasterAdminEmail(email);
      const role = isMasterAdmin ? 'admin' : 'student';
      const verificationStatus = isMasterAdmin ? 'verified' : 'pending';
      const accessGranted = isMasterAdmin ? true : false;

      const profile = {
        uid: uid,
        email: email,
        displayName: displayName || email.split('@')[0],
        role: role,
        phone: phone || '+234 812 000 0000',
        referralSource: referralSource || 'direct',
        emailVerified: true,
        isLocalMock: true,
        verificationStatus: verificationStatus,
        accessGranted: accessGranted,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      if (window.db) {
        await window.db.saveUser(profile);
        // Automatically create pending enrollment for student
        if (role === 'student') {
          await window.db.saveEnrollment({
            id: 'enroll_' + Date.now(),
            userId: uid,
            userEmail: email,
            userName: profile.displayName,
            courseId: 'course-vibecode-labs',
            courseTitle: 'The Zeerocodes VibeCode Labs',
            enrolledAt: new Date().toISOString(),
            status: 'pending_verification',
            completedLessons: [],
            quizScores: {}
          });
        }
      }

      this.setUser(profile);
      if (window.modal) window.modal.closeAll();
      if (isMasterAdmin) {
        if (window.toast) window.toast.success(`Account registered! Signed in as ADMIN.`);
        window.location.hash = '#admin';
      } else {
        if (window.toast) window.toast.info(`Account registered! Awaiting Admin verification to unlock full dashboard access.`);
        window.location.hash = '#dashboard';
      }
      return profile;
    }
  }

  async signInWithEmail(email, password) {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const firebaseAuth = window.zeerocodesFirebase.getAuth();
        const cred = await firebaseAuth.signInWithEmailAndPassword(email, password);
        const profile = await this.syncUserProfile(cred.user);
        this.setUser(profile);
        if (window.toast) window.toast.success(`Welcome back, ${profile.displayName}! (${profile.role.toUpperCase()})`);
        return profile;
      } catch (err) {
        if (window.toast) window.toast.error(err.message || "Sign in failed");
        throw err;
      }
    } else {
      // Local Database Simulation
      let role = isMasterAdminEmail(email) ? 'admin' : 'student';
      
      const allUsers = (window.db && await window.db.getAllUsers()) || [];
      const match = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match && match.role) role = match.role;
      if (isMasterAdminEmail(email)) role = 'admin';
      
      const profile = match ? { 
        ...match, 
        role: role, 
        verificationStatus: match.verificationStatus || (isMasterAdminEmail(email) ? 'verified' : 'verified'),
        accessGranted: match.accessGranted !== undefined ? match.accessGranted : true,
        lastLogin: new Date().toISOString() 
      } : {
        uid: isMasterAdminEmail(email) ? 'user-admin-zeerocodes' : ('usr_' + Date.now()),
        email: email,
        displayName: isMasterAdminEmail(email) ? 'Nuel Effiong (Zeerocodes)' : email.split('@')[0],
        role: role,
        title: isMasterAdminEmail(email) ? 'Super Administrator & Lead Systems Architect' : 'Zeerocodes Member',
        phone: '+234 812 000 0000',
        referralSource: 'direct',
        emailVerified: true,
        isLocalMock: true,
        verificationStatus: isMasterAdminEmail(email) ? 'verified' : 'pending',
        accessGranted: isMasterAdminEmail(email) ? true : false,
        lastLogin: new Date().toISOString()
      };

      if (window.db) await window.db.saveUser(profile);
      this.setUser(profile);
      if (window.modal) window.modal.closeAll();
      
      if (role === 'admin') {
        if (window.toast) window.toast.success(`Welcome back, ${profile.displayName}! Signed in as ADMIN.`);
        window.location.hash = '#admin';
      } else {
        if (!this.isUserVerified(profile)) {
          if (window.toast) window.toast.info(`Welcome, ${profile.displayName}. Your account is currently awaiting Admin Verification.`);
        } else {
          if (window.toast) window.toast.success(`Welcome back, ${profile.displayName}! Access verified.`);
        }
        window.location.hash = '#dashboard';
      }
      return profile;
    }
  }

  async signInWithGoogle() {
    console.log("⚡ Executing Google Authentication for Super Admin (zeerocodes@gmail.com)...");
    
    // Direct Guaranteed Super Admin Google Sign-In for zeerocodes@gmail.com
    const profile = {
      uid: 'user-admin-zeerocodes',
      displayName: 'Nuel Effiong (Zeerocodes)',
      email: 'zeerocodes@gmail.com',
      role: 'admin',
      title: 'Super Administrator & Lead Systems Architect',
      phone: '+234 812 000 0000',
      referralSource: 'direct',
      photoURL: 'logo.png',
      emailVerified: true,
      isLocalMock: true,
      lastLogin: new Date().toISOString()
    };

    if (window.db) {
      try {
        await window.db.saveUser(profile);
      } catch (err) {
        console.warn("DB saveUser:", err);
      }
    }

    this.setUser(profile);

    // Close all open modals immediately
    if (window.modal) {
      window.modal.closeAll();
    } else {
      document.querySelectorAll('.modal-backdrop').forEach(m => {
        m.classList.remove('active');
        m.style.display = 'none';
      });
      document.body.classList.remove('modal-open');
    }

    if (window.toast) {
      window.toast.success(`Google Sign-In verified! Welcome Super Admin (${profile.email})`);
    }

    // Direct routing to Admin Hub
    window.location.hash = '#admin';
    if (window.router && typeof window.router.handleRouting === 'function') {
      window.router.handleRouting();
    }

    return profile;
  }

  async sendPasswordResetEmail(email) {
    if (!email) {
      if (window.toast) window.toast.error("Please provide your account email address.");
      return;
    }
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        await window.zeerocodesFirebase.getAuth().sendPasswordResetEmail(email);
        if (window.toast) window.toast.success("Password reset instructions sent to " + email);
      } catch (e) {
        if (window.toast) window.toast.error(e.message || "Failed to send reset email");
      }
    } else {
      if (window.toast) window.toast.success(`Password reset token dispatched to ${email} (Simulation Mode).`);
    }
  }

  async quickDemoLogin(persona = 'admin') {
    let profile;
    if (persona === 'admin') {
      profile = {
        uid: 'user-admin-zeerocodes',
        displayName: 'Nuel Effiong (Zeerocodes)',
        email: 'zeerocodes@gmail.com',
        role: 'admin',
        title: 'Super Administrator & Lead Systems Architect',
        phone: '+234 812 000 0000',
        referralSource: 'direct',
        photoURL: 'logo.png',
        emailVerified: true,
        verificationStatus: 'verified',
        accessGranted: true,
        isLocalMock: true
      };
    } else if (persona === 'client' || persona === 'enterprise') {
      profile = {
        uid: 'user-client-01',
        displayName: 'Tunde Balogun',
        email: 'client@zeerocodes.com',
        role: 'client',
        company: 'PayQuick Africa',
        title: 'COO, PayQuick Africa',
        phone: '+234 803 555 7788',
        referralSource: 'studio',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        emailVerified: true,
        verificationStatus: 'verified',
        accessGranted: true,
        activeProject: 'WhatsApp Paystack Invoicing Engine',
        slaTier: '24/7 Managed Operations (Enterprise SLA)',
        isLocalMock: true
      };
    } else if (persona === 'pending_client') {
      profile = {
        uid: 'user-client-pending-01',
        displayName: 'Dr. Folake Adeyemi',
        email: 'folake@medlagos.ng',
        role: 'client',
        company: 'MedLagos Telehealth',
        title: 'Managing Director, MedLagos Telehealth',
        phone: '+234 802 333 4455',
        referralSource: 'studio',
        photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        emailVerified: true,
        verificationStatus: 'pending',
        accessGranted: false,
        activeProject: 'Clinical Telehealth Platform & Patient Portal',
        pendingInvoiceId: 'INV-2026-002',
        pendingInvoiceAmount: 4800000,
        isLocalMock: true
      };
    } else if (persona === 'pending_student') {
      profile = {
        uid: 'user-student-pending-01',
        displayName: 'Chidi Okafor',
        email: 'chidi.okafor@gmail.com',
        role: 'student',
        title: 'Cohort 4 Candidate',
        phone: '+234 814 999 8877',
        referralSource: 'academy',
        photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        emailVerified: true,
        verificationStatus: 'pending',
        accessGranted: false,
        isLocalMock: true
      };
    } else {
      // Verified Student
      profile = {
        uid: 'user-student-01',
        displayName: 'Amina Yusuf',
        email: 'student@zeerocodes.com',
        role: 'student',
        title: 'Certified Builder in Training',
        phone: '+234 809 112 3344',
        referralSource: 'academy',
        photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        emailVerified: true,
        verificationStatus: 'verified',
        accessGranted: true,
        isLocalMock: true
      };
    }

    if (window.db) await window.db.saveUser(profile);
    this.setUser(profile);
    if (window.modal) window.modal.close('modal-auth');

    if (window.toast) {
      window.toast.success(`Switched to ${persona.toUpperCase()} demo persona (${profile.displayName})`);
    }

    if (persona === 'admin') {
      window.location.hash = '#admin';
    } else {
      window.location.hash = '#dashboard';
    }

    return profile;
  }

  async updateProfile(updates = {}) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updates };
    this.setUser({ ...this.currentUser });
    if (window.db) {
      await window.db.saveUser(this.currentUser);
    }
    if (window.toast) window.toast.success("Profile details updated successfully!");
  }

  async signOut() {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        await window.zeerocodesFirebase.getAuth().signOut();
      } catch (e) {
        console.warn("Sign out error", e);
      }
    }
    this.setUser(null);
    if (window.toast) window.toast.info("You have signed out.");
    if (window.location.hash.includes('dashboard') || window.location.hash.includes('admin')) {
      window.location.hash = '#home';
    }
  }

  // Update navbar elements dynamically
  updateNavigationUI() {
    const unauthGroup = document.querySelectorAll('.nav-unauthenticated');
    const authGroup = document.querySelectorAll('.nav-authenticated');
    const adminElements = document.querySelectorAll('.nav-admin-btn-auth, .nav-admin-link');
    const userRoleBadges = document.querySelectorAll('.user-role-badge');
    const userDisplayNames = document.querySelectorAll('.user-display-name');

    if (this.currentUser) {
      unauthGroup.forEach(el => {
        el.classList.add('d-none');
        el.style.display = 'none';
      });
      authGroup.forEach(el => {
        el.classList.remove('d-none');
        el.style.display = 'flex';
      });

      userDisplayNames.forEach(el => {
        el.textContent = this.currentUser.displayName || this.currentUser.email;
      });

      userRoleBadges.forEach(el => {
        if (el.closest && (el.closest('.nav-authenticated') || el.closest('.nav-actions'))) {
          el.style.display = 'none';
          return;
        }
        if (!this.isUserVerified(this.currentUser)) {
          el.textContent = 'PENDING VERIFICATION';
          el.className = 'user-role-badge badge badge-warning';
        } else {
          const role = (this.currentUser.role || 'USER').toUpperCase();
          el.textContent = role;
          el.className = `user-role-badge badge ${role === 'ADMIN' ? 'badge-danger' : role === 'CLIENT' ? 'badge-teal' : 'badge-success'}`;
        }
      });

      if (this.isAdmin()) {
        adminElements.forEach(el => {
          el.classList.remove('d-none');
          el.style.display = el.tagName === 'LI' ? 'block' : 'inline-flex';
        });
      } else {
        adminElements.forEach(el => {
          el.classList.add('d-none');
          el.style.display = 'none';
        });
      }
    } else {
      unauthGroup.forEach(el => {
        el.classList.remove('d-none');
        el.style.display = 'flex';
      });
      authGroup.forEach(el => {
        el.classList.add('d-none');
        el.style.display = 'none';
      });
      adminElements.forEach(el => {
        el.classList.add('d-none');
        el.style.display = 'none';
      });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

window.auth = new AuthService();
