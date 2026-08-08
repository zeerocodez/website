/**
 * Zeerocodes Academy LMS & Course Experience
 * Manages lesson delivery, mark-complete checklist, persistent progress calculation,
 * certificate downloads, and the Academy -> VibeScan flywheel cross-sell.
 */

class AcademyLMS {
  constructor() {
    this.activeEnrollment = null;
    this.activeCourse = null;
    this.currentLessonIndex = 0;
    this.init();
  }

  init() {
    // Check if any modal triggers need binding
  }

  /**
   * Opens the LMS course player for an active enrollment
   */
  async openCoursePlayer(enrollmentId) {
    if (!window.auth || !window.auth.isAuthenticated()) return;

    const user = window.auth.getUser();
    const enrollments = await window.db.getUserEnrollments(user.uid);
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) {
      if (window.toast) window.toast.error("Enrollment not found.");
      return;
    }

    const course = await window.db.getCourseById(enrollment.courseId);
    if (!course) return;

    this.activeEnrollment = enrollment;
    this.activeCourse = course;
    this.currentLessonIndex = 0;

    // Render course player modal
    const modal = document.getElementById('modal-lms-player');
    if (!modal) return;

    document.getElementById('lmsCourseTitle').textContent = course.title;
    this.renderLessonsList();
    this.loadLesson(0);

