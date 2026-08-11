/**
 * Zeerocodes Unified Firebase Authentication Manager
 * Handles Email/Password sign-up/in, Google Sign-in, email verification,
 * user roles ('user' vs 'admin'), and live session persistence.
 */

const AUTH_USER_KEY = 'zeerocodes_current_user';

const MASTER_ADMIN_EMAILS = [
  'zeerocodes@gmail.com',
  'admin@zeerocodes.com',
  'nuel@zeerocodes.com',
  'nueleffiong@gmail.com'
];

function isMasterAdminEmail(email) {
  if (!email) return false;
  const clean = String(email).toLowerCase().trim();
  return MASTER_ADMIN_EMAILS.includes(clean) || clean.includes('admin@zeerocodes') || clean.includes('nuel@zeerocodes');
}

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authListeners = [];
    this.init();
  }

  init() {
    // 1. Try loading cached user session
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
        // Ensure master admin emails are always upgraded to admin
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
              // Only clear if we were live
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

  isEmailVerified() {
    return !!this.currentUser && !!this.currentUser.emailVerified;
  }

  // Sync profile document with Firestore
  async syncUserProfile(fbUser, extra = {}) {
    let role = isMasterAdminEmail(fbUser.email) ? 'admin' : 'user';
    // Check if user already exists in Firestore/db
    if (window.db && role !== 'admin') {
      const existing = await window.db.getUser(fbUser.uid);
      if (existing && existing.role) {
        role = existing.role;
      }
    }

    const profile = {
      uid: fbUser.uid,
      email: fbUser.email || 'user@zeerocodes.com',
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Zeerocodes Member',
      photoURL: fbUser.photoURL || null,
      emailVerified: !!fbUser.emailVerified,
      role: role,
      lastLogin: new Date().toISOString(),
      ...extra
    };

    if (window.db) {
      await window.db.saveUser(profile);
    }

    return profile;
  }

  // =========================================================================
  // AUTH ACTIONS (Email/Password & Google)
  // =========================================================================

  async signUpWithEmail(email, password, displayName = '') {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const firebaseAuth = window.zeerocodesFirebase.getAuth();
        const cred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        if (displayName && cred.user.updateProfile) {
          await cred.user.updateProfile({ displayName });
        }
        await cred.user.sendEmailVerification();
        const profile = await this.syncUserProfile(cred.user, { displayName });
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
      const role = isMasterAdminEmail(email) ? 'admin' : 'user';
      const profile = {
        uid: uid,
        email: email,
        displayName: displayName || email.split('@')[0],
        role: role,
        emailVerified: true,
        isLocalMock: true,
        createdAt: new Date().toISOString()
      };

      if (window.db) await window.db.saveUser(profile);
      this.setUser(profile);
      if (window.toast) window.toast.success(`Account registered with ${role.toUpperCase()} privileges!`);
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
      // Local Sandbox Simulation
      let role = isMasterAdminEmail(email) ? 'admin' : 'user';
      
      // Check existing user in local db
      const allUsers = (window.db && window.db.getLocal('users')) || [];
      const match = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match && match.role === 'admin') role = 'admin';
      
      const profile = {
        uid: match ? match.uid : 'usr_' + Date.now(),
        email: email,
        displayName: match ? match.displayName : email.split('@')[0],
        role: role,
        emailVerified: true,
        isLocalMock: true,
        lastLogin: new Date().toISOString()
      };

      if (window.db) await window.db.saveUser(profile);
      this.setUser(profile);
      if (window.toast) window.toast.success(`Welcome back, ${profile.displayName}! Signed in as ${role.toUpperCase()}.`);
      return profile;
    }
  }

  async signInWithGoogle() {
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const firebaseAuth = window.zeerocodesFirebase.getAuth();
        const provider = new window.firebase.auth.GoogleAuthProvider();
        const cred = await firebaseAuth.signInWithPopup(provider);
        const profile = await this.syncUserProfile(cred.user);
        this.setUser(profile);
        if (window.toast) window.toast.success(`Google Sign-In verified: ${profile.displayName}`);
        return profile;
      } catch (err) {
        console.warn("Google popup error", err);
        if (window.toast) window.toast.error("Google Auth: " + (err.message || "Popup closed or unavailable"));
        throw err;
      }
    } else {
      // Local Sandbox Simulation
      const profile = {
        uid: 'google_user_' + Date.now(),
        email: 'zeerocodes@gmail.com',
        displayName: 'Zeerocodes Admin',
        role: 'admin',
        emailVerified: true,
        isLocalMock: true,
        provider: 'google.com',
        lastLogin: new Date().toISOString()
      };
      if (window.db) await window.db.saveUser(profile);
      this.setUser(profile);
      if (window.toast) window.toast.success("Signed in as zeerocodes@gmail.com (ADMIN Access Granted)");
      return profile;
    }
  }

  async sendVerificationEmail() {
    if (!this.currentUser) return;
    if (window.zeerocodesFirebase?.isLive()) {
      try {
        const fbUser = window.zeerocodesFirebase.getAuth().currentUser;
        if (fbUser) {
          await fbUser.sendEmailVerification();
          if (window.toast) window.toast.success("Verification link sent to " + this.currentUser.email);
        }
      } catch (e) {
        if (window.toast) window.toast.error("Error sending verification: " + e.message);
      }
    } else {
      // Simulate verification mark
      this.currentUser.emailVerified = true;
      this.setUser({ ...this.currentUser });
      if (window.db) await window.db.saveUser(this.currentUser);
      if (window.toast) window.toast.success("Email marked as verified in sandbox!");
    }
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

  // Developer / Reviewer role switcher helper
  async toggleRole(targetRole = null) {
    if (!this.currentUser) return;
    const newRole = targetRole || (this.currentUser.role === 'admin' ? 'user' : 'admin');
    this.currentUser.role = newRole;
    this.setUser({ ...this.currentUser });
    if (window.db) {
      await window.db.saveUser(this.currentUser);
    }
    if (window.toast) window.toast.info(`Switched active role to: ${newRole.toUpperCase()}`);
    
    // Auto route if switching to admin or demoting from admin view
    if (newRole === 'admin' && window.location.hash === '#dashboard') {
      window.location.hash = '#admin';
    } else if (newRole === 'user' && window.location.hash === '#admin') {
      window.location.hash = '#dashboard';
    }
  }

  // Update navbar elements dynamically
  updateNavigationUI() {
    const unauthGroup = document.querySelectorAll('.nav-unauthenticated');
    const authGroup = document.querySelectorAll('.nav-authenticated');
    const adminLinks = document.querySelectorAll('.nav-admin-link');
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
        el.textContent = (this.currentUser.role || 'USER').toUpperCase();
        el.className = `user-role-badge badge badge-teal`;
      });

      if (this.currentUser.role === 'admin') {
        adminLinks.forEach(el => {
          el.classList.remove('d-none');
          el.style.display = 'block';
        });
      } else {
        adminLinks.forEach(el => {
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
      adminLinks.forEach(el => {
        el.classList.add('d-none');
        el.style.display = 'none';
      });
    }
  }
}

window.auth = new AuthService();
