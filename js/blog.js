/**
 * Zeerocodes High-Performance Blog & Content Hub Engine (v1.0)
 * SEO-Optimized Articles with Dynamic Schema.org JSON-LD, Search & Tag Filters
 */

const SEEDED_BLOG_POSTS = [
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
    content: `
      <h2>The Old Way vs. The Modern AI Engineering Way</h2>
      <p>For decades, breaking into software development meant spending 2 to 4 years memorizing syntax, data structures, and compiler quirks before ever shipping a real project to a client.</p>

      <p>In 2026, the paradigm has completely flipped. What matters today is not how fast you type syntax, but how clearly you think as a product architect. By leveraging the <strong>Zeerocodes 4-Level AI Build Pipeline</strong>, builders can ship enterprise-grade software in weeks.</p>

      <h2>The 4 Levels of Mastery in The VibeCode Labs</h2>
      <ul>
        <li><strong>Level 1: Foundations & Prompting:</strong> Master precision prompt engineering, context framing, and Google Stitch UI design.</li>
        <li><strong>Level 2: Full-Stack AI Studio & Antigravity:</strong> Build interactive web applications, connect mobile-ready interfaces, and manage real databases.</li>
        <li><strong>Level 3: n8n Automation & AI Security:</strong> Wire up autonomous WhatsApp bots, connect Paystack payment rails, and audit code with VibeScan.</li>
        <li><strong>Level 4: Client Acquisition & Naira Pricing:</strong> Package your skills, write winning client proposals, quote value-based pricing, and earn your official 12-month certification.</li>
      </ul>

      <div class="article-cta-box" style="background:#080D16; border:1px solid var(--emerald-primary); padding:1.5rem; border-radius:var(--radius-sm); margin:2rem 0;">
        <h4 style="color:#FFF; margin-bottom:0.4rem;">Ready to master AI engineering and ship real client apps?</h4>
        <p style="color:var(--text-cyber-muted); font-size:0.9rem; margin-bottom:1rem;">Join the next live 8-week cohort of The Zeerocodes VibeCode Labs.</p>
        <button class="btn btn-primary btn-sm" onclick="window.app.handleEnrollCourse('course-vibecode-labs')">
          Reserve Your Cohort Seat &rarr;
        </button>
      </div>
    `
  },
  {
    id: 'post-nextjs-agency-21-days',
    title: 'Next.js vs. Traditional Agencies: How to Ship Custom Web Apps in 21 Days',
    slug: 'ship-custom-web-apps-in-21-days-nextjs-vs-traditional-agencies',
    category: 'Custom Apps',
    categoryBadge: 'badge-cyber',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'August 1, 2026',
    readTime: '5 min read',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Why traditional software agencies take 6 months and charge millions for basic apps, and how Zeerocodes Studio delivers modern, full-stack Next.js platforms in 14 to 28 days.',
    tags: ['Next.js', 'Custom Software', 'SaaS MVP', 'Lagos Startups', 'Agency Alternative'],
    content: `
      <h2>The Bloated Agency Model Is Broken</h2>
      <p>When most African founders want to build a custom web app or customer portal, they encounter traditional development agencies that quote ₦8M+ and demand 6 to 9 months before delivering even a basic prototype.</p>

      <p>By the time the project ships, customer requirements have changed, competitor tools have launched, and budgets are exhausted.</p>

      <h2>The Zeerocodes Studio 4-Week Method</h2>
      <p>We believe in modular, high-velocity engineering. By combining modern component libraries, clean serverless architectures, and PostgreSQL tenant isolation, we eliminate 80% of redundant boilerplate code:</p>

      <ul>
        <li><strong>Week 1:</strong> Discovery, wireframing, and database schema sign-off.</li>
        <li><strong>Week 2:</strong> Core Next.js platform build and payment gateway integrations.</li>
        <li><strong>Week 3:</strong> Row-Level Security lockdown and VibeScan OWASP audit.</li>
        <li><strong>Week 4:</strong> Production launch on Cloud Run / Vercel with a 30-day SLA.</li>
      </ul>
    `
  },
  {
    id: 'post-supabase-rls-founders-guide',
    title: "The Founder's Guide to Row-Level Security (RLS) in Supabase & PostgreSQL",
    slug: 'founders-guide-supabase-postgresql-row-level-security-rls',
    category: 'AI Security',
    categoryBadge: 'badge-teal',
    author: 'Nuel Effiong',
    authorRole: 'Principal AI Systems Architect',
    date: 'July 28, 2026',
    readTime: '6 min read',
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'A practical, non-technical explanation of Row-Level Security: why your Supabase database might be public right now, and the 3 lines of SQL that protect your customer data.',
    tags: ['Supabase', 'PostgreSQL RLS', 'Database Security', 'Privacy', 'NDPR Compliance'],
    content: `
      <h2>What is Row-Level Security and Why Does It Matter?</h2>
      <p>Imagine a bank where every customer can open every other customer's safety deposit box simply by walking in the front door. That is what a database without Row-Level Security (RLS) looks like.</p>

      <p>When you build an app with Supabase or PostgreSQL, you must instruct the database engine to check the identity of the authenticated user for every single query.</p>

      <h2>The 3 Essential SQL Rules Every Founder Must Enforce</h2>
      <pre><code>-- 1. Enable RLS on user tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow users to only read their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 3. Allow users to only edit their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);</code></pre>
      
      <p>Every custom build delivered by Zeerocodes Studio and every capstone in The VibeCode Labs is audited against this standard before going live.</p>
    `
  }
];