    window.modal.open('modal-lms-player');
  }

  /**
   * Generates mock structured lessons for the modules
   */
  getStructuredLessons(course) {
    const modules = course.modules || [];
    const lessons = [];

    modules.forEach((modTitle, modIdx) => {
      lessons.push({
        id: `mod_${modIdx}_les_1`,
        title: `${modTitle} — Part 1: Theory & Setup`,
        module: modTitle,
        duration: '18 min',
        type: 'video',
        content: `
          <h4>${modTitle}</h4>
          <p>Welcome to this hands-on lesson on ${modTitle}. In this walkthrough, we examine how African businesses handle real-world edge cases like unstable network connections, Paystack callback latency, and WhatsApp webhook verification.</p>
          <div class="video-placeholder-box">
            <div class="video-play-btn"><i data-lucide="play"></i></div>
            <span>HD Masterclass Video Stream • ${course.title}</span>
          </div>
          <h5>Key Architecture Takeaways:</h5>
          <ul>
            <li>Never trust client-side redirects for payment fulfillment; always use webhook signatures.</li>
            <li>Store WhatsApp Cloud API credentials in environment variables, never in repo code.</li>
            <li>Implement exponential backoff retry algorithms for African carrier latency.</li>
          </ul>
        `
      });
      lessons.push({
        id: `mod_${modIdx}_les_2`,
        title: `${modTitle} — Part 2: Practical Lab & Code`,
        module: modTitle,
        duration: '25 min',
        type: 'lab',
        content: `
          <h4>Hands-on Code Implementation</h4>
          <p>Download the starter repository and follow the step-by-step implementation guide below to configure your production nodes.</p>
          <div class="code-snippet-box">
            <pre><code>// Example Secure Webhook Verification Node (Node.js/n8n)
const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET_KEY;
const hash = crypto.createHmac('sha512', secret)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (hash === req.headers['x-paystack-signature']) {
  // Signature verified -> Proceed to fulfillment
  activateUserEnrollment(req.body.data);
}</code></pre>
          </div>
        `
      });
    });

    lessons.push({
      id: `quiz_${modIdx}`,
      title: `${modTitle} — Knowledge Check & Quiz`,
      module: modTitle,
      duration: '10 min',
      type: 'quiz',
      content: `
        <div class="lms-quiz-card">
          <div class="quiz-question-title">
            <i data-lucide="help-circle"></i> Quick Knowledge Check: ${modTitle}
          </div>
          <p style="font-size:0.88rem; margin-bottom:1rem; color:var(--text-body);">
            How should an African automation workflow securely verify that a Paystack or Flutterwave payment event is authentic before dispensing value?
          </p>
          <div class="quiz-options-list">
            <button class="quiz-option-btn" onclick="window.lms.checkQuizAnswer(this, false, 'Client URLs can be spoofed by malicious users.')">
              A) Check if the user was redirected to the ?status=success callback URL in browser
            </button>
            <button class="quiz-option-btn" onclick="window.lms.checkQuizAnswer(this, true, 'Correct! HMAC SHA-512 cryptographically verifies the payload authenticity server-side.')">
              B) Calculate HMAC SHA-512 signature of the raw JSON body using secret key on server
            </button>
            <button class="quiz-option-btn" onclick="window.lms.checkQuizAnswer(this, false, 'SMS can be delayed and lacks cryptographic signature.')">
              C) Trust the user's uploaded SMS screenshot sent to the WhatsApp bot
            </button>
          </div>
          <div id="quizFeedbackBox" class="quiz-feedback-box d-none"></div>
        </div>
      `
    });

    return lessons;
  }

  checkQuizAnswer(btn, isCorrect, explanation) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.quiz-option-btn').forEach(b => {
      b.classList.remove('correct', 'wrong');
    });

    const fb = document.getElementById('quizFeedbackBox');
    if (isCorrect) {
      btn.classList.add('correct');
      if (fb) {
        fb.className = 'quiz-feedback-box success';
        fb.textContent = `✓ Correct: ${explanation}`;
        fb.classList.remove('d-none');
      }
      if (window.toast) window.toast.success("🎯 Correct Answer! +50 XP");
    } else {
      btn.classList.add('wrong');
      if (fb) {
        fb.className = 'quiz-feedback-box error';
        fb.textContent = `✗ Not quite: ${explanation}`;
        fb.classList.remove('d-none');
      }
      if (window.toast) window.toast.warning("Review the architecture guidelines and try again.");
    }
  }

  downloadGraduationDiploma() {
    const courseTitle = this.activeCourse ? this.activeCourse.title : 'AI Automation Masterclass';
    const student = window.auth.getUser()?.displayName || 'Zeerocodes Graduate';
    const date = new Date().toLocaleDateString();

    const diplomaText = `========================================================================
ZEEROCODES ACADEMY — DIPLOMA OF COMPLETION
========================================================================
This certifies that: ${student.toUpperCase()}
Has successfully completed 100% of the curriculum for:
${courseTitle.toUpperCase()}

Demonstrated Competencies:
- Event-driven n8n workflow engineering & self-hosting
- WhatsApp Cloud API interactive bot development
- Server-side cryptographic webhook signature verification (Paystack/Flutterwave)
- OWASP Top 10 for LLMs security hardening & VibeScan compliance

Issued by: Nuel Effiong (Founder & Lead AI Security Architect)
Date: ${date}
Credential Hash: ZC-ACAD-${Date.now().toString(16).toUpperCase()}
========================================================================`;

    const blob = new Blob([diplomaText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zeerocodes-Diploma-${student.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.toast) window.toast.success("🎓 Diploma Certificate downloaded!");
  }

  renderLessonsList() {
    const container = document.getElementById('lmsLessonsList');
    if (!container || !this.activeCourse) return;

    const lessons = this.getStructuredLessons(this.activeCourse);
    const completedIds = this.activeEnrollment.completedLessons || [];

    container.innerHTML = lessons.map((les, idx) => {
      const isCompleted = completedIds.includes(les.id);
      const isCurrent = idx === this.currentLessonIndex;

      return `
        <div class="lesson-item ${isCurrent ? 'active' : ''}" onclick="window.lms.loadLesson(${idx})">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <input type="checkbox" ${isCompleted ? 'checked' : ''} onclick="event.stopPropagation(); window.lms.toggleLessonCompletion('${les.id}')">
            <span>${les.title}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">${les.duration}</span>
        </div>
      `;
    }).join('');

    this.updateProgressDisplay();
    if (window.lucide) window.lucide.createIcons();
  }

  loadLesson(index) {
    this.currentLessonIndex = index;
    const lessons = this.getStructuredLessons(this.activeCourse);
    const lesson = lessons[index];
    if (!lesson) return;

    const viewer = document.getElementById('lmsLessonContent');
    if (viewer) {
      viewer.innerHTML = lesson.content;
      if (window.lucide) window.lucide.createIcons();
    }

    this.renderLessonsList();
  }

  /**
   * Mark-complete toggle with persistent progress tracking
   */
  async toggleLessonCompletion(lessonId) {
    if (!this.activeEnrollment) return;

    let completed = this.activeEnrollment.completedLessons || [];
    if (completed.includes(lessonId)) {
      completed = completed.filter(id => id !== lessonId);
    } else {
      completed.push(lessonId);
    }

    const lessons = this.getStructuredLessons(this.activeCourse);
    const totalCount = lessons.length;
    const progressPercent = Math.round((completed.length / totalCount) * 100);
    const isFinished = progressPercent === 100;

    this.activeEnrollment.completedLessons = completed;
    this.activeEnrollment.progressPercent = progressPercent;
    this.activeEnrollment.completed = isFinished;

    // Save updated enrollment in db
    const enrollments = window.db.getLocal('enrollments') || [];
    const idx = enrollments.findIndex(e => e.id === this.activeEnrollment.id);
    if (idx >= 0) {
      enrollments[idx] = this.activeEnrollment;
      window.db.setLocal('enrollments', enrollments);
    }

    this.updateProgressDisplay();

    // 100% Completion Handler
    if (isFinished) {
      if (window.toast) window.toast.success("🎉 Congratulations! You have completed 100% of this course!");
      this.triggerCourseCompletionModal();
    }
  }

  updateProgressDisplay() {
    const percent = this.activeEnrollment.progressPercent || 0;
    const bar = document.getElementById('lmsProgressBarFill');
    const label = document.getElementById('lmsProgressPercentText');

    if (bar) bar.style.width = `${percent}%`;
    if (label) label.textContent = `${percent}% Completed`;
  }

  /**
   * Completion celebration & Flywheel cross-sell trigger
   */
  triggerCourseCompletionModal() {
    const modal = document.getElementById('modal-course-completion');
    if (!modal) return;

    document.getElementById('compCourseTitle').textContent = this.activeCourse.title;
    document.getElementById('compUserName').textContent = window.auth.getUser()?.displayName || 'Zeerocodes Graduate';
    document.getElementById('compDate').textContent = new Date().toLocaleDateString();

    window.modal.open('modal-course-completion');
  }

  /**
   * Action when user clicks the cross-sell button
   */
  proceedToVibescanCrossSell() {
    window.modal.closeAll();
    // Open VibeScan submission with referralSource tagged as "academy"
    window.modal.openVibescanIntake('academy');
  }
}

window.lms = new AcademyLMS();

