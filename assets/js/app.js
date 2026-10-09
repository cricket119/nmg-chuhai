/* 内蒙古企业出海一站通 — 前端路由与渲染（零依赖） */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const app = $("#app");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DEMO = '<span class="demo">示例</span>';
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem("nmg_" + k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("nmg_" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- 通用组件 ---------- */
  const ph = (k, title, sub) => `<div class="ph"><div class="pattern"></div><div class="wrap" style="position:relative">
    <div class="crumb"><a href="#/">首页</a> / ${k}</div><h1>${title}</h1><p>${sub}</p></div></div>`;
  const sh = (k, h, p, more) => `<div class="sh"><div><div class="k">${k}</div><h2>${h}</h2>${p ? `<p>${p}</p>` : ""}</div>${more ? `<a class="more-link" href="${more[1]}">${more[0]} →</a>` : ""}</div>`;
  const risk = n => `<span class="risk l${n}" title="风险等级 ${n}/5"><i></i><i></i><i></i><i></i><i></i></span>`;
  const indName = id => (D.industries.find(i => i.id === id) || {}).n || id;
  const guideName = id => (D.guides.find(g => g.id === id) || {}).n || id;

  const caseCard = c => `<div class="card case hov">
    <span class="badge ${c.ok ? "s" : "f"}">${c.ok ? "成功经验" : "失败教训"}</span>
    <h3>${c.n}</h3><div class="meta">${c.ind} · ${c.reg} ${DEMO}</div>
    <p>${c.s}</p>
    <div class="lesson">💡 ${c.l}</div>
    <div style="margin-top:12px">${c.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    <button class="btn btn-o btn-sm" style="margin-top:6px" data-lock="案例深度复盘">🔒 查看深度复盘</button>
  </div>`;

  const reportCard = r => `<div class="card report hov">
    <div class="cover" style="background:${r.c}"><small>${r.k} · ${r.pg} 页</small><b>${r.t}</b></div>
    <p>${r.d}</p>
    <div class="foot"><span class="price ${r.p ? "" : "free"}">${r.p ? "¥" + r.p.toLocaleString() : "免费"}</span>
    <button class="btn ${r.p ? "btn-g" : "btn-p"} btn-sm" data-report="${esc(r.t)}" data-price="${r.p}">${r.p ? "购买 / 会员免费" : "免费下载"}</button></div>
  </div>`;

  const expertCard = e => `<div class="card hov">
    <div class="expert"><div class="avatar" ${e.real ? 'style="background:linear-gradient(135deg,#8a6110,#e2bf5c)"' : ""}>${e.ini}</div><div style="flex:1">
      <h3 style="font-size:16.5px">${e.n}${e.real ? ' <span class="tag lock" style="margin:0">法律先生</span>' : DEMO}</h3>
      <div class="muted" style="font-size:13px">📍 ${e.reg} · ${e.yr} 年经验</div>
      ${e.real ? `<div style="font-size:13px;color:var(--gold);font-weight:600">${e.role}</div>` : `<div class="stars">★★★★★ <span class="muted">${e.rate.toFixed(1)}</span></div>`}
    </div></div>
    <div style="margin:12px 0 8px">${e.sp.map(s => `<span class="tag b">${s}</span>`).join("")}</div>
    <div class="muted" style="font-size:13px">工作语言：${e.lang} · <span class="tag">${e.type}</span></div>
    <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-p btn-sm" data-consult="${esc(e.n)}">预约咨询</button><button class="btn btn-o btn-sm" data-lock="律师完整档案与报价">查看档案</button></div>
  </div>`;

  const oppRow = o => `<div class="row"><div class="date">截止<br><b>${o.due}</b></div><div style="flex:1">
    <h4>${o.t.replace("示例：", "")}${DEMO}</h4><p>📍 ${o.r} · ${o.ind} · 规模：${o.amt} · 来源：${o.src}</p></div>
    <button class="btn btn-o btn-sm" data-lock="商机联系方式">🔒 获取联系方式</button></div>`;

  const policyRow = p => `<div class="row"><div class="date">${p.d}</div><div style="flex:1">
    <h4><span class="tag b">${p.r}</span><span class="tag y">${p.tag}</span> ${p.t.replace("示例：", "")}${DEMO}</h4><p>影响提示：${p.imp}</p></div></div>`;

  const demandRow = d => `<div class="row"><div class="date">${d.d}</div><div style="flex:1">
    <h4><span class="tag g">${d.kind}</span> ${esc(d.t)}${d.mine ? ' <span class="tag b">我发布的</span>' : DEMO}</h4>
    <p>${esc(d.who)} · ${esc(d.ind)} · 目标市场：${esc(d.reg)}</p></div>
    <button class="btn btn-o btn-sm" data-match="${esc(d.t)}">我能对接</button></div>`;

  /* ---------- 赵云涛律师团队 · 全球合伙人 ---------- */
  function globeSVG() {
    const L = D.lex, hub = [600, 104];
    const lines = L.nodes.map(([, x, y]) => { const mx = (hub[0] + x) / 2, my = Math.min(hub[1], y) - 40 - Math.abs(hub[0] - x) * .08; return `<path d="M${hub[0]},${hub[1]} Q${mx},${my} ${x},${y}"/>`; }).join("");
    const dots = L.nodes.map(([n, x, y], i) => `<g><circle class="p" cx="${x}" cy="${y}" r="3" style="animation-delay:${(i % 7) * .35}s"/><circle cx="${x}" cy="${y}" r="3"/>${i % 2 === 0 || n === "蒙古国" ? `<text x="${x}" y="${y - 7}">${n}</text>` : ""}</g>`).join("");
    let grid = ""; for (let x = 20; x < 760; x += 14) for (let y = 30; y < 340; y += 14) { const lx = x / 760, ly = y / 340; const land = (lx > .1 && lx < .32 && ly > .15 && ly < .55) || (lx > .22 && lx < .32 && ly > .55 && ly < .98) || (lx > .38 && lx < .9 && ly > .12 && ly < .5) || (lx > .4 && lx < .55 && ly > .45 && ly < .92) || (lx > .72 && lx < .82 && ly > .55 && ly < .75) || (lx > .84 && lx < .94 && ly > .82 && ly < .98) || (lx > .6 && lx < .66 && ly > .6 && ly < .76); if (land && (x * 7 + y * 3) % 5) grid += `<circle cx="${x}" cy="${y}" r="1.3"/>`; }
    return `<svg class="globe" viewBox="0 0 760 360" role="img" aria-label="法律先生全球合伙人网络示意">
      <g class="land">${grid}</g><g class="lines">${lines}</g><g class="dots">${dots}</g>
      <circle cx="${hub[0]}" cy="${hub[1]}" r="18" fill="rgba(226,191,92,.25)"/><circle cx="${hub[0]}" cy="${hub[1]}" r="8" fill="#e2bf5c"/>
      <text x="${hub[0] + 14}" y="${hub[1] + 22}" class="hub">内蒙古</text></svg>`;
  }

  function lexBlock(full) {
    const L = D.lex;
    return `<section class="lexsec"><div class="wrap">
      <div class="lexhead">
        <div>
          <div class="lexbrand"><img src="assets/img/logo.jpg" alt="法律先生 LEX MAGISTER"><span>法律先生 LEX MAGISTER<br><small>全球合伙人体系</small></span></div>
          <h2>赵云涛律师团队<br><em>一键联通全世界</em></h2>
          <p>依托法律先生遍布全球的合伙人体系，我们为内蒙古企业提供的不只是海外法律保障——更帮企业<b>打通海外市场、打通产业上下游</b>。你只需提出需求，剩下的交给全球网络。</p>
          <div class="cta" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px">
            <button class="btn btn-g" data-connect>🌐 一键联通全球合伙人</button>
            ${full ? `<button class="btn btn-ghost" data-team>了解赵云涛律师团队</button>` : `<a class="btn btn-ghost" href="#/global">了解全球合伙人体系 →</a>`}
          </div>
        </div>
        <div>${globeSVG()}</div>
      </div>
      <div class="lexstats">${L.stats.map(k => `<div><b>${k.v}<small>${k.u}</small></b><span>${k.t}</span></div>`).join("")}</div>
      <div class="grid3 lexpillars">${L.pillars.map(p => `<div class="lp"><div class="ico">${p.ico}</div><h3>${p.t}</h3><p>${p.d}</p><div>${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div></div>`).join("")}</div>
      <p class="lexsrc">网络数据来源：法律先生官网 lexmagister.com</p>
    </div></section>`;
  }

  function centersBlock() {
    return `<div class="grid3">${D.lex.centers.map(c => `<div class="card center" style="padding:0;overflow:hidden">
      ${c.img ? `<img src="${c.img}" alt="${c.t}" loading="lazy">` : `<div class="noimg">即将成立</div>`}
      <div style="padding:18px 20px 20px"><div class="muted" style="font-size:12.5px">${c.k}</div><h3 style="font-size:16.5px;margin-top:4px">${c.t}</h3><p>${c.d}</p></div></div>`).join("")}</div>`;
  }

  function global() {
    const L = D.lex;
    app.innerHTML = ph("全球合伙人", "赵云涛律师团队 · 法律先生全球合伙人体系", "全世界每一个国家 × 中国每一个城市 × 专项业务场景。一处需求，全网响应。") + lexBlock(true) + `
    <section class="sec"><div class="wrap">
      ${sh("HOW IT WORKS", "一键联通，如何运转", "不是「找一位当地律师引荐就完事」，而是围绕企业出海持续协同的全球网络。")}
      <div class="flow">${L.flow.map(f => `<div class="step"><div class="muted" style="font-size:11.5px;letter-spacing:1.5px">${f[0]}</div><h4>${f[1]}</h4><p>${f[2]}</p></div>`).join("")}</div>
    </div></section>
    <section class="sec alt"><div class="wrap">
      ${sh("NETWORK", "城市 × 国家 × 专项，三类合伙人纵横交织", "")}
      <div class="grid3">${L.roles.map(r => `<div class="card"><div class="muted" style="font-size:13px">${r.s}</div><h3 style="font-size:20px">${r.t}</h3><p>${r.d}</p></div>`).join("")}</div>
      <div class="grid3" style="margin-top:18px">${L.advisors.map(a => `<div class="card" style="background:var(--soft);box-shadow:none"><h3 style="font-size:16px">顶级顾问库 · ${a[0]}</h3><p>${a[1]}</p></div>`).join("")}</div>
    </div></section>
    <section class="sec"><div class="wrap">
      ${sh("GLOBAL CENTERS", "把服务中心开到企业出海的目的地", "")}
      ${centersBlock()}
    </div></section>
    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="band"><div><h3>内蒙古城市合伙人 · 席位招募</h3><p>呼和浩特、包头、鄂尔多斯、赤峰……每个盟市限额招募，成为当地企业的出海入口。</p></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-w" data-partner>申请城市合伙人</button><a class="btn btn-ghost" href="https://www.lexmagister.com/articles/global-partners/" target="_blank" rel="noopener">合伙人计划详情 ↗</a></div></div>
    </div></section>`;
  }

  /* ---------- 首页 ---------- */
  function heroSVG() {
    const c = [250, 200];
    const pts = [["俄罗斯", 330, 46], ["蒙古国", 196, 118], ["欧洲", 40, 64], ["中亚", 70, 168], ["中东", 54, 278], ["东南亚", 318, 338], ["日韩", 458, 168], ["非洲", 150, 352]];
    const arcs = pts.map(([, x, y]) => {
      const mx = (c[0] + x) / 2, my = (c[1] + y) / 2 - 50;
      return `<path class="arc" d="M${c[0]},${c[1]} Q${mx},${my} ${x},${y}"/>`;
    }).join("");
    const nodes = pts.map(([n, x, y]) => `<g class="node"><circle class="p" cx="${x}" cy="${y}" r="5" fill="#e2bf5c"/><circle cx="${x}" cy="${y}" r="4.5" fill="#e2bf5c"/>
      <text x="${x}" y="${y - 11}" text-anchor="middle" fill="#dbe6f3" font-size="13">${n}</text></g>`).join("");
    return `<svg class="routes" viewBox="0 0 500 380" role="img" aria-label="内蒙古出海通道示意">
      <defs><linearGradient id="gArc" x1="0" x2="1"><stop offset="0" stop-color="#e2bf5c"/><stop offset="1" stop-color="#5fb0ff"/></linearGradient>
      <radialGradient id="gC"><stop offset="0" stop-color="#e2bf5c" stop-opacity=".55"/><stop offset="1" stop-color="#e2bf5c" stop-opacity="0"/></radialGradient></defs>
      <circle cx="250" cy="200" r="170" fill="none" stroke="rgba(255,255,255,.08)"/><circle cx="250" cy="200" r="110" fill="none" stroke="rgba(255,255,255,.08)"/>
      ${arcs}${nodes}
      <circle cx="250" cy="200" r="46" fill="url(#gC)"/>
      <circle cx="250" cy="200" r="22" fill="#fff"/><circle cx="250" cy="200" r="16" fill="#0d2540"/>
      <path d="M241 205c3-7 15-7 18 0" fill="none" stroke="#e2bf5c" stroke-width="2.5" stroke-linecap="round"/><path d="M250 190l4.5 5h-3v4h-3v-4h-3z" fill="#fff"/>
      <text x="250" y="244" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">内蒙古</text>
    </svg>`;
  }

  function home() {
    const mods = [
      ["📊", "出海现状", "全区出海规模、结构与趋势", "#/status"], ["🏭", "行业特点", "八大产业集群出海画像", "#/status#ind"],
      ["📁", "案例库", "成功经验与失败教训复盘", "#/cases"], ["🛡️", "合规指南", "十大领域合规清单", "#/compliance"],
      ["⚠️", "避坑指南", "前人踩过的坑，你不必再踩", "#/pitfalls"], ["🗺️", "区域情报", "12 个重点国家与区域", "#/regions"],
      ["📰", "政策与商机", "各地政策变化、项目机会", "#/opps"], ["⚖️", "律师推荐", "海外律师与专业服务商", "#/experts"],
      ["📣", "需求广场", "发布需求，精准对接", "#/demand"], ["📚", "调研报告", "国别、行业、合规研究", "#/reports"],
      ["🩺", "出海体检", "3 分钟测出你的风险点", "#/checkup"], ["🏛️", "政府 · 园区", "区域出海态势看板", "#/gov"]
    ];
    app.innerHTML = `
    <section class="hero"><div class="pattern"></div><div class="wrap">
      <div>
        <span class="eyebrow">◆ 赵云涛律师团队 × 法律先生全球合伙人体系</span>
        <h1>让内蒙古企业<br><em>出海有路、合规有底、对接有人</em></h1>
        <p class="lead">35 国、900 余家国际律所、5000 余名海外律师组成的全球网络，为内蒙古企业提供海外法律保障，更帮你打通市场、打通上下游。出海情报、合规指南、案例与商机，一站汇齐。</p>
        <div class="cta"><button class="btn btn-g" data-connect>🌐 一键联通全球合伙人</button><a class="btn btn-ghost" href="#/checkup">🩺 免费出海体检</a></div>
        <form class="search" id="hsearch"><input placeholder="搜索国家、行业、合规问题，如：蒙古国 矿业 / CBAM / 清真认证" aria-label="搜索"><button class="btn btn-p">搜索</button></form>
        <div class="hot">热门：<a href="#/regions">蒙古国投资</a><a href="#/compliance?g=esg">欧盟 CBAM</a><a href="#/compliance?g=export">稀土出口管制</a><a href="#/compliance?g=fx">对俄结算</a></div>
      </div>
      <div>${heroSVG()}</div>
    </div></section>

    <div class="kpis"><div class="wrap"><div class="grid">
      ${D.kpis.map(k => `<div class="kpi"><b data-count="${k.v}">${k.v}<small>${k.u}</small></b><span>${k.t}</span></div>`).join("")}
    </div></div></div>

    ${lexBlock(false)}

    <section class="sec"><div class="wrap">
      ${sh("ONE-STOP SERVICES", "一站式出海服务矩阵", "从「看清方向」到「落地护航」，覆盖企业出海全周期的 12 个核心板块。")}
      <div class="mods">${mods.map(m => `<a class="mod" href="${m[3]}"><div class="ico">${m[0]}</div><div><b>${m[1]}</b><span>${m[2]}</span></div></a>`).join("")}</div>
    </div></section>

    <section class="sec alt"><div class="wrap">
      ${sh("HOW IT WORKS", "四步走出去", "")}
      <div class="flow">
        <div class="step"><h4>诊断</h4><p>出海体检 + 行业画像，找准目标市场与风险短板。</p></div>
        <div class="step"><h4>学习</h4><p>合规指南、避坑清单、案例复盘，少走弯路。</p></div>
        <div class="step"><h4>对接</h4><p>发布需求，匹配海外律师、服务商、渠道与合作伙伴。</p></div>
        <div class="step"><h4>护航</h4><p>政策变化推送、风险预警、合同审阅，持续陪跑。</p></div>
      </div>
    </div></section>

    <section class="sec"><div class="wrap">
      ${sh("INDUSTRIES", "八大产业 · 出海画像", "每个产业的目标市场、典型路径与核心合规难点。", ["查看全部", "#/status#ind"])}
      <div class="grid4">${D.industries.map(i => `<a class="card" href="#/status#ind"><div class="ico">${i.ico}</div><h3>${i.n}</h3><p style="font-size:13px">📍 ${i.c}</p><p style="margin-top:6px">→ ${i.mk}</p></a>`).join("")}</div>
    </div></section>

    <section class="sec alt"><div class="wrap">
      ${sh("CASE LIBRARY", "成功与失败，都是最好的老师", "脱敏改编的真实出海故事，提炼可复用的经验与教训。", ["进入案例库", "#/cases"])}
      <div class="grid3">${[D.cases[0], D.cases[4], D.cases[5]].map(caseCard).join("")}</div>
    </div></section>

    <section class="sec"><div class="wrap">
      <div class="grid2" style="gap:32px">
        <div>${sh("POLICY WATCH", "各地政策动态", "", ["更多", "#/opps"])}<div class="list">${D.policies.slice(0, 4).map(policyRow).join("")}</div></div>
        <div>${sh("OPPORTUNITIES", "海外商机速递", "", ["更多", "#/opps"])}<div class="list">${D.opps.slice(0, 4).map(oppRow).join("")}</div></div>
      </div>
    </div></section>

    <section class="sec alt"><div class="wrap">
      ${sh("GLOBAL CENTERS", "法律先生海外服务中心", "蒙古国中心已在乌兰巴托落地——内蒙古企业赴蒙，第一站就有人接应。", ["全球合伙人体系", "#/global"])}
      ${centersBlock()}
    </div></section>

    <section class="sec"><div class="wrap">
      ${sh("RESEARCH", "调研报告", "国别研究、行业研究、合规专题，帮助企业与政府做出更好的决策。", ["报告中心", "#/reports"])}
      <div class="grid4">${D.reports.slice(0, 4).map(reportCard).join("")}</div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div class="band"><div><h3>盟市商务部门、开发区与商协会</h3><p>一块看板掌握辖区企业出海态势、需求与风险，为精准施策提供数据支撑。</p></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-w" href="#/gov">查看政府看板</a><a class="btn btn-ghost" href="javascript:void(0)" data-contact>洽谈合作</a></div></div>
    </div></section>`;
    $("#hsearch").onsubmit = e => { e.preventDefault(); const q = e.target.querySelector("input").value.trim(); location.hash = "#/search?q=" + encodeURIComponent(q); };
    countUp();
  }

  function countUp() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$("[data-count]").forEach(el => {
      const end = +el.dataset.count, sm = el.querySelector("small").outerHTML; let t0;
      const step = ts => { t0 ??= ts; const p = Math.min(1, (ts - t0) / 1200); el.innerHTML = Math.round(end * (1 - Math.pow(1 - p, 3))) + sm; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
      setTimeout(() => { el.innerHTML = end + sm; }, 1600);
    });
  }

  /* ---------- 出海现状 + 行业 + 痛点 ---------- */
  function status() {
    const S = D.status, max = Math.max(...S.partners.map(p => p.v));
    app.innerHTML = ph("出海现状", "内蒙古企业出海现状", S.intro) + `
    <section class="sec"><div class="wrap">
      ${sh("EVOLUTION", "从口岸贸易到品牌出海", "")}
      <div class="flow">${S.stages.map(s => `<div class="step"><h4>${s.y}</h4><p>${s.d}</p></div>`).join("")}</div>
    </div></section>
    <section class="sec alt"><div class="wrap"><div class="grid2" style="gap:32px;align-items:start">
      <div>${sh("PARTNERS", "主要贸易伙伴（相对规模）", "以最大贸易伙伴为 100 的相对指数示意。")}
        <div class="card">${S.partners.map(p => `<div style="display:grid;grid-template-columns:80px 1fr 40px;gap:10px;align-items:center;margin:10px 0;font-size:14px"><span>${p.n}</span><span style="height:12px;background:var(--soft);border-radius:99px;overflow:hidden"><i style="display:block;height:100%;width:${p.v / max * 100}%;background:linear-gradient(90deg,var(--blue),var(--sky));border-radius:99px"></i></span><b style="text-align:right">${p.v}</b></div>`).join("")}
        <p class="note">示意数据，上线前以呼和浩特海关公开统计替换。${DEMO}</p></div></div>
      <div>${sh("TRENDS", "四大趋势", "")}<div class="list">${S.trends.map((t, i) => `<div class="row"><div class="date" style="font-size:22px;font-weight:800;color:var(--gold)">0${i + 1}</div><div><h4>${t.t}</h4><p>${t.d}</p></div></div>`).join("")}</div></div>
    </div></div></section>
    <section class="sec" id="ind"><div class="wrap">
      ${sh("INDUSTRIES", "行业特点：八大产业出海画像", "点击合规标签直达对应指南。")}
      <div class="grid2">${D.industries.map(i => `<div class="card"><div style="display:flex;gap:14px"><div class="ico" style="margin:0">${i.ico}</div><div><h3>${i.n}</h3><div class="muted" style="font-size:13px">📍 ${i.c} · 主要市场：${i.mk}</div></div></div>
        <p style="margin-top:12px;color:var(--ink2)">${i.tr}</p>
        <div style="margin-top:10px;font-size:14px"><b style="font-size:13px;color:var(--red)">核心难点</b><ul style="margin:6px 0 10px;padding-left:18px;color:var(--muted)">${i.pain.map(p => `<li>${p}</li>`).join("")}</ul></div>
        ${i.g.map(g => `<a class="tag b" href="#/compliance?g=${g}">${guideName(g)} →</a>`).join("")}</div>`).join("")}</div>
    </div></section>
    <section class="sec alt"><div class="wrap">
      ${sh("PAIN POINTS", "企业出海遇到的八大问题", "平台每一个板块，都对应解决其中一个或多个问题。")}
      <div class="grid4">${D.pains.map(p => `<div class="card"><div class="ico">${p.ico}</div><h3>${p.t}</h3><p>${p.d}</p></div>`).join("")}</div>
    </div></section>`;
  }

  /* ---------- 案例库 ---------- */
  function cases() {
    const st = { ok: "all", ind: "", q: "" };
    const inds = [...new Set(D.cases.map(c => c.ind))];
    app.innerHTML = ph("案例库", "出海案例库", "成功的路径可以复制，失败的教训更值得珍惜。所有案例均经脱敏改编，聚焦可复用的方法论。") + `
    <section class="sec"><div class="wrap">
      <div class="filters">
        <button class="chip on" data-ok="all">全部</button><button class="chip" data-ok="1">✅ 成功经验</button><button class="chip" data-ok="0">❌ 失败教训</button>
        <span class="sp"></span>
        <select id="cind"><option value="">全部行业</option>${inds.map(i => `<option>${i}</option>`).join("")}</select>
        <input id="cq" placeholder="搜索关键词">
      </div>
      <div class="grid3" id="clist"></div>
      <p class="note">投稿：欢迎企业匿名分享出海经历，经编辑脱敏后收录，投稿企业可获赠会员权益。<a href="javascript:void(0)" data-contact>我要投稿 →</a></p>
    </div></section>`;
    const draw = () => {
      const r = D.cases.filter(c => (st.ok === "all" || String(+c.ok) === st.ok) && (!st.ind || c.ind === st.ind) && (!st.q || (c.n + c.s + c.tags.join()).includes(st.q)));
      $("#clist").innerHTML = r.length ? r.map(caseCard).join("") : `<div class="empty">没有匹配的案例</div>`;
    };
    $$("[data-ok]").forEach(b => b.onclick = () => { $$("[data-ok]").forEach(x => x.classList.remove("on")); b.classList.add("on"); st.ok = b.dataset.ok; draw(); });
    $("#cind").onchange = e => { st.ind = e.target.value; draw(); };
    $("#cq").oninput = e => { st.q = e.target.value.trim(); draw(); };
    draw();
  }

  /* ---------- 合规指南 ---------- */
  function compliance(qs) {
    const done = store.get("checks", {});
    let cur = qs.get("g") || D.guides[0].id;
    app.innerHTML = ph("合规指南", "出海合规指南", "十大合规领域，每一项都配有可勾选的自查清单，进度自动保存在本机浏览器。") + `
    <section class="sec"><div class="wrap"><div class="guide">
      <div class="gnav">${D.guides.map(g => `<button data-g="${g.id}">${g.ico} ${g.n}</button>`).join("")}</div>
      <div class="card gbody" id="gbody"></div>
    </div></div></section>`;
    const draw = () => {
      const g = D.guides.find(x => x.id === cur) || D.guides[0];
      $$("[data-g]").forEach(b => b.classList.toggle("on", b.dataset.g === g.id));
      const n = g.items.filter((_, i) => done[g.id + i]).length;
      $("#gbody").innerHTML = `<div class="ico">${g.ico}</div><h2>${g.n}</h2><p class="muted">${g.s}</p>
        <dl class="kv"><dt>适用企业</dt><dd>${g.who}</dd><dt>主要依据</dt><dd>${g.law}</dd></dl>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px"><b>自查清单</b><span class="muted" style="font-size:13px">已完成 ${n}/${g.items.length}</span></div>
        <div class="meter" style="margin-top:8px"><i style="width:${n / g.items.length * 100}%;background:var(--grass)"></i></div>
        <ul class="check">${g.items.map((t, i) => `<li data-i="${i}" class="${done[g.id + i] ? "done" : ""}">${t}</li>`).join("")}</ul>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
          <button class="btn btn-p" data-lock="《${g.n}》完整实务手册（含模板）">📘 下载完整实务手册</button>
          <a class="btn btn-o" href="#/experts">找专业律师</a></div>
        <p class="note">本指南为一般性信息，不构成法律意见。具体事项请咨询专业律师。</p>`;
      $$("#gbody .check li").forEach(li => li.onclick = () => { const k = g.id + li.dataset.i; done[k] = !done[k]; store.set("checks", done); draw(); });
    };
    $$("[data-g]").forEach(b => b.onclick = () => { cur = b.dataset.g; draw(); });
    draw();
  }

  /* ---------- 避坑指南 ---------- */
  function pitfalls() {
    const cats = [...new Set(D.pitfalls.map(p => p.c))];
    app.innerHTML = ph("避坑指南", "出海避坑指南", "这些坑，前人已经用真金白银踩过了。") + `
    <section class="sec"><div class="wrap">
      <div class="filters"><button class="chip on" data-c="">全部</button>${cats.map(c => `<button class="chip" data-c="${c}">${c}</button>`).join("")}</div>
      <div class="grid2" id="plist"></div>
    </div></section>`;
    const draw = c => $("#plist").innerHTML = D.pitfalls.filter(p => !c || p.c === c).map((p, i) => `<div class="card"><div style="display:flex;gap:12px"><div style="font-size:26px;line-height:1">⚠️</div><div><span class="tag r">${p.c}</span><h3 style="font-size:16.5px">不要${p.t}</h3><p>后果：${p.d}</p></div></div></div>`).join("");
    $$("[data-c]").forEach(b => b.onclick = () => { $$("[data-c]").forEach(x => x.classList.remove("on")); b.classList.add("on"); draw(b.dataset.c); });
    draw("");
  }

  /* ---------- 区域情报 ---------- */
  function regions() {
    const tiers = ["核心", "重点", "关注"];
    app.innerHTML = ph("区域情报", "重点区域情报", "围绕中蒙俄经济走廊，向中亚、中东、东南亚、欧洲及新兴市场梯次拓展。") + `
    <section class="sec"><div class="wrap">
      <div class="filters"><button class="chip on" data-t="">全部区域</button>${tiers.map(t => `<button class="chip" data-t="${t}">${t}市场</button>`).join("")}<span class="sp"></span><span class="muted" style="font-size:13px">风险等级 ${risk(1)} 低 → ${risk(5)} 高</span></div>
      <div class="grid3" id="rlist"></div>
    </div></section>`;
    const draw = t => $("#rlist").innerHTML = D.regions.filter(r => !t || r.tier === t).map(r => `<div class="card region hov">
      <h3><span class="flag">${r.f}</span>${r.n} <span class="tag ${r.tier === "核心" ? "y" : r.tier === "重点" ? "b" : ""}" style="margin:0 0 0 auto">${r.tier}</span></h3>
      <p style="margin-top:6px">${r.why}</p>
      <div style="margin-top:10px;font-size:13px">风险等级 ${risk(r.risk)}</div>
      <b style="display:block;margin-top:12px;font-size:13px;color:var(--grass)">主要机会</b><ul>${r.op.map(x => `<li>${x}</li>`).join("")}</ul>
      <b style="display:block;margin-top:10px;font-size:13px;color:var(--red)">主要风险</b><ul>${r.rk.map(x => `<li>${x}</li>`).join("")}</ul>
      <div style="margin-top:12px">${r.ind.map(i => `<span class="tag">${indName(i)}</span>`).join("")}</div>
      <button class="btn btn-o btn-sm" style="margin-top:8px" data-lock="${r.n}国别深度情报（法律、税务、外汇、用工）">🔒 国别深度情报</button></div>`).join("");
    $$("[data-t]").forEach(b => b.onclick = () => { $$("[data-t]").forEach(x => x.classList.remove("on")); b.classList.add("on"); draw(b.dataset.t); });
    draw("");
  }

  /* ---------- 政策与商机 ---------- */
  function opps() {
    app.innerHTML = ph("政策与商机", "各地政策变化 · 资源 · 商业机会", "编辑团队每日跟踪重点国家政策、招标与合作需求，会员可订阅定向推送。") + `
    <section class="sec"><div class="wrap"><div class="grid2" style="gap:32px;align-items:start">
      <div>${sh("POLICY WATCH", "政策动态", "每条附原文链接与影响解读（上线后）")}<div class="list">${D.policies.map(policyRow).join("")}</div></div>
      <div>${sh("OPPORTUNITIES", "海外商机", "招标项目、采购需求、合作招募")}<div class="list">${D.opps.map(oppRow).join("")}</div>
        <div class="card" style="margin-top:16px;background:#fbf7ea;border-color:#ecdcae"><h3>📮 订阅定向推送</h3><p>按国家、行业订阅，政策变化与商机第一时间送达。</p>
        <button class="btn btn-g btn-sm" style="margin-top:12px" data-subscribe>立即订阅</button></div></div>
    </div></div></section>
    <section class="sec alt"><div class="wrap">
      ${sh("RESOURCES", "出海资源地图", "政府、金融、展会、园区、人才、工具，一处汇总。")}
      <div class="grid3">${D.resources.map(r => `<div class="card"><div class="ico">${r.ico}</div><h3>${r.t}</h3><p>${r.d}</p></div>`).join("")}</div>
    </div></section>`;
  }

  /* ---------- 律师与服务商 ---------- */
  function experts(qs) {
    const types = [...new Set(D.experts.map(e => e.type))];
    app.innerHTML = ph("律师团队", "赵云涛律师团队 · 全球合伙人律师", "依托法律先生 35 国、900 余家国际律所网络，按国家、语言、专业领域精准匹配。首次咨询会员享 30 分钟免费。") + `
    <section class="sec"><div class="wrap">
      <div class="teamcard"><div><div class="k" style="color:var(--gold2);font-size:12.5px;letter-spacing:2px;font-weight:700">LEAD COUNSEL</div><h2>赵云涛律师团队</h2>
        <p>统筹法律先生全球合伙人体系，为内蒙古企业出海提供「法律保障 + 市场开拓 + 上下游对接」一体化服务。</p>
        <p class="pending">团队简介、执业背景与代表业绩待补充</p></div>
        <div style="display:flex;flex-direction:column;gap:10px"><button class="btn btn-g" data-connect>🌐 一键联通</button><a class="btn btn-ghost" href="#/global">全球合伙人体系</a></div></div>
      <div class="filters"><button class="chip on" data-ty="">全部</button>${types.map(t => `<button class="chip" data-ty="${t}">${t}</button>`).join("")}<span class="sp"></span><input id="eq" placeholder="搜索国家或领域，如：蒙古 / CBAM"></div>
      <div class="grid3" id="elist"></div>
      <div class="grid3" style="margin-top:28px">
        <div class="card"><h3>🔎 资质审核</h3><p>核验执业证书、所属律所与从业年限，定期复审。</p></div>
        <div class="card"><h3>⭐ 真实评价</h3><p>仅完成服务的企业可评价，评价公开透明。</p></div>
        <div class="card"><h3>💰 透明报价</h3><p>标准化服务包与报价区间，避免信息不对称。</p></div>
      </div>
      <div class="band" style="margin-top:32px"><div><h3>海外律师 · 服务商入驻招募</h3><p>覆盖蒙古国、俄罗斯、中亚、中东、东南亚、欧洲，诚邀专业机构加入。</p></div><button class="btn btn-w" data-join>申请入驻</button></div>
    </div></section>`;
    const st = { ty: "", q: "" };
    const draw = () => { const r = D.experts.filter(e => (!st.ty || e.type === st.ty) && (!st.q || (e.n + e.reg + e.sp.join()).includes(st.q))); $("#elist").innerHTML = r.length ? r.map(expertCard).join("") : `<div class="empty">暂无匹配，<a href="#/demand?post=1">发布需求</a>让我们帮你找</div>`; };
    $$("[data-ty]").forEach(b => b.onclick = () => { $$("[data-ty]").forEach(x => x.classList.remove("on")); b.classList.add("on"); st.ty = b.dataset.ty; draw(); });
    $("#eq").oninput = e => { st.q = e.target.value.trim(); draw(); };
    draw();
    if (qs.get("join")) openJoin();
  }

  /* ---------- 需求广场 ---------- */
  function demand(qs) {
    const kinds = ["找客户", "找渠道", "找律师", "找服务", "找资金", "找人才", "找合作伙伴"];
    app.innerHTML = ph("需求广场", "需求广场 · 精准对接", "发布你的出海需求，平台顾问 48 小时内人工匹配合适的人与资源。") + `
    <section class="sec"><div class="wrap"><div class="grid2 split">
      <div>
        <div class="filters"><button class="chip on" data-k="">全部</button>${kinds.slice(0, 6).map(k => `<button class="chip" data-k="${k}">${k}</button>`).join("")}</div>
        <div class="list" id="dlist"></div>
      </div>
      <div class="card" id="post" style="position:sticky;top:86px">
        <h3>📣 发布需求</h3><p>信息仅对平台顾问与匹配对象可见，可选择匿名展示。</p>
        <form class="form" id="dform" style="margin-top:16px">
          <div class="full"><label>需求标题 *</label><input name="t" required placeholder="例：寻找哈萨克斯坦乳品进口商"></div>
          <div><label>需求类型</label><select name="kind">${kinds.map(k => `<option>${k}</option>`).join("")}</select></div>
          <div><label>目标市场</label><select name="reg">${D.regions.map(r => `<option>${r.n}</option>`).join("")}</select></div>
          <div class="full"><label>所属行业</label><select name="ind">${D.industries.map(i => `<option>${i.n}</option>`).join("")}</select></div>
          <div class="full"><label>需求描述</label><textarea name="desc" placeholder="产品、规模、时间、预算等"></textarea></div>
          <div><label>企业名称 *</label><input name="who" required></div>
          <div><label>联系电话 *</label><input name="tel" required pattern="[0-9+\\- ]{7,20}"></div>
          <div class="full"><label style="font-weight:400"><input type="checkbox" name="anon" checked style="width:auto"> 匿名展示企业名称</label></div>
          <div class="full"><button class="btn btn-p" style="width:100%;justify-content:center">提交需求</button></div>
        </form>
      </div>
    </div></div></section>`;
    let kind = "";
    const draw = () => {
      const mine = store.get("demands", []);
      const all = [...mine, ...D.demands].filter(d => !kind || d.kind === kind);
      $("#dlist").innerHTML = all.length ? all.map(demandRow).join("") : `<div class="empty">暂无此类需求</div>`;
    };
    $$("[data-k]").forEach(b => b.onclick = () => { $$("[data-k]").forEach(x => x.classList.remove("on")); b.classList.add("on"); kind = b.dataset.k; draw(); });
    $("#dform").onsubmit = e => {
      e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
      const mine = store.get("demands", []);
      mine.unshift({ t: f.t, kind: f.kind, reg: f.reg, ind: f.ind, who: f.anon ? "某内蒙古企业（匿名）" : f.who, d: new Date().toISOString().slice(0, 10), mine: true });
      store.set("demands", mine); e.target.reset(); draw();
      modal(`<h3>✅ 需求已提交</h3><p>平台顾问将在 48 小时内与您联系，并推送匹配的服务商与合作伙伴。</p>
        <p class="note">原型演示：数据仅保存在本机浏览器。正式版接入后台与短信通知。</p>
        <div style="margin-top:16px"><b>你可能还需要</b><div style="margin-top:8px"><a class="tag b" href="#/experts">${f.reg} 律师</a><a class="tag b" href="#/regions">${f.reg} 国别情报</a><a class="tag b" href="#/checkup">出海体检</a></div></div>`);
    };
    draw();
    if (qs.get("post")) setTimeout(() => { $("#post").scrollIntoView({ behavior: "smooth", block: "start" }); $("#dform input").focus({ preventScroll: true }); }, 50);
  }

  /* ---------- 调研报告 ---------- */
  function reports() {
    const ks = [...new Set(D.reports.map(r => r.k))];
    app.innerHTML = ph("调研报告", "调研报告中心", "国别研究、行业研究、合规专题与年度报告。企业会员每年免费阅读 3 份，出海加速会员全部免费。") + `
    <section class="sec"><div class="wrap">
      <div class="filters"><button class="chip on" data-rk="">全部</button>${ks.map(k => `<button class="chip" data-rk="${k}">${k}</button>`).join("")}<button class="chip" data-rk="free">只看免费</button></div>
      <div class="grid4" id="rlist"></div>
      <div class="band" style="margin-top:32px"><div><h3>定制研究</h3><p>为企业、政府部门与园区提供专项国别、行业、项目可行性研究。</p></div><button class="btn btn-w" data-contact>提交定制需求</button></div>
    </div></section>`;
    const draw = k => $("#rlist").innerHTML = D.reports.filter(r => !k || (k === "free" ? !r.p : r.k === k)).map(reportCard).join("");
    $$("[data-rk]").forEach(b => b.onclick = () => { $$("[data-rk]").forEach(x => x.classList.remove("on")); b.classList.add("on"); draw(b.dataset.rk); });
    draw("");
  }

  /* ---------- 会员 ---------- */
  function membership() {
    app.innerHTML = ph("会员服务", "会员服务", "从免费了解到全程护航，按出海阶段选择适合你的方案。") + `
    <section class="sec"><div class="wrap">
      <div class="plans">${D.plans.map(p => `<div class="card plan ${p.hot ? "hot" : ""}">${p.hot ? '<span class="rib">最受欢迎</span>' : ""}
        <h3>${p.n}</h3><p>${p.d}</p><div class="amt">${p.p}<small>${p.u}</small></div>
        <ul>${p.f.map(x => `<li>${x}</li>`).join("")}${p.x.map(x => `<li class="x">${x}</li>`).join("")}</ul>
        <button class="btn ${p.hot ? "btn-g" : p.p === "定制" ? "btn-o" : "btn-p"}" style="justify-content:center" data-plan="${p.n}">${p.cta}</button></div>`).join("")}</div>
      <p class="note">价格为建议定价，正式上线前可调整。政府、园区组织企业集体入会可享团体优惠；符合条件的企业可申请政府服务券抵扣。</p>
    </div></section>
    <section class="sec alt"><div class="wrap">
      ${sh("PAID SERVICES", "按次付费专业服务", "")}
      <div class="grid4">
        ${[["📝", "合同审阅", "¥2,000 起/份"], ["🔍", "海外企业背调", "¥1,500 起/次"], ["🛡️", "制裁与出口管制筛查", "¥800 起/次"], ["🏗️", "ODI 备案代办", "¥8,000 起"], ["®️", "海外商标注册", "¥3,000 起/国"], ["🌱", "CBAM 碳核算辅导", "¥15,000 起"], ["🧭", "国别投资咨询", "¥5,000 起"], ["✈️", "海外考察团", "按团报价"]].map(s => `<div class="card hov"><div class="ico">${s[0]}</div><h3>${s[1]}</h3><p class="price" style="font-size:15px">${s[2]}</p><button class="btn btn-o btn-sm" style="margin-top:10px" data-consult="${s[1]}">咨询</button></div>`).join("")}
      </div>
    </div></section>`;
  }

  /* ---------- 政府 · 园区 ---------- */
  function gov() {
    const X = D.dash;
    const bars = (arr, unit = "%") => { const m = Math.max(...arr.map(a => a[1])); return `<div class="bars">${arr.map(a => `<div class="b"><span>${a[0]}</span><span class="t"><i style="width:${a[1] / m * 100}%"></i></span><span class="v">${a[1]}${unit}</span></div>`).join("")}</div>`; };
    app.innerHTML = ph("政府 · 园区", "区域企业出海态势看板", "为自治区及盟市商务部门、开发区、商协会提供数据化的出海服务与决策支持工具。") + `
    <section class="sec"><div class="wrap">
      <div class="dash">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px"><b style="color:#fff;font-size:17px">📡 内蒙古企业出海态势 · 2026 Q3</b><span style="font-size:12px;color:#93acc9">演示数据 · 非真实统计</span></div>
        <div class="dg">
          ${X.kpi.map(k => `<div class="panel"><h5>${k.t}</h5><div class="big">${k.v}</div><div class="delta">${k.dl}</div></div>`).join("")}
          <div class="panel span2"><h5>需求行业分布</h5>${bars(X.byInd)}</div>
          <div class="panel span2"><h5>目标市场分布</h5>${bars(X.byReg)}</div>
          <div class="panel span2"><h5>各盟市入驻企业数</h5>${bars(X.byCity.slice(0, 7), "")}</div>
          <div class="panel span2"><h5>企业最关注问题（提及率）</h5>${bars(X.pains)}</div>
        </div>
      </div>
    </div></section>
    <section class="sec alt"><div class="wrap">
      ${sh("FOR GOVERNMENT", "为政府与园区提供的价值", "")}
      <div class="grid3">
        ${[["📊", "态势感知", "实时掌握辖区企业出海规模、目标市场、需求与痛点分布。"], ["🚨", "风险预警", "目标国政策、制裁、汇率变化定向推送至相关企业，提前防范。"], ["🎯", "精准施策", "基于真实需求数据，设计展会补贴、培训、服务券等扶持政策。"], ["🤝", "集体出海", "组织产业链抱团出海、海外考察、境外园区对接。"], ["📘", "研究支撑", "定制区域出海白皮书、国别研究与年度发展报告。"], ["🎓", "能力建设", "面向企业的合规培训、出海合规官认证与政策宣讲。"]].map(c => `<div class="card"><div class="ico">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p></div>`).join("")}
      </div>
      <div class="grid3" style="margin-top:28px">
        <div class="card"><h3>合作模式一 · 政府购买服务</h3><p>按年度为辖区企业提供平台会员、培训与咨询服务。</p></div>
        <div class="card"><h3>合作模式二 · 园区专属频道</h3><p>开设园区子站与看板，展示招商政策并服务入园企业出海。</p></div>
        <div class="card"><h3>合作模式三 · 联合研究</h3><p>共同发布年度出海报告、行业白皮书，形成区域品牌。</p></div>
      </div>
      <div class="band" style="margin-top:32px"><div><h3>预约演示</h3><p>为您的地区定制一份出海态势分析样本。</p></div><button class="btn btn-w" data-contact>预约演示</button></div>
      <p class="note">数据安全：企业数据分级授权，政府端仅展示汇总统计；正式版部署于境内合规云，按等保要求建设。</p>
    </div></section>`;
  }

  /* ---------- 出海体检 ---------- */
  function checkup() {
    const ans = {};
    app.innerHTML = ph("出海体检", "3 分钟出海风险体检", "回答 7 个问题，获取你的出海风险评分与针对性建议。") + `
    <section class="sec"><div class="wrap"><div class="quiz card" style="padding:28px">
      ${D.quiz.map((q, i) => `<div class="q"><b>${i + 1}. ${q.q}</b><div class="opts">${q.o.map((o, j) => `<button class="opt" data-q="${i}" data-j="${j}">${o}</button>`).join("")}</div></div>`).join("")}
      <button class="btn btn-p" id="qgo" style="margin-top:8px">生成体检报告</button>
      <div id="qres" style="margin-top:24px"></div>
    </div></div></section>`;
    $$(".opt").forEach(b => b.onclick = () => { $$(`.opt[data-q="${b.dataset.q}"]`).forEach(x => x.classList.remove("on")); b.classList.add("on"); ans[b.dataset.q] = +b.dataset.j; });
    $("#qgo").onclick = () => {
      if (Object.keys(ans).length < D.quiz.length) return toast("请回答全部问题");
      const max = D.quiz.reduce((s, q) => s + Math.max(...q.w), 0);
      const sc = D.quiz.reduce((s, q, i) => s + q.w[ans[i]], 0);
      const pct = Math.round(sc / max * 100);
      const lv = pct < 35 ? ["低风险", "var(--grass)", "基础较好，建议持续关注政策变化，向系统化合规升级。"] : pct < 65 ? ["中等风险", "var(--amber)", "存在若干明显短板，建议尽快补齐商标、合同与结算环节。"] : ["高风险", "var(--red)", "出海风险较高，建议在扩大业务前进行一次全面合规诊断。"];
      const rec = [];
      if (ans[2] > 0) rec.push(["ip", "目标市场商标尚未完成注册"]);
      if (ans[3] > 0) rec.push(["export", "缺少交易对手制裁与资信筛查"]);
      if (ans[4] > 0) rec.push(["invest", "海外合同未经当地律师审核"]);
      if (ans[5] > 1) rec.push(["fx", "结算方式存在回款或外汇风险"]);
      if (ans[6] > 0) rec.push(["esg", "可能涉及出口管制或 CBAM 碳关税"]);
      if (ans[0] === 3) rec.push(["odi", "已设海外实体，需核对 ODI 备案与年报"]);
      $("#qres").innerHTML = `<div style="border-top:1px solid var(--line);padding-top:22px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><h3 style="margin:0">风险评分：<span style="color:${lv[1]}">${pct}</span> / 100 · ${lv[0]}</h3></div>
        <div class="meter" style="margin:12px 0"><i style="width:${pct}%;background:${lv[1]}"></i></div><p>${lv[2]}</p>
        ${rec.length ? `<b>需要重点关注</b><div class="list" style="margin-top:10px">${rec.map(r => `<a class="row" href="#/compliance?g=${r[0]}" style="color:inherit"><div>⚠️</div><div><h4>${r[1]}</h4><p>查看「${guideName(r[0])}」指南 →</p></div></a>`).join("")}</div>` : ""}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button class="btn btn-g" data-lock="完整版出海体检报告（PDF，含 30 项细分指标）">获取完整报告</button><button class="btn btn-o" data-consult="出海体检解读">预约顾问解读</button></div></div>`;
      $("#qres").scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  }

  /* ---------- 搜索 ---------- */
  function search(qs) {
    const q = (qs.get("q") || "").trim();
    const words = q.split(/\s+/).filter(Boolean);
    const hit = s => words.length && words.some(w => s.includes(w));
    const R = [
      ...D.guides.filter(g => hit(g.n + g.s + g.who + g.items.join())).map(g => ["合规指南", g.n, g.s, "#/compliance?g=" + g.id]),
      ...D.regions.filter(r => hit(r.n + r.why + r.op.join() + r.rk.join())).map(r => ["区域情报", r.n, r.why, "#/regions"]),
      ...D.cases.filter(c => hit(c.n + c.s + c.tags.join() + c.reg + c.ind)).map(c => ["案例库", c.n, c.l, "#/cases"]),
      ...D.industries.filter(i => hit(i.n + i.tr + i.pain.join() + i.mk)).map(i => ["行业特点", i.n, i.tr, "#/status#ind"]),
      ...D.pitfalls.filter(p => hit(p.t + p.d)).map(p => ["避坑指南", "不要" + p.t, p.d, "#/pitfalls"]),
      ...D.reports.filter(r => hit(r.t + r.d)).map(r => ["调研报告", r.t, r.d, "#/reports"])
    ];
    app.innerHTML = ph("搜索", `搜索：${esc(q) || "全部"}`, `共找到 ${R.length} 条相关内容`) + `<section class="sec"><div class="wrap"><div class="list">
      ${R.map(r => `<a class="row" href="${r[3]}" style="color:inherit"><div class="date"><span class="tag b">${r[0]}</span></div><div><h4>${r[1]}</h4><p>${r[2]}</p></div></a>`).join("") || `<div class="empty">没有找到相关内容，试试 <a href="#/demand?post=1">发布需求</a> 让顾问帮你解答</div>`}
    </div></div></section>`;
  }

  /* ---------- 弹窗与交互 ---------- */
  function modal(html) { $("#mbody").innerHTML = html; $("#mask").classList.add("on"); }
  function closeModal() { $("#mask").classList.remove("on"); }
  let tt; function toast(s) { const t = $("#toast"); t.textContent = s; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2200); }

  const leadForm = (title, sub, extra = "") => `<h3>${title}</h3><p class="muted">${sub}</p>
    <form class="form" data-lead style="margin-top:16px">${extra}
      <div><label>姓名 *</label><input name="name" required></div><div><label>手机 *</label><input name="tel" required pattern="[0-9+\\- ]{7,20}"></div>
      <div class="full"><label>单位名称 *</label><input name="org" required></div>
      <div class="full"><label>说明</label><textarea name="msg" style="min-height:80px"></textarea></div>
      <div class="full"><button class="btn btn-p" style="width:100%;justify-content:center">提交</button></div></form>
    <p class="note">原型演示：提交后仅保存在本机浏览器，正式版接入 CRM 与短信通知。</p>`;

  function openJoin() { modal(leadForm("服务商入驻申请", "律师事务所、会计师事务所、认证机构、物流与咨询机构均可申请。", `<div class="full"><label>机构类型</label><select name="type"><option>律师事务所</option><option>财税机构</option><option>认证机构</option><option>物流服务商</option><option>咨询机构</option></select></div><div class="full"><label>服务国家/地区</label><input name="area" placeholder="如：蒙古国、哈萨克斯坦"></div>`)); }

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-connect],[data-team],[data-partner],[data-lock],[data-report],[data-consult],[data-contact],[data-plan],[data-join],[data-match],[data-subscribe],[data-close]");
    if (!t) { if (e.target === $("#mask")) closeModal(); return; }
    const d = t.dataset;
    if ("close" in d) return closeModal();
    if ("lock" in d) return modal(`<div class="ico" style="background:#2a1d00;color:#f3d98a">🔒</div><h3>${d.lock}</h3><p class="muted">该内容为会员专享。开通企业会员即可解锁全部深度内容、国别情报与商机联系方式。</p>
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><a class="btn btn-g" href="#/membership">查看会员方案</a><button class="btn btn-o" data-plan="试用">申请 7 天免费试用</button></div>`);
    if ("report" in d) return +d.price ? modal(`<h3>${d.report}</h3><p class="muted">单篇购买 <b class="price">¥${(+d.price).toLocaleString()}</b>，或开通会员免费阅读。</p>
      <div class="grid2" style="margin-top:16px"><button class="btn btn-p" style="justify-content:center" data-plan="购买报告">单篇购买</button><a class="btn btn-g" style="justify-content:center" href="#/membership">开通会员</a></div><p class="note">原型演示：支付功能将在正式版接入微信支付 / 对公转账。</p>`)
      : modal(leadForm("免费下载：" + d.report, "留下联系方式，报告将发送至您的手机/邮箱。"));
    if ("consult" in d) return modal(leadForm("预约：" + d.consult, "平台顾问将在 1 个工作日内与您确认需求与时间。"));
    if ("contact" in d) return modal(leadForm("联系我们", "政府合作、媒体、投稿、定制研究等事宜。"));
    if ("plan" in d) return modal(leadForm(d.plan === "试用" ? "申请 7 天免费试用" : "开通：" + d.plan, "顾问将与您联系，确认方案并开具发票。"));
    if ("join" in d) return openJoin();
    if ("connect" in d) return modal(leadForm("🌐 一键联通全球合伙人", "告诉我们你要去哪里、要解决什么。赵云涛律师团队统筹，对应国家合伙人与专项合伙人 1 个工作日内响应。",
      `<div><label>目标国家/地区</label><select name="area">${D.regions.map(r => `<option>${r.n}</option>`).join("")}<option>其他国家</option></select></div>
       <div><label>所属行业</label><select name="ind">${D.industries.map(i => `<option>${i.n}</option>`).join("")}</select></div>
       <div class="full"><label>需要什么（可多选）</label><div class="opts">${["海外法律保障", "找客户/渠道", "上下游对接", "投资设厂落地", "合同与争议", "海外考察"].map(x => `<label class="opt" style="font-weight:400"><input type="checkbox" name="need" value="${x}" style="width:auto;margin-right:4px">${x}</label>`).join("")}</div></div>`));
    if ("team" in d) return modal(`<h3>赵云涛律师团队</h3><p class="muted">统筹法律先生全球合伙人体系，服务内蒙古企业出海。</p><p class="pending">团队简介、执业背景、代表业绩与团队成员待补充。</p><button class="btn btn-g" data-connect style="margin-top:12px">🌐 一键联通</button>`);
    if ("partner" in d) return modal(leadForm("申请内蒙古城市合伙人", "全球席位制，每个盟市限额招募。提交后法律先生团队将与您双向沟通。", `<div class="full"><label>意向盟市</label><select name="city">${D.dash.byCity.map(c => `<option>${c[0]}</option>`).join("")}</select></div>`));
    if ("match" in d) return modal(leadForm("我能对接：" + d.match, "说明您能提供的资源或服务，平台将协助双方建立联系。"));
    if ("subscribe" in d) return modal(leadForm("订阅定向推送", "选择关注的国家与行业。", `<div class="full"><label>关注国家/地区</label><input name="area" placeholder="如：蒙古国、沙特"></div>`));
  });
  document.addEventListener("submit", e => {
    if (!e.target.matches("[data-lead]")) return;
    e.preventDefault(); const leads = store.get("leads", []); leads.push({ ...Object.fromEntries(new FormData(e.target)), at: Date.now() }); store.set("leads", leads);
    closeModal(); toast("✅ 提交成功，我们会尽快与您联系");
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  $("#burger").onclick = () => $("#nav").classList.toggle("open");

  /* ---------- 路由 ---------- */
  const routes = { "": home, global, status, cases, compliance, pitfalls, regions, opps, experts, demand, reports, membership, gov, checkup, search };
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [pathAnchor, query = ""] = h.split("?");
    const [path, anchor] = pathAnchor.split("#");
    (routes[path] || home)(new URLSearchParams(query));
    $$("#nav a").forEach(a => a.classList.toggle("on", path && a.getAttribute("href").replace(/[?#].*$/, "").replace(/^#\//, "").split("#")[0] === path));
    $("#nav").classList.remove("open"); closeModal();
    if (anchor) setTimeout(() => { const el = document.getElementById(anchor); el && el.scrollIntoView({ behavior: "smooth" }); }, 30);
    else window.scrollTo(0, 0);
    const titles = { global: "全球合伙人", status: "出海现状", cases: "案例库", compliance: "合规指南", pitfalls: "避坑指南", regions: "区域情报", opps: "政策与商机", experts: "律师团队", demand: "需求广场", reports: "调研报告", membership: "会员服务", gov: "政府 · 园区", checkup: "出海体检", search: "搜索" };
    document.title = (titles[path] ? titles[path] + " · " : "") + "内蒙古企业出海一站通";
  }
  addEventListener("hashchange", route);
  route();
})();
