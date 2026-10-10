/* 自动更新数据源：风险预警 + 最新真实案例
 * 由定时任务「出海一站通·每3天更新」维护：每条必须有可访问的来源链接，摘要用自己的话改写，不照搬原文。
 * 字段：alerts[].lv = red(紧急) | orange(重要) | yellow(关注) | info(机遇/提示)；due = 截止/生效日（可空）
 */
window.FEED = {
  updated: "2026-10-10",
  alerts: [
    { id: "a-20261110-us-cn", d: "2026-10-10", due: "2026-11-10", lv: "red", r: "中国 · 美国", ind: ["稀土与新材料", "冶金与能源化工"], cat: "出口管制",
      t: "中美多项「暂停一年」安排将于 11 月上旬集中到期",
      s: "商务部、海关总署 2025 年第 70 号公告将第 61、62 号等稀土及相关技术出口管制公告暂停至 2026 年 11 月 10 日；美方 BIS「关联方 50% 规则」暂停至 11 月 9 日，部分 301 关税排除同样到期。到期后是否延长尚无官方消息。",
      act: "稀土、新材料及对美业务企业立即梳理在手订单与许可状态，按「恢复实施」情景准备许可申请与客户沟通预案。",
      src: "财联社 / Arnold & Porter", url: "https://www.cls.cn/detail/2197634",
      more: [["BIS 暂停关联方规则", "https://www.arnoldporter.com/en/perspectives/blogs/enforcement-edge/2025/11/doc-suspends-enforcement-of-the-affiliates-rule-for-one-year"]] },
    { id: "a-20261017-id-halal", d: "2026-10-10", due: "2026-10-17", lv: "red", r: "印度尼西亚", ind: ["乳业与食品", "农牧产品"], cat: "市场准入",
      t: "印尼进口食品饮料强制清真认证 10 月 17 日到期",
      s: "根据印尼 2024 年第 42 号政府条例，进口食品、饮料及屠宰产品须在 2026 年 10 月 17 日前完成清真认证，未认证产品须标注非清真；肉类、乳制品另有专门要求。外国企业须经印尼当地代表申请，可走境外清真证书登记（SHLN）通道。",
      act: "对印尼出口乳品、肉类、食品的企业立即核对认证与标签状态，联系当地进口商确认清关安排。",
      src: "USDA FAS", url: "https://www.fas.usda.gov/data/indonesia-indonesia-confirms-extension-mandatory-halal-certification-imported-food-and" },
    { id: "a-20261005-cbam-q3", d: "2026-10-05", due: "2027-09-30", lv: "orange", r: "欧盟", ind: ["冶金与能源化工"], cat: "碳关税",
      t: "欧盟公布 CBAM 第三季度证书价格 €82.32/吨，较前两季上涨",
      s: "适用于 2026 年 7–9 月进口的钢铁、铝、水泥、化肥、电力和氢。证书自 2027 年 2 月起在中央平台购买，2026 年进口的年度申报与清缴截止为 2027 年 9 月 30 日；欧洲议会 9 月支持将范围扩展至钢铁下游制品。",
      act: "钢铝及化工出口企业尽快提供经核查的实测排放数据，避免进口商按默认值加成计费而转单。",
      src: "European Commission / CBAM Guide", url: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/price-cbam-certificates_en",
      more: [["Q3 价格解读", "https://cbamguide.com/news/2026-10-05-q3-2026-cbam-certificate-price/"]] },
    { id: "a-202606-eu-ru", d: "2026-06-15", lv: "orange", r: "欧盟 · 俄罗斯", ind: ["跨境物流与口岸经济", "新能源装备"], cat: "制裁",
      t: "欧盟对俄制裁持续点名中国企业，第 21 轮方案正在磋商",
      s: "欧盟第 20 轮对俄制裁将多家中国企业列入清单，6 月 15 日又通过一份「迷你」制裁包新增实体；委员会 6 月 9 日提出的第 21 轮方案仍在成员国间讨论。",
      act: "对俄贸易与过境物流企业逐单筛查交易对手、银行与船东；涉及欧盟客户的，提前评估次级制裁风险。",
      src: "Mayer Brown", url: "https://www.mayerbrown.com/de/insights/publications/2026/06/eu-adopts-mini-sanctions-package-against-russia" },
    { id: "a-20260724-us301", d: "2026-07-24", lv: "yellow", r: "美国", ind: ["羊绒与纺织", "稀土与新材料", "新能源装备"], cat: "关税",
      t: "美国对中国内地及香港商品加征 12.5% 的新 301 关税",
      s: "美国贸易代表办公室 7 月 23 日公告，对 60 个经济体分别加征 10% 或 12.5% 关税，中国内地与香港适用 12.5%，7 月 24 日生效；2018 年起的原 301 关税继续有效。",
      act: "对美出口企业重新核算到岸成本，评估第三国产能与原产地规则，避免「转口」被认定规避。",
      src: "香港工业贸易署", url: "https://www.tid.gov.hk/en/tradecircular/2026/ci6552026.html" },
    { id: "a-2026-ru-util", d: "2026-04-01", lv: "yellow", r: "俄罗斯", ind: ["跨境物流与口岸经济"], cat: "关税",
      t: "俄罗斯汽车报废税逐年上调，并收紧经欧亚经济联盟转口渠道",
      s: "俄罗斯报废税自 2026 年起按功率分档并每年指数化上调至 2030 年，同时推进堵住经白俄罗斯、哈萨克斯坦、吉尔吉斯斯坦转口规避关税的做法，纯进口整车空间被进一步压缩。",
      act: "汽车及零部件出口与物流企业评估在俄本地组装或零部件供货模式，谨慎对待转口方案。",
      src: "The Times of Central Asia", url: "https://timesca.com/kyrgyz-re-exporters-of-chinese-cars-will-soon-pay-higher-duties/" },
    { id: "a-2026-mn-minerals", d: "2026-09-01", lv: "yellow", r: "蒙古国", ind: ["冶金与能源化工", "新能源装备"], cat: "投资政策",
      t: "蒙古国矿产法修正案提交议会，拟引入大面积勘探合同框架",
      s: "修正案拟允许单一投资者在两年内取得最多 15 万公顷的独家勘探权，同时提高国家收益分成。法案目前处于审议阶段，最终文本与生效时间待确认。",
      act: "拟赴蒙从事矿业及配套的企业密切跟踪立法进展，投资架构杜绝代持，交易文件预留政策变化条款。",
      src: "Mongolia Weekly", url: "https://www.mongoliaweekly.org/post/why-the-2026-mongolia-minerals-law-is-a-mixed-bag-for-investors" },
    { id: "a-20260412-nm-ftz", d: "2026-04-12", lv: "info", r: "内蒙古", ind: ["跨境物流与口岸经济"], cat: "政策机遇",
      t: "中国（内蒙古）自由贸易试验区总体方案印发",
      s: "方案将内蒙古定位为我国向北开放的重要桥头堡，叠加六大跨境电商综试区与陆路口岸优势，为企业对蒙、对俄及向西开放带来制度红利。",
      act: "关注自贸区首批制度创新清单与配套政策申报窗口。",
      src: "新华网", url: "https://www.news.cn/fortune/20260412/32df771127694122b919ae49171802d7/c.html" }
  ],
  cases: [
    { id: "c-cietac-saudi", d: "2025-10", ok: true, n: "中国企业在沙特法院执行 CIETAC 仲裁裁决，收回约 4660 万元", ind: "工程与贸易", reg: "沙特", s: "企业依据《纽约公约》向沙特法院申请承认与执行中国国际经济贸易仲裁委员会裁决，最终收回本金、损失及仲裁费用约 2454 万里亚尔。", l: "合同约定国际仲裁 + 《纽约公约》，让「赢了官司拿得到钱」成为可能。", tags: ["仲裁执行", "纽约公约"], src: "德恒律师事务所", url: "https://www.dehenglaw.com/EN/newscontent/0006/035215/2.aspx?MID=0876" },
    { id: "c-afsl-first", d: "2025", ok: true, n: "首例依据《反外国制裁法》提起的侵权诉讼：39 天调解全额回款", ind: "国际贸易", reg: "中国", s: "一家被第三国列入制裁名单的中国企业，因交易对手以制裁为由拒付货款，依据《反外国制裁法》在国内起诉，法院受理后 39 天内调解结案并全额付款。", l: "遭遇「以制裁为由」违约时，国内法律工具已经可用。", tags: ["反外国制裁法", "回款"], src: "China Justice Observer", url: "https://www.chinajusticeobserver.com/a/first-tort-suit-under-china%E2%80%99s-anti-foreign-sanctions-law" },
    { id: "c-bank-209m", d: "2026-02", ok: false, n: "2.09 亿美元仲裁裁决未获履行，中资银行赴美申请冻结资产", ind: "金融", reg: "美国", s: "借款企业违约后，相关商人长期不履行约 2.09 亿美元仲裁裁决并转移至海外，中资银行不得不在美国加州联邦法院申请资产冻结。", l: "跨境授信与交易须提前锁定担保与可执行财产所在地，否则胜诉后追偿漫长。", tags: ["跨境执行", "资产冻结"], src: "Law360", url: "https://www.law360.com/articles/2440304" },
    { id: "c-ck-panama", d: "2026-02", ok: false, n: "港口特许权被东道国取消，港资集团提起 20 亿美元 ICC 仲裁", ind: "基础设施", reg: "巴拿马", s: "长和集团旗下公司在巴拿马的港口特许经营权被取消，随即提起约 20 亿美元的国际商会仲裁索赔。", l: "特许经营类投资面临东道国政策与地缘风险，投资保护协定与仲裁条款是最后防线。", tags: ["东道国风险", "ICC 仲裁"], src: "Global Arbitration Review", url: "https://globalarbitrationreview.com/regions/china?page=1" },
    { id: "c-petrochina-ca", d: "2026-01", ok: false, n: "中石油加拿大管道收购纠纷：法院拒发禁令，须回到仲裁解决", ind: "能源", reg: "加拿大", s: "中石油请求加拿大法院阻止一项管道设施收购协议到期，法院以争议应在待决仲裁中解决为由拒绝。", l: "合资协议中的期限与争议解决安排须提前筹划，临时救济并不总能拿到。", tags: ["合资纠纷", "临时措施"], src: "Global Arbitration Review", url: "https://globalarbitrationreview.com/regions/china?page=1" },
    { id: "c-eu-yangjie", d: "2026-04", ok: false, n: "国内芯片企业被列入欧盟对俄制裁清单，欧洲合作方只能限期清理交易", ind: "电子元器件", reg: "欧盟", s: "欧盟第 20 轮对俄制裁将扬州扬杰电子科技列入清单，6 月的后续方案仅给予欧洲企业有限的过渡授权以清理既有交易。", l: "涉俄业务的合规风险会传导至全球客户，制裁筛查须覆盖下游最终用户。", tags: ["对俄制裁", "客户流失"], src: "Mayer Brown", url: "https://www.mayerbrown.com/de/insights/publications/2026/06/eu-adopts-mini-sanctions-package-against-russia" }
  ]
};
