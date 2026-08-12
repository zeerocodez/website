/**
 * Zeerocodes High-Performance Blog & Content Hub Engine (v2.0)
 * SEO-Optimized Articles with Dynamic Schema.org JSON-LD, Live Search,
 * Category Filters, Interactive Reactions, Social Sharing, and In-App Full Reader
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
  }

  bindEvents() {
    // Search input
    document.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'blogSearchInput') {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderFilteredPosts();
      }
    });

    // Category pills
    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.blog-category-pill');
      if (pill) {
        document.querySelectorAll('.blog-category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.getAttribute('data-category') || 'all';
        this.renderFilteredPosts();
      }

      // Read article button trigger
      const readBtn = e.target.closest('.trigger-read-article');
      if (readBtn) {
        const slug = readBtn.getAttribute('data-slug');
        this.openArticleReader(slug);
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
    });
  }

  async loadPosts() {
    if (window.db) {
      this.posts = await window.db.getBlogPosts();
    }
  }

  async renderBlogView() {
    await this.loadPosts();
    this.renderFilteredPosts();
  }

  renderFilteredPosts() {
    const grid = document.getElementById('blogGridContainer');
    const heroContainer = document.getElementById('blogFeaturedHero');
    if (!grid) return;

    let filtered = this.posts.filter(p => p.status === 'published' || !p.status);

    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    if (this.searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(this.searchQuery) ||
        p.excerpt.toLowerCase().includes(this.searchQuery) ||
        (p.tags || []).some(t => t.toLowerCase().includes(this.searchQuery))
      );
    }

    if (!filtered.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem; background:#080D16; border-radius:var(--radius-sm); border:1px solid var(--obsidian-border);">
          <i data-lucide="search-x" style="width:40px; height:40px; color:var(--text-cyber-muted); margin-bottom:1rem;"></i>
          <h4 style="color:#FFF;">No articles found</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.9rem;">Try adjusting your search query or switching categories.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Featured Hero (First matching post)
    const featured = filtered[0];
    if (heroContainer && featured && !this.searchQuery && this.activeCategory === 'all') {
      heroContainer.innerHTML = `
        <div class="blog-hero-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-md); overflow:hidden; display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); margin-bottom:2.5rem; transition:border-color 0.25s ease;">
          <div style="height:100%; min-height:280px; overflow:hidden;">
            <img src="${featured.featuredImage}" alt="${featured.title}" style="width:100%; height:100%; object-fit:cover; display:block;">
          </div>
          <div style="padding:2rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
                <span class="badge ${featured.categoryBadge || 'badge-success'}">${featured.category}</span>
                <span style="font-size:0.8rem; color:var(--text-cyber-muted);"><i data-lucide="clock" style="width:13px; height:13px; display:inline;"></i> ${featured.readTime}</span>
                <span style="font-size:0.8rem; color:var(--text-cyber-muted);">• ${featured.date}</span>
              </div>
              <h3 style="color:#FFF; font-size:1.45rem; line-height:1.3; margin-bottom:0.75rem;">${featured.title}</h3>
              <p style="color:var(--text-cyber-muted); font-size:0.92rem; line-height:1.6; margin-bottom:1.25rem;">${featured.excerpt}</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <div style="width:32px; height:32px; border-radius:50%; background:var(--emerald-primary); display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:700; font-size:0.75rem;">NE</div>
                <div>
                  <div style="color:#FFF; font-size:0.85rem; font-weight:600;">${featured.author}</div>
                  <div style="color:var(--text-cyber-muted); font-size:0.72rem;">${featured.authorRole}</div>
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

    // Grid of remaining posts
    const displayPosts = (heroContainer && !this.searchQuery && this.activeCategory === 'all') ? filtered.slice(1) : filtered;

    grid.innerHTML = displayPosts.map(post => `
      <div class="blog-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.25s ease, border-color 0.25s ease;">
        <div>
          <div style="height:190px; overflow:hidden; position:relative;">
            <img src="${post.featuredImage}" alt="${post.title}" style="width:100%; height:100%; object-fit:cover;">
            <span class="badge ${post.categoryBadge || 'badge-teal'}" style="position:absolute; top:0.75rem; left:0.75rem;">${post.category}</span>
          </div>
          <div style="padding:1.25rem;">
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; color:var(--text-cyber-muted); margin-bottom:0.5rem;">
              <span><i data-lucide="clock" style="width:12px; height:12px; display:inline;"></i> ${post.readTime}</span>
              <span>•</span>
              <span>${post.date}</span>
            </div>
            <h4 style="color:#FFF; font-size:1.1rem; line-height:1.35; margin-bottom:0.5rem;">${post.title}</h4>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; line-height:1.5; margin-bottom:1rem;">${post.excerpt}</p>
          </div>
        </div>

        <div style="padding:0 1.25rem 1.25rem 1.25rem; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:0.85rem;">
          <span style="font-size:0.8rem; color:var(--text-cyber-muted);">By <strong>${post.author}</strong></span>
          <button class="btn btn-outline btn-xs trigger-read-article" data-slug="${post.slug}">
            Read &rarr;
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  async openArticleReader(slug) {
    let post = this.posts.find(p => p.slug === slug || p.id === slug);
    if (!post && window.db) {
      post = await window.db.getBlogPostBySlug(slug);
    }
    if (!post) return;

    const modal = document.getElementById('modal-article-reader');
    if (!modal) return;

    // Set article reader details
    document.getElementById('articleReaderTitle').textContent = post.title;
    document.getElementById('articleReaderHeroImg').src = post.featuredImage;

    const metaContainer = document.getElementById('articleReaderMeta');
    if (metaContainer) {
      metaContainer.innerHTML = `
        <span class="badge ${post.categoryBadge || 'badge-teal'}">${post.category}</span>
        <span>By <strong>${post.author}</strong> (${post.authorRole})</span>
        <span>•</span>
        <span>${post.date}</span>
        <span>•</span>
        <span>${post.readTime}</span>
      `;
    }

    const currentClaps = this.claps[post.slug] || 24;

    const bodyContainer = document.getElementById('articleReaderBody');
    if (bodyContainer) {
      bodyContainer.innerHTML = `
        <div class="article-tags-bar" style="margin-bottom:1.5rem; display:flex; gap:0.4rem; flex-wrap:wrap;">
          ${(post.tags || []).map(t => `<span class="badge badge-cyber" style="font-size:0.75rem;">#${t}</span>`).join('')}
        </div>

        <div class="article-formatted-content" style="color:var(--text-cyber-muted); font-size:0.95rem; line-height:1.75;">
          ${post.content}
        </div>

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

  addClap(slug) {
    this.claps[slug] = (this.claps[slug] || 24) + 1;
    const countEl = document.getElementById('articleClapCount');
    if (countEl) countEl.textContent = this.claps[slug];
    if (window.toast) window.toast.success("👏 Thank you for the feedback!");
  }

  shareArticle(platform, slug) {
    const post = this.posts.find(p => p.slug === slug);
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
      "image": [post.featuredImage],
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
