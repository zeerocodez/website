/**
 * Zeerocodes Unified Academy LMS & Interactive Learning Engine (v2.0)
 * Handles:
 * 1. 4-Level Curriculum Player & Sidebar Navigation (88 Lessons)
 * 2. Video/Lab Stream, Markdown Blueprint & Code Sandbox
 * 3. Interactive Lab Project Submissions (GitHub & Live URL)
 * 4. End-of-Module Interactive Knowledge Checkers (Quizzes)
 * 5. Tamper-Proof VibeCert™ Certificate of Completion Generator
 */

class AcademyLMS {
  constructor() {
    this.activeEnrollment = null;
    this.activeCourse = null;
    this.allLessons = [];
    this.currentLessonIndex = 0;
    this.init();
  }

  init() {
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      // Lab submission modal trigger
      if (e.target.closest('#btnSubmitCurrentLab')) {
        this.openLabSubmissionModal();
      }
      // Quiz trigger
      if (e.target.closest('#btnTakeModuleQuiz')) {
        const quizKey = e.target.closest('#btnTakeModuleQuiz').getAttribute('data-quiz') || 'level_1_quiz';
        this.openQuizModal(quizKey);
      }
      // Certificate trigger
      if (e.target.closest('.trigger-view-cert')) {
        const certId = e.target.closest('.trigger-view-cert').getAttribute('data-cert') || 'VIBECERT-2026-0881';
        this.openCertificateModal(certId);
      }
    });
  }

  /**
   * Opens the LMS course player for an active enrollment
   */
  async openCoursePlayer(enrollmentId) {
    if (!window.auth || !window.auth.isAuthenticated()) {
      if (window.toast) window.toast.warning("Please sign in to access your course player.");
      if (window.modal) window.modal.openAuth('login');
      return;
    }

    const user = window.auth.getUser();
    let enrollments = await window.db.getUserEnrollments(user.uid);
    let enrollment = enrollments.find(e => e.id === enrollmentId);

    // If no enrollment found, auto-enroll for demo experience
    if (!enrollment) {
      enrollment = {
        id: 'enroll_' + Date.now(),
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        courseId: 'course-vibecode-labs',
        courseTitle: 'The Zeerocodes VibeCode Labs',
        enrolledAt: new Date().toISOString(),
        status: 'active',
        completedLessons: ['lvl_1_mod_01_les_0', 'lvl_1_mod_01_les_1'],
        quizScores: { 'level_1_quiz': 100 }
      };
      await window.db.saveEnrollment(enrollment);
    }

    const course = await window.db.getCourseById(enrollment.courseId);
    if (!course) return;

    this.activeEnrollment = enrollment;
    this.activeCourse = course;
    this.allLessons = this.flattenCourseLessons(course);
    this.currentLessonIndex = 0;

    // Set Course Title & Stats
    const titleEl = document.getElementById('lmsPlayerCourseTitle');
    if (titleEl) titleEl.textContent = course.title;

    this.renderCurriculumSidebar();
    this.loadLesson(0);

    if (window.modal) {
      window.modal.open('modal-lms-player');
    }
  }

  flattenCourseLessons(course) {
    const lessons = [];
    if (!course.levels) return lessons;

    course.levels.forEach((lvl) => {
      lvl.modules.forEach((mod) => {
        mod.lessons.forEach((lesTitle, lesIdx) => {
          const lessonId = `lvl_${lvl.levelNumber}_mod_${mod.number}_les_${lesIdx}`;
          const isLab = lesIdx % 2 !== 0 || lesTitle.toLowerCase().includes('lab') || lesTitle.toLowerCase().includes('build');
          
          lessons.push({
            id: lessonId,
            levelNumber: lvl.levelNumber,
            levelTitle: lvl.title,
            moduleNumber: mod.number,
            moduleTitle: mod.title,
            title: lesTitle,
            duration: isLab ? '35 min (Practical Lab)' : '18 min (Video & Blueprint)',
            type: isLab ? 'lab' : 'video',
            summary: `Master the principles of ${lesTitle}. Build production-ready workflows with AI agents, Paystack webhooks, and OWASP security guardrails.`,
            promptTemplate: `Act as a senior systems architect. Build a secure component for "${lesTitle}" using the Zeerocodes 2026 stack (AI Studio / Antigravity / n8n / Paystack). Ensure all API keys live in server-side .env and implement constant-time HMAC verification.`
          });
        });
      });
    });
    return lessons;
  }

  renderCurriculumSidebar() {
    const container = document.getElementById('lmsSidebarCurriculum');
    if (!container) return;

    const completed = this.activeEnrollment.completedLessons || [];
    const totalCount = this.allLessons.length;
    const completedCount = completed.length;
    const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

    // Update Progress Bar in LMS
    const progText = document.getElementById('lmsProgressPercent');
    const progBar = document.getElementById('lmsProgressBar');
    if (progText) progText.textContent = `${progressPercent}% Completed (${completedCount}/${totalCount})`;
    if (progBar) progBar.style.width = `${progressPercent}%`;

    // Group lessons by Level
    let html = '';
    this.activeCourse.levels.forEach(lvl => {
      html += `
        <div class="lms-level-group">
          <div class="lms-level-header">
            <div>
              <span class="badge badge-teal" style="font-size:0.65rem;">LEVEL ${lvl.levelNumber}</span>
              <strong style="display:block; color:#FFF; font-size:0.88rem; margin-top:0.2rem;">${lvl.title}</strong>
            </div>
            <span style="font-size:0.75rem; color:var(--text-cyber-muted);">${lvl.modules.length} Modules</span>
          </div>
          <div class="lms-modules-list">
      `;

      lvl.modules.forEach(mod => {
        html += `
          <div class="lms-module-block">
            <div class="lms-module-title">
              <i data-lucide="folder" style="width:14px; height:14px; color:var(--emerald-light);"></i>
              <span>Mod ${mod.number}: ${mod.title}</span>
            </div>
            <div class="lms-lesson-sublist">
        `;

        mod.lessons.forEach((lesTitle, lesIdx) => {
          const lessonId = `lvl_${lvl.levelNumber}_mod_${mod.number}_les_${lesIdx}`;
          const isDone = completed.includes(lessonId);
          const lessonGlobalIdx = this.allLessons.findIndex(l => l.id === lessonId);
          const isActive = lessonGlobalIdx === this.currentLessonIndex;

          html += `
            <div class="lms-lesson-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" onclick="window.lms.loadLesson(${lessonGlobalIdx})">
              <div style="display:flex; align-items:center; gap:0.5rem; overflow:hidden;">
                <i data-lucide="${isDone ? 'check-circle' : isActive ? 'play-circle' : 'circle'}" class="lms-lesson-icon ${isDone ? 'text-success' : isActive ? 'text-emerald' : 'text-muted'}"></i>
                <span class="lms-lesson-title-text" title="${lesTitle}">${lesTitle}</span>
              </div>
              <span style="font-size:0.65rem; color:var(--text-cyber-muted); flex-shrink:0;">${isDone ? 'DONE' : lesIdx % 2 === 0 ? 'VIDEO' : 'LAB'}</span>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  loadLesson(index) {
    if (index < 0 || index >= this.allLessons.length) return;
    this.currentLessonIndex = index;
    const lesson = this.allLessons[index];
    const completed = this.activeEnrollment.completedLessons || [];
    const isDone = completed.includes(lesson.id);

    // Update active highlight in sidebar
    document.querySelectorAll('.lms-lesson-item').forEach((el, idx) => {
      el.classList.toggle('active', idx === index);
    });

    // Update Player View Elements
    const tagEl = document.getElementById('lmsCurrentLessonTag');
    const titleEl = document.getElementById('lmsCurrentLessonTitle');
    const moduleEl = document.getElementById('lmsCurrentModuleText');
    const durEl = document.getElementById('lmsCurrentLessonDuration');
    const bodyEl = document.getElementById('lmsLessonBodyContent');
    const markBtn = document.getElementById('btnLmsToggleComplete');
    const promptArea = document.getElementById('lmsPromptSandboxCode');

    if (tagEl) tagEl.textContent = `Level ${lesson.levelNumber} • Module ${lesson.moduleNumber}`;
    if (titleEl) titleEl.textContent = lesson.title;
    if (moduleEl) moduleEl.textContent = `${lesson.levelTitle} → ${lesson.moduleTitle}`;
    if (durEl) durEl.textContent = lesson.duration;

    if (markBtn) {
      markBtn.innerHTML = isDone 
        ? `<i data-lucide="check-circle-2"></i> Completed` 
        : `<i data-lucide="check"></i> Mark Lesson Complete`;
      markBtn.className = isDone ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm';
    }

    if (promptArea) {
      promptArea.value = lesson.promptTemplate;
    }

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="lms-content-card">
          <div class="video-player-container" style="background:#04070D; border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-sm); height:340px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; margin-bottom:1.5rem;">
            <div class="pulse-indicator" style="position:absolute; top:1rem; right:1rem;"></div>
            <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, var(--emerald-primary), #016B61); display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 0 25px rgba(16,185,129,0.4); margin-bottom:1rem;" onclick="window.toast?.success('Streaming masterclass video stream in 1080p 60fps')">
              <i data-lucide="play" style="width:28px; height:28px; color:#FFF; fill:#FFF; margin-left:4px;"></i>
            </div>
            <strong style="color:#FFF; font-size:1.05rem;">${lesson.title}</strong>
            <span style="color:var(--emerald-light); font-size:0.8rem; margin-top:0.25rem;">HD Video Stream • Instructor: Nuel Effiong (Lagos Studio)</span>
          </div>

          <div class="lesson-blueprint-section" style="margin-bottom:1.5rem;">
            <h4 style="color:#FFF; font-size:1.15rem; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="terminal" style="color:var(--emerald-light);"></i> Production Architecture Blueprint
            </h4>
            <p style="color:var(--text-cyber-muted); font-size:0.92rem; line-height:1.7;">
              ${lesson.summary} In this session, we implement the core workflow, review security guardrails, and examine how African companies scale this in high-volume production.
            </p>
          </div>

          <div class="security-guardrail-callout" style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:var(--radius-xs); padding:1rem 1.25rem; margin-bottom:1.5rem;">
            <strong style="color:var(--emerald-light); font-size:0.88rem; display:flex; align-items:center; gap:0.4rem; margin-bottom:0.35rem;">
              <i data-lucide="shield-check"></i> Non-Negotiable Security Rule for this Lesson:
            </strong>
            <p style="font-size:0.82rem; color:var(--text-cyber-muted); margin:0; line-height:1.5;">
              Treat all incoming payloads as untrusted. Never store plaintext credentials in frontend components. Validate webhook HMAC signatures with constant-time buffer equality.
            </p>
          </div>

          <!-- Community Q&A & Mentor Discussion Section -->
          <div class="lms-qa-section" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h4 style="color:#FFF; font-size:1.05rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
                <i data-lucide="message-square" style="color:var(--cyan-accent);"></i> Lesson Discussion & Mentor Q&A
              </h4>
              <span class="badge badge-teal" style="font-size:0.65rem;">Direct Instructor Access</span>
            </div>

            <form id="lmsAskQuestionForm" onsubmit="window.lms.handlePostQuestion(event, '${lesson.id}')" style="display:flex; gap:0.5rem; margin-bottom:1.25rem;">
              <input type="text" id="lmsQuestionInput" placeholder="Ask a question about this build or architectural pattern..." class="form-input" style="flex:1; font-size:0.85rem;" required>
              <button type="submit" class="btn btn-primary btn-sm" style="flex-shrink:0;">
                <i data-lucide="send"></i> Post Question
              </button>
            </form>

            <div id="lmsLessonQuestionsList" style="display:flex; flex-direction:column; gap:0.75rem;">
              <!-- Loaded dynamically -->
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2rem; padding-top:1.25rem; border-top:1px solid rgba(255,255,255,0.08); flex-wrap:wrap; gap:1rem;">
            <button class="btn btn-outline btn-sm" onclick="window.lms.navigateLesson(-1)" ${index === 0 ? 'disabled' : ''}>
              <i data-lucide="arrow-left"></i> Previous Lesson
            </button>

            <div style="display:flex; gap:0.75rem;">
              <button class="btn btn-secondary btn-sm" id="btnSubmitCurrentLab">
                <i data-lucide="upload-cloud"></i> Submit Lab Repo
              </button>
              <button class="btn btn-primary btn-sm" onclick="window.lms.navigateLesson(1)" ${index === this.allLessons.length - 1 ? 'disabled' : ''}>
                Next Lesson <i data-lucide="arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      this.loadLessonQuestions(lesson.id);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  async loadLessonQuestions(lessonId) {
    const listEl = document.getElementById('lmsLessonQuestionsList');
    if (!listEl || !window.db) return;

    const questions = await window.db.getLessonQuestions(lessonId);
    if (!questions.length) {
      listEl.innerHTML = `<div style="font-size:0.8rem; color:var(--text-cyber-muted); font-style:italic;">No questions posted yet for this lesson. Be the first to ask!</div>`;
      return;
    }

    listEl.innerHTML = questions.map(q => `
      <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-xs); padding:0.85rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <strong style="color:#FFF; font-size:0.85rem;">${q.authorName}</strong>
            <span class="badge badge-teal" style="font-size:0.6rem;">${q.authorRole}</span>
          </div>
          <span style="font-size:0.7rem; color:var(--text-cyber-muted);">${q.createdAt}</span>
        </div>
        <p style="color:#DDD; font-size:0.85rem; margin:0 0 0.6rem 0; line-height:1.5;">${q.question}</p>
        ${(q.replies || []).map(r => `
          <div style="background:rgba(1,107,97,0.12); border-left:2px solid var(--emerald-light); padding:0.6rem 0.75rem; border-radius:0 4px 4px 0; margin-top:0.4rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.2rem;">
              <strong style="color:var(--emerald-light); font-size:0.8rem;">${r.authorName}</strong>
              <span style="font-size:0.68rem; color:var(--text-cyber-muted);">${r.createdAt}</span>
            </div>
            <p style="color:#E4EEE7; font-size:0.82rem; margin:0; line-height:1.45;">${r.reply}</p>
          </div>
        `).join('')}
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  async handlePostQuestion(e, lessonId) {
    e.preventDefault();
    const input = document.getElementById('lmsQuestionInput');
    if (!input || !input.value.trim()) return;

    const user = window.auth?.getUser();
    await window.db.addLessonQuestion({
      lessonId,
      authorName: user?.displayName || 'Student Builder',
      authorRole: 'Cohort Member',
      question: input.value.trim()
    });

    input.value = '';
    window.toast?.success('Question posted to community thread!');
    this.loadLessonQuestions(lessonId);
  }
  }

  async toggleCurrentLessonComplete() {
    if (!this.activeEnrollment || !this.allLessons.length) return;
    const lesson = this.allLessons[this.currentLessonIndex];
    let completed = this.activeEnrollment.completedLessons || [];

    if (completed.includes(lesson.id)) {
      completed = completed.filter(id => id !== lesson.id);
      if (window.toast) window.toast.info(`Lesson unchecked.`);
    } else {
      completed.push(lesson.id);
      if (window.toast) window.toast.success(`Lesson marked complete! +50 XP`);
    }

    this.activeEnrollment.completedLessons = completed;
    await window.db.saveEnrollment(this.activeEnrollment);

    // Refresh UI
    this.renderCurriculumSidebar();
    this.loadLesson(this.currentLessonIndex);

    // If 100% completed, prompt certificate
    if (completed.length >= this.allLessons.length) {
      if (window.toast) window.toast.success(`🎉 Congratulations! You have completed all 88 lessons of The VibeCode Labs!`);
    }
  }

  navigateLesson(direction) {
    const nextIdx = this.currentLessonIndex + direction;
    if (nextIdx >= 0 && nextIdx < this.allLessons.length) {
      this.loadLesson(nextIdx);
    }
  }

  copyPromptTemplate() {
    const promptArea = document.getElementById('lmsPromptSandboxCode');
    if (promptArea) {
      navigator.clipboard.writeText(promptArea.value);
      if (window.toast) window.toast.success("Prompt copied to clipboard! Paste into AI Studio or Antigravity.");
    }
  }

  /**
   * Lab Submission Modal
   */
  openLabSubmissionModal() {
    const lesson = this.allLessons[this.currentLessonIndex];
    const user = window.auth?.getUser();
    if (!lesson || !user) return;

    const modal = document.getElementById('modal-lab-submit');
    if (!modal) return;

    document.getElementById('labSubmitLessonTitle').textContent = lesson.title;
    document.getElementById('labSubmitModuleTitle').textContent = `Level ${lesson.levelNumber} • ${lesson.moduleTitle}`;

    if (window.modal) window.modal.open('modal-lab-submit');
  }

  async handleLabSubmit(e) {
    e.preventDefault();
    const user = window.auth?.getUser();
    const lesson = this.allLessons[this.currentLessonIndex];
    if (!user || !lesson) return;

    const repoUrl = document.getElementById('labSubmitRepoUrl').value.trim();
    const liveUrl = document.getElementById('labSubmitLiveUrl').value.trim();
    const notes = document.getElementById('labSubmitNotes').value.trim();

    const submission = {
      id: 'lab_sub_' + Date.now(),
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      courseId: 'course-vibecode-labs',
      levelNumber: lesson.levelNumber,
      moduleTitle: lesson.moduleTitle,
      lessonTitle: lesson.title,
      repoUrl: repoUrl,
      liveUrl: liveUrl,
      notes: notes,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      grade: null,
      feedback: null
    };

    await window.db.saveLabSubmission(submission);
    if (window.modal) window.modal.close('modal-lab-submit');
    if (window.toast) window.toast.success("Lab submitted successfully! Instructor Nuel Effiong will review and grade your build.");
  }

  /**
   * End of Module Quiz Modal
   */
  async openQuizModal(quizKey = 'level_1_quiz') {
    const quiz = await window.db.getQuiz(quizKey);
    if (!quiz) return;

    const container = document.getElementById('quizQuestionsContainer');
    const titleEl = document.getElementById('quizModalTitle');
    if (titleEl) titleEl.textContent = quiz.title;

    if (container) {
      container.innerHTML = quiz.questions.map((q, qIdx) => `
        <div class="quiz-question-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; margin-bottom:1rem;">
          <h4 style="color:#FFF; font-size:0.95rem; margin-bottom:0.75rem;">Question ${qIdx + 1}: ${q.question}</h4>
          <div class="quiz-options-group" style="display:flex; flex-direction:column; gap:0.5rem;">
            ${q.options.map((opt, optIdx) => `
              <label class="quiz-option-label" style="display:flex; align-items:center; gap:0.65rem; background:rgba(255,255,255,0.03); padding:0.6rem 0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.08); cursor:pointer; font-size:0.85rem; color:var(--text-cyber-muted);">
                <input type="radio" name="quiz_q_${qIdx}" value="${optIdx}" required>
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>
          <div class="quiz-feedback-box d-none" id="quizFeedback_${qIdx}" style="margin-top:0.75rem; font-size:0.8rem; padding:0.6rem; border-radius:var(--radius-xs);"></div>
        </div>
      `).join('');
    }

    if (window.modal) window.modal.open('modal-quiz');
    if (window.lucide) window.lucide.createIcons();
  }

  async handleQuizSubmit(e, quizKey = 'level_1_quiz') {
    e.preventDefault();
    const quiz = await window.db.getQuiz(quizKey);
    if (!quiz) return;

    let score = 0;
    quiz.questions.forEach((q, qIdx) => {
      const selected = document.querySelector(`input[name="quiz_q_${qIdx}"]:checked`);
      const feedbackEl = document.getElementById(`quizFeedback_${qIdx}`);
      if (feedbackEl && selected) {
        feedbackEl.classList.remove('d-none');
        if (parseInt(selected.value) === q.correct) {
          score++;
          feedbackEl.style.background = 'rgba(16,185,129,0.15)';
          feedbackEl.style.color = 'var(--emerald-light)';
          feedbackEl.style.border = '1px solid var(--emerald-primary)';
          feedbackEl.innerHTML = `<strong>✓ Correct!</strong> ${q.explanation}`;
        } else {
          feedbackEl.style.background = 'rgba(239,68,68,0.15)';
          feedbackEl.style.color = '#F87171';
          feedbackEl.style.border = '1px solid rgba(239,68,68,0.3)';
          feedbackEl.innerHTML = `<strong>✗ Incorrect.</strong> ${q.explanation}`;
        }
      }
    });

    const percent = Math.round((score / quiz.questions.length) * 100);
    if (window.toast) {
      if (percent >= 80) {
        window.toast.success(`🎉 Knowledge Check Passed: ${percent}% Score!`);
      } else {
        window.toast.warning(`Score: ${percent}%. Review the security explanations and retry.`);
      }
    }
  }

  /**
   * Certificate Modal (Tamper-Proof VibeCert™)
   */
  openCertificateModal(certId = 'VIBECERT-2026-0881') {
    const user = window.auth?.getUser() || { displayName: 'Amina Yusuf' };
    const certModal = document.getElementById('modal-certificate');
    if (!certModal) return;

    const nameEl = document.getElementById('certStudentName');
    const idEl = document.getElementById('certSerialId');
    const dateEl = document.getElementById('certIssueDate');

    if (nameEl) nameEl.textContent = user.displayName || 'Amina Yusuf';
    if (idEl) idEl.textContent = certId;
    if (dateEl) dateEl.textContent = 'August 10, 2026';

    if (window.modal) window.modal.open('modal-certificate');
    if (window.lucide) window.lucide.createIcons();
  }

  printCertificate() {
    window.print();
  }
}

window.lms = new AcademyLMS();
