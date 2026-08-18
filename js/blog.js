/**
 * Zeerocodes High-Performance Blog & Content Hub Engine (v2.0)
 * SEO-Optimized Articles with Dynamic Schema.org JSON-LD, Live Search,
 * Category Filters, Interactive Reactions, Social Sharing, In-App Reader & Downloadable PDF Resources
 */

class BlogManager {
  constructor() {
    this.posts = [];
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.claps = {};
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadPosts();
    this.renderFilteredPosts();

    // Secondary guarantee on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.renderFilteredPosts();
      });
    }
  }

  bindEvents() {
    // Search input with instant filtering
    document.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'blogSearchInput') {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderFilteredPosts();
      }
    });

    // Category pills / buttons
    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.blog-category-pill') || e.target.closest('.blog-cat-btn');
      if (pill) {
        document.querySelectorAll('.blog-category-pill, .blog-cat-btn').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.getAttribute('data-category') || 'All';
        this.activeCategory = cat.trim().toLowerCase();
        this.renderFilteredPosts();
      }

      // Read article trigger (button or card click)
      const readTarget = e.target.closest('.trigger-read-article, .blog-card, .blog-hero-card');
      if (readTarget && !e.target.closest('.btn-download-article-pdf, .btn-preview-article-pdf, .btn-share-social, #btnArticleClap, a')) {
        const slug = readTarget.getAttribute('data-slug');
        if (slug) {
          this.openArticleReader(slug);
        }
      }

      // Social Share
      const shareBtn = e.target.closest('.btn-share-social');
      if (shareBtn) {
        const platform = shareBtn.getAttribute('data-platform');
        const slug = shareBtn.getAttribute('data-slug');
        this.shareArticle(platform, slug);
      }

      // Clap / Reaction
      const clapBtn = e.target.closest('#btnArticleClap');
      if (clapBtn) {
        const slug = clapBtn.getAttribute('data-slug');
        this.addClap(slug);
      }

      // Download PDF Attachment
      const downloadBtn = e.target.closest('.btn-download-article-pdf');
      if (downloadBtn) {
        const slug = downloadBtn.getAttribute('data-slug');
        this.downloadArticlePdf(slug);
      }

      // Preview PDF Attachment
      const previewBtn = e.target.closest('.btn-preview-article-pdf');
      if (previewBtn) {
        const slug = previewBtn.getAttribute('data-slug');
        this.togglePdfPreview(slug);
      }
    });
  }

  async loadPosts() {
    try {
      if (window.db && window.db.getBlogPosts) {
        this.posts = await window.db.getBlogPosts();
      }
    } catch (err) {
      console.warn('[BlogManager] Failed to load posts from DB:', err);
    }

    if (!this.posts || !Array.isArray(this.posts) || this.posts.length === 0) {
      if (typeof DEFAULT_BLOG_POSTS !== 'undefined') {
        this.posts = DEFAULT_BLOG_POSTS;
      } else {
        this.posts = [];
      }
    }
  }

  async renderBlogView() {
    await this.loadPosts();
    this.renderFilteredPosts();
  }

  renderFilteredPosts() {
    const grid = document.getElementById('blogPostsGrid') || document.getElementById('blogGridContainer');
    const heroContainer = document.getElementById('blogFeaturedHero');
    if (!grid) return;

    const allPosts = (this.posts && this.posts.length > 0) 
      ? this.posts 
      : ((typeof DEFAULT_BLOG_POSTS !== 'undefined') ? DEFAULT_BLOG_POSTS : []);

    let filtered = allPosts.filter(p => p.status === 'published' || !p.status);

    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(p => (p.category || '').trim().toLowerCase() === this.activeCategory);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(p => 
        (p.title || '').toLowerCase().includes(this.searchQuery) ||
        (p.excerpt || '').toLowerCase().includes(this.searchQuery) ||
        (p.author || '').toLowerCase().includes(this.searchQuery) ||
        (p.category || '').toLowerCase().includes(this.searchQuery) ||
        (p.tags || []).some(t => t.toLowerCase().includes(this.searchQuery))
      );
    }

    if (!filtered.length) {
      if (heroContainer) heroContainer.style.display = 'none';
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3.5rem 2rem; background:#080D16; border-radius:var(--radius-sm); border:1px solid var(--obsidian-border);">
          <i data-lucide="search-x" style="width:44px; height:44px; color:var(--emerald-light); margin-bottom:1rem;"></i>
          <h4 style="color:#FFF; font-size:1.2rem; margin-bottom:0.5rem;">No articles found</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.9rem; max-width:450px; margin:0 auto 1.5rem auto;">
            We couldn't find any guides matching "${this.searchQuery || this.activeCategory}". Try clearing your search query or exploring our other technical categories.
          </p>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('blogSearchInput').value=''; document.querySelector('.blog-cat-btn[data-category=\\'All\\']')?.click();">
            View All Articles
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Featured Hero (First matching post when viewing 'all' with no search filter)
    const featured = filtered[0];
    if (heroContainer && featured && !this.searchQuery && this.activeCategory === 'all') {
      const heroPdfBadge = featured.pdfAttachment ? `
        <span class="badge badge-cyber" style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.75rem;">
          <i data-lucide="file-text" style="width:12px; height:12px;"></i> Free PDF Download
        </span>
      ` : '';

      heroContainer.innerHTML = `
        <div class="blog-hero-card" data-slug="${featured.slug}" style="background:var(--surface-card-gradient); border:1px solid var(--obsidian-border); border-radius:var(--radius-md); overflow:hidden; display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 360px), 1fr)); margin-bottom:2.5rem; transition:border-color 0.25s ease, transform 0.25s ease; cursor:pointer;">
          <div style="height:100%; min-height:280px; overflow:hidden; position:relative;">
            <img src="${featured.featuredImage || featured.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'}" alt="${featured.title}" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'">
            <div style="position:absolute; top:1rem; left:1rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
              <span class="badge ${featured.categoryBadge || 'badge-success'}">${featured.category}</span>
              ${heroPdfBadge}
            </div>
          </div>
          <div style="padding:2.25rem 2rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.75rem; font-size:0.82rem; color:var(--text-cyber-muted);">
                <span><i data-lucide="clock" style="width:13px; height:13px; display:inline;"></i> ${featured.readTime || '6 min read'}</span>
                <span>•</span>
                <span>${featured.date || 'August 2026'}</span>
                <span>•</span>
                <span class="badge badge-teal" style="font-size:0.68rem;">Featured Case Study</span>
              </div>
              <h3 style="color:#FFF; font-size:1.45rem; line-height:1.35; margin-bottom:0.85rem;">${featured.title}</h3>
              <p style="color:var(--text-cyber-muted); font-size:0.92rem; line-height:1.65; margin-bottom:1.5rem;">${featured.excerpt}</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; padding-top:1.25rem; border-top:1px solid rgba(255,255,255,0.06);">
              <div style="display:flex; align-items:center; gap:0.7rem;">
                <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #10B981, #016B61); display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:700; font-size:0.8rem;">NE</div>
                <div>
                  <div style="color:#FFF; font-size:0.88rem; font-weight:600;">${featured.author || 'Nuel Effiong'}</div>
                  <div style="color:var(--text-cyber-muted); font-size:0.75rem;">${featured.authorRole || 'Principal AI Systems Architect'}</div>
                </div>
              </div>
              <button class="btn btn-primary btn-sm trigger-read-article" data-slug="${featured.slug}">
                Read Case Study &rarr;
              </button>
            </div>
          </div>
        </div>
      `;
      heroContainer.style.display = 'block';
    } else if (heroContainer) {
      heroContainer.style.display = 'none';
    }

    // Grid of posts
    const displayPosts = (heroContainer && !this.searchQuery && this.activeCategory === 'all') ? filtered.slice(1) : filtered;

    grid.innerHTML = displayPosts.map(post => {
      const pdfBadge = post.pdfAttachment ? `
        <span class="badge badge-cyber" style="position:absolute; top:0.75rem; right:0.75rem; display:inline-flex; align-items:center; gap:0.35rem; font-size:0.72rem; box-shadow:0 2px 8px rgba(0,0,0,0.6);">
          <i data-lucide="file-down" style="width:12px; height:12px;"></i> PDF Resource
        </span>
      ` : '';

      return `
        <article class="blog-card" data-slug="${post.slug}" style="background:var(--surface-card-gradient); border:1px solid var(--obsidian-border); border-radius:var(--radius-md); overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; cursor:pointer;">
          <div>
            <div class="blog-card-image-wrap" style="position:relative; width:100%; height:200px; overflow:hidden; background:#080D16;">
              <img class="blog-card-image" src="${post.featuredImage || post.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600'}" alt="${post.title}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.35s ease;" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600'">
              <span class="badge ${post.categoryBadge || 'badge-teal'}" style="position:absolute; top:0.75rem; left:0.75rem;">${post.category}</span>
              ${pdfBadge}
            </div>
            <div class="blog-card-body" style="padding:1.5rem;">
              <div class="blog-card-meta" style="display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; color:var(--text-cyber-muted); margin-bottom:0.65rem;">
                <span><i data-lucide="clock" style="width:12px; height:12px; display:inline;"></i> ${post.readTime || '5 min read'}</span>
                <span>•</span>
                <span>${post.date || 'August 2026'}</span>
              </div>
              <h4 class="blog-card-title" style="color:#FFF; font-size:1.15rem; line-height:1.35; margin-bottom:0.65rem;">${post.title}</h4>
              <p class="blog-card-excerpt" style="color:var(--text-cyber-muted); font-size:0.88rem; line-height:1.55; margin-bottom:1.25rem;">${post.excerpt}</p>
            </div>
          </div>

          <div class="blog-card-footer" style="padding:0 1.5rem 1.5rem 1.5rem; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:1rem;">
            <span style="font-size:0.8rem; color:var(--text-cyber-muted);">By <strong style="color:var(--emerald-light);">${post.author || 'Nuel Effiong'}</strong></span>
            <button class="btn btn-outline btn-xs trigger-read-article" data-slug="${post.slug}">
              Read &rarr;
            </button>
          </div>
        </article>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  async openArticleReader(slug) {
    let post = (this.posts || []).find(p => p.slug === slug || p.id === slug);
    if (!post && window.db && window.db.getBlogPostBySlug) {
      post = await window.db.getBlogPostBySlug(slug);
    }
    if (!post && typeof DEFAULT_BLOG_POSTS !== 'undefined') {
      post = DEFAULT_BLOG_POSTS.find(p => p.slug === slug || p.id === slug);
    }
    if (!post) return;

    const modal = document.getElementById('modal-article-reader');
    if (!modal) return;

    // Set article reader details
    const titleEl = document.getElementById('articleReaderTitle');
    const heroImgEl = document.getElementById('articleReaderHeroImg');
    if (titleEl) titleEl.textContent = post.title;
    if (heroImgEl) {
      heroImgEl.src = post.featuredImage || post.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000';
      heroImgEl.onerror = () => { heroImgEl.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'; };
    }

    const metaContainer = document.getElementById('articleReaderMeta');
    if (metaContainer) {
      const hasPdfBadge = post.pdfAttachment ? `
        <span class="badge badge-cyber" style="display:inline-flex; align-items:center; gap:0.35rem;">
          <i data-lucide="file-text" style="width:12px; height:12px;"></i> Downloadable PDF Resource
        </span>
      ` : '';

      metaContainer.innerHTML = `
        <span class="badge ${post.categoryBadge || 'badge-teal'}">${post.category}</span>
        ${hasPdfBadge}
        <span>By <strong>${post.author || 'Nuel Effiong'}</strong> (${post.authorRole || 'Principal Architect'})</span>
        <span>•</span>
        <span>${post.date || 'August 2026'}</span>
        <span>•</span>
        <span>${post.readTime || '6 min read'}</span>
      `;
    }

    const currentClaps = this.claps[post.slug] || post.claps || 24;

    // Build PDF Download Box HTML if PDF attachment is attached
    let pdfCardHtml = '';
    if (post.pdfAttachment) {
      const pdf = post.pdfAttachment;
      const pdfTitle = pdf.title || pdf.name || 'Downloadable Guide / Blueprint (PDF)';
      const pdfSize = pdf.sizeFormatted || (pdf.size ? `${Math.round(pdf.size / 1024)} KB` : 'PDF Document');
      const pdfDesc = pdf.description || 'Download the official technical blueprint, execution frameworks, and complete companion notes.';
      const downloadCount = pdf.downloads || 142;

      pdfCardHtml = `
        <div class="blog-pdf-download-card" style="margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(0, 245, 212, 0.04) 100%); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: var(--radius-sm); position: relative; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3);">
          <div style="position: absolute; top: 0; right: 0; background: var(--emerald-primary); color: #04070D; font-weight: 800; font-size: 0.65rem; padding: 0.25rem 0.85rem; border-bottom-left-radius: var(--radius-xs); text-transform: uppercase; letter-spacing: 0.05em;">
            FREE RESOURCE
          </div>
          <div style="display: flex; gap: 1.25rem; align-items: flex-start; flex-wrap: wrap;">
            <div style="width: 52px; height: 52px; border-radius: var(--radius-xs); background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center; color: var(--emerald-light); flex-shrink: 0;">
              <i data-lucide="file-text" style="width: 28px; height: 28px;"></i>
            </div>
            <div style="flex: 1; min-width: 250px;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                <h4 style="color: #FFF; font-size: 1.15rem; margin: 0; font-weight: 700;">${pdfTitle}</h4>
                <span class="badge badge-teal" style="font-size: 0.7rem;">${pdfSize}</span>
              </div>
              <p style="color: var(--text-cyber-muted); font-size: 0.88rem; line-height: 1.5; margin: 0 0 1rem 0;">
                ${pdfDesc}
              </p>
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <button class="btn btn-primary btn-sm btn-download-article-pdf" data-slug="${post.slug}" style="display: inline-flex; align-items: center; gap: 0.45rem; box-shadow: 0 0 15px rgba(16,185,129,0.35);">
                  <i data-lucide="download"></i> Download PDF
                </button>
                <button class="btn btn-outline btn-sm btn-preview-article-pdf" data-slug="${post.slug}" style="display: inline-flex; align-items: center; gap: 0.45rem;">
                  <i data-lucide="eye"></i> Preview In-App
                </button>
                <span id="pdfDownloadCountBadge" style="font-size: 0.78rem; color: var(--emerald-light); font-family: var(--font-mono); display: inline-flex; align-items: center; gap: 0.3rem;">
                  <i data-lucide="check-circle" style="width: 13px; height: 13px;"></i> <span id="pdfDownloadCount">${downloadCount}</span> downloads
                </span>
              </div>
            </div>
          </div>
          <!-- In-App Embedded PDF Viewer Container (Collapsible) -->
          <div id="articlePdfPreviewContainer" style="display: none; margin-top: 1.5rem; border-top: 1px solid rgba(16, 185, 129, 0.2); padding-top: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-size: 0.82rem; font-weight: 600; color: #FFF; display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="book-open" style="width: 14px; height: 14px; color: var(--cyan-accent);"></i> Interactive PDF Document Viewer
              </span>
              <button class="btn btn-ghost btn-xs" onclick="window.blog?.togglePdfPreview('${post.slug}')" style="color: var(--text-cyber-muted);">
                <i data-lucide="x"></i> Close Preview
              </button>
            </div>
            <div style="width: 100%; height: 500px; border-radius: var(--radius-xs); overflow: hidden; background: #000; border: 1px solid rgba(255,255,255,0.1);">
              <iframe id="articlePdfIframe" src="" style="width: 100%; height: 100%; border: none;" title="PDF Preview"></iframe>
            </div>
          </div>
        </div>
      `;
    }

    const bodyContainer = document.getElementById('articleReaderBody');
    if (bodyContainer) {
      bodyContainer.innerHTML = `
        <div class="article-tags-bar" style="margin-bottom:1.5rem; display:flex; gap:0.4rem; flex-wrap:wrap;">
          ${(post.tags || []).map(t => `<span class="badge badge-cyber" style="font-size:0.75rem;">#${t}</span>`).join('')}
        </div>

        ${pdfCardHtml}

        <div class="article-formatted-content" style="color:var(--text-cyber-muted); font-size:0.95rem; line-height:1.75;">
          ${post.content}
        </div>

        ${post.pdfAttachment ? `
          <!-- Bottom Download Callout Reminder -->
          <div style="margin-top:2.5rem; padding:1.25rem; background:#080D16; border:1px dashed rgba(16,185,129,0.3); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <div style="color:#FFF; font-weight:700; font-size:0.95rem;">Looking for the companion PDF blueprint?</div>
              <div style="color:var(--text-cyber-muted); font-size:0.82rem;">Download "${post.pdfAttachment.title || post.pdfAttachment.name}" to keep in your offline archives.</div>
            </div>
            <button class="btn btn-primary btn-xs btn-download-article-pdf" data-slug="${post.slug}">
              <i data-lucide="download"></i> Download (${post.pdfAttachment.sizeFormatted || 'PDF'})
            </button>
          </div>
        ` : ''}

        <!-- Social Share & Engagement Footer -->
        <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button class="btn btn-outline btn-sm" id="btnArticleClap" data-slug="${post.slug}">
              👏 <span id="articleClapCount">${currentClaps}</span> Claps
            </button>
          </div>

          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:0.8rem; color:var(--text-cyber-muted);">Share:</span>
            <button class="btn btn-outline btn-xs btn-share-social" data-platform="whatsapp" data-slug="${post.slug}" title="Share on WhatsApp">
              <i data-lucide="message-circle"></i> WhatsApp
            </button>
            <button class="btn btn-outline btn-xs btn-share-social" data-platform="twitter" data-slug="${post.slug}" title="Share on X / Twitter">
              <i data-lucide="twitter"></i> X
            </button>
            <button class="btn btn-outline btn-xs btn-share-social" data-platform="linkedin" data-slug="${post.slug}" title="Share on LinkedIn">
              <i data-lucide="linkedin"></i> LinkedIn
            </button>
            <button class="btn btn-outline btn-xs btn-share-social" data-platform="copy" data-slug="${post.slug}" title="Copy Link">
              <i data-lucide="link"></i> Copy Link
            </button>
          </div>
        </div>
      `;
    }

    // Inject Schema.org JSON-LD dynamically
    this.injectArticleSchema(post);

    if (window.modal) window.modal.open('modal-article-reader');
    if (window.lucide) window.lucide.createIcons();
  }

  async downloadArticlePdf(slug) {
    let post = (this.posts || []).find(p => p.slug === slug || p.id === slug);
    if (!post && window.db && window.db.getBlogPostBySlug) {
      post = await window.db.getBlogPostBySlug(slug);
    }
    if (!post && typeof DEFAULT_BLOG_POSTS !== 'undefined') {
      post = DEFAULT_BLOG_POSTS.find(p => p.slug === slug || p.id === slug);
    }
    if (!post || !post.pdfAttachment) {
      if (window.toast) window.toast.error('No PDF attachment available for this article.');
      return;
    }

    const pdf = post.pdfAttachment;
    const pdfUrl = pdf.url || pdf.dataUrl;
    const fileName = pdf.name || `${post.slug}-resource.pdf`;

    if (!pdfUrl) {
      if (window.toast) window.toast.error('PDF file location is not accessible.');
      return;
    }

    // Trigger browser file download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Increment download metrics in DB
    if (window.db && window.db.incrementBlogPostPdfDownload) {
      const newCount = await window.db.incrementBlogPostPdfDownload(slug);
      const countEl = document.getElementById('pdfDownloadCount');
      if (countEl) countEl.textContent = newCount;
    }

    if (window.toast) {
      window.toast.success(`📥 Downloading "${pdf.title || fileName}"...`);
    }
  }

  togglePdfPreview(slug) {
    const container = document.getElementById('articlePdfPreviewContainer');
    const iframe = document.getElementById('articlePdfIframe');
    if (!container || !iframe) return;

    if (container.style.display === 'block') {
      container.style.display = 'none';
      iframe.src = '';
      return;
    }

    let post = (this.posts || []).find(p => p.slug === slug || p.id === slug);
    if (!post && typeof DEFAULT_BLOG_POSTS !== 'undefined') {
      post = DEFAULT_BLOG_POSTS.find(p => p.slug === slug || p.id === slug);
    }
    if (!post || !post.pdfAttachment) return;

    const pdfUrl = post.pdfAttachment.url || post.pdfAttachment.dataUrl;
    if (!pdfUrl) return;

    iframe.src = pdfUrl;
    container.style.display = 'block';
    if (window.lucide) window.lucide.createIcons();
  }

  addClap(slug) {
    this.claps[slug] = (this.claps[slug] || 24) + 1;
    const countEl = document.getElementById('articleClapCount');
    if (countEl) countEl.textContent = this.claps[slug];
    if (window.toast) window.toast.success("👏 Thank you for the feedback!");
  }

  shareArticle(platform, slug) {
    const post = (this.posts || []).find(p => p.slug === slug);
    const url = `https://zeerocodes.com/#blog`;
    const title = post ? post.title : 'Zeerocodes Case Study';

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=zeerocodes`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      if (window.toast) window.toast.success("Article link copied to clipboard!");
    }
  }

  injectArticleSchema(post) {
    let schemaEl = document.getElementById('blogArticleJsonLd');
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id = 'blogArticleJsonLd';
      schemaEl.type = 'application/ld+json';
      document.head.appendChild(schemaEl);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": post.title,
      "description": post.excerpt,
      "image": [post.featuredImage || post.heroImage || 'https://zeerocodes.com/logo.png'],
      "author": {
        "@type": "Person",
        "name": post.author || 'Nuel Effiong',
        "jobTitle": post.authorRole || 'Principal AI Systems Architect'
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

// Instantiate globally
window.blog = new BlogManager();