class BlogManager {
  constructor() {
    this.posts = SEEDED_BLOG_POSTS;
    this.activeCategory = 'All';
    this.searchQuery = '';
  }

  init() {
    this.renderBlogView();
    this.bindBlogEvents();
  }

  getFilteredPosts() {
    return this.posts.filter(p => {
      const matchCat = this.activeCategory === 'All' || p.category === this.activeCategory;
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }

  renderBlogView() {
    const container = document.getElementById('blogPostsGrid');
    if (!container) return;

    const filtered = this.getFilteredPosts();

    if (!filtered.length) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:3rem; background:rgba(15,23,42,0.6); border-radius:var(--radius-md); border:1px solid var(--obsidian-border);">
          <p style="color:var(--text-cyber-muted); font-size:1.05rem;">No articles found matching "${this.searchQuery}".</p>
          <button class="btn btn-secondary btn-sm" onclick="window.blog.resetFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <article class="blog-card" onclick="window.blog.openArticleModal('${p.id}')">
        <div class="blog-card-image-wrap">
          <img src="${p.featuredImage}" alt="${p.title}" class="blog-card-image" loading="lazy">
          <span class="badge ${p.categoryBadge}" style="position:absolute; top:12px; left:12px;">${p.category}</span>
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span><i data-lucide="calendar" style="width:13px; height:13px; display:inline;"></i> ${p.date}</span>
            <span>•</span>
            <span><i data-lucide="clock" style="width:13px; height:13px; display:inline;"></i> ${p.readTime}</span>
          </div>
          <h3 class="blog-card-title">${p.title}</h3>
          <p class="blog-card-excerpt">${p.excerpt}</p>
          <div class="blog-card-footer">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #10B981, #016B61); color:#FFF; font-size:0.75rem; font-weight:700; display:flex; align-items:center; justify-content:center;">NE</div>
              <span style="font-size:0.8rem; color:var(--text-cyber-bright); font-weight:600;">${p.author}</span>
            </div>
            <span class="blog-read-link">Read Story &rarr;</span>
          </div>
        </div>
      </article>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  bindBlogEvents() {
    // Search input
    const searchInput = document.getElementById('blogSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderBlogView();
      });
    }

    // Category pills
    document.addEventListener('click', (e) => {
      const catBtn = e.target.closest('.blog-cat-btn');
      if (catBtn) {
        document.querySelectorAll('.blog-cat-btn').forEach(b => b.classList.remove('active'));
        catBtn.classList.add('active');
        this.activeCategory = catBtn.getAttribute('data-category') || 'All';
        this.renderBlogView();
      }
    });
  }

  resetFilters() {
    this.activeCategory = 'All';
    this.searchQuery = '';
    const searchInput = document.getElementById('blogSearchInput');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.blog-cat-btn').forEach(b => {
      if (b.getAttribute('data-category') === 'All') b.classList.add('active');
      else b.classList.remove('active');
    });
    this.renderBlogView();
  }

  openArticleModal(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('modal-article-reader');
    const titleEl = document.getElementById('articleReaderTitle');
    const metaEl = document.getElementById('articleReaderMeta');
    const bodyEl = document.getElementById('articleReaderBody');
    const heroImgEl = document.getElementById('articleReaderHeroImg');

    if (titleEl) titleEl.textContent = post.title;
    if (heroImgEl) {
      heroImgEl.src = post.featuredImage;
      heroImgEl.alt = post.title;
    }
    if (metaEl) {
      metaEl.innerHTML = `
        <span class="badge ${post.categoryBadge}">${post.category}</span>
        <span>•</span>
        <span>By <strong>${post.author}</strong> (${post.authorRole})</span>
        <span>•</span>
        <span>${post.date}</span>
        <span>•</span>
        <span>${post.readTime}</span>
      `;
    }
    if (bodyEl) {
      bodyEl.innerHTML = post.content;
    }

    // Inject Dynamic Schema.org JSON-LD for this article
    this.injectArticleSchema(post);

    if (window.modal) {
      window.modal.open('modal-article-reader');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  injectArticleSchema(post) {
    let schemaEl = document.getElementById('dynamicArticleSchema');
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id = 'dynamicArticleSchema';
      schemaEl.type = 'application/ld+json';
      document.head.appendChild(schemaEl);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.featuredImage,
      "author": {
        "@type": "Person",
        "name": post.author,
        "jobTitle": post.authorRole
      },
      "publisher": {
        "@type": "Organization",
        "name": "Zeerocodes",
        "logo": {
          "@type": "ImageObject",
          "url": "https://zeerocodes.com/logo.png"
        }
      },
      "datePublished": "2026-08-10",
      "mainEntityOfPage": `https://zeerocodes.com/#blog`
    };

    schemaEl.textContent = JSON.stringify(schemaData);
  }
}

window.blog = new BlogManager();
