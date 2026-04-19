import{a as z}from"./chunk-CVLK7RPG.js";import"./chunk-XP446ZIN.js";import{a as F}from"./chunk-HLL5CXTJ.js";import"./chunk-TTDRWEXC.js";import{a as D}from"./chunk-GWO5HBMJ.js";import"./chunk-WAEC3TNC.js";import{$ as r,Da as P,Ea as I,Fa as $,Ia as R,Ma as A,O as n,Oa as T,R as m,S as _,W as v,_ as c,aa as i,ba as f,fa as x,ga as g,ha as h,ja as y,ka as a,la as p,ma as l,na as S,oa as k,ta as C,ua as E}from"./chunk-TFLBXWZK.js";function N(s,t){if(s&1&&(r(0,"div",26)(1,"span",27),a(2),i(),r(3,"span",28),a(4),i()()),s&2){let e=g();n(2),l("+",e.bonusPoints," difficulty bonus"),n(2),l("= ",e.score," total pts")}}function j(s,t){if(s&1&&(r(0,"div",29)(1,"span",30),a(2),i()()),s&2){let e=g();n(2),l("",e.score," points earned")}}function L(s,t){if(s&1&&(r(0,"div",35)(1,"div",36)(2,"span",37),a(3),i(),r(4,"span",38),a(5),i()(),r(6,"div",39),f(7,"div",40),i()()),s&2){let e=t.$implicit,o=g(2);n(3),p(e.category),n(2),k("",e.correct,"/",e.total," \xB7 ",e.percentage,"%"),n(2),y(o.getCategoryColor(e)),h("width",e.percentage,"%")}}function U(s,t){if(s&1&&(r(0,"div",31)(1,"h3",32),a(2,"Performance by Category"),i(),r(3,"div",33),v(4,L,8,8,"div",34),i()()),s&2){let e=g();n(4),c("ngForOf",e.categoryScores)}}function H(s,t){if(s&1&&(r(0,"div",41)(1,"div",42)(2,"span",43),a(3,"\u{1F3AF}"),i(),r(4,"div")(5,"p",44),a(6),C(7,"titlecase"),i(),r(8,"p",45),a(9),i()()()()),s&2){let e=g();n(6),l("Focus Area: ",E(7,3,e.weakestArea.category)),n(3),S(" You scored ",e.weakestArea.percentage,"% in this category. Practice more ",e.weakestArea.category," scenarios to strengthen this skill. ")}}function G(s,t){if(s&1&&(r(0,"div",48)(1,"span",49),a(2),i(),r(3,"div")(4,"p",50),a(5),i(),r(6,"p",28),a(7),i()()()),s&2){let e=t.$implicit;n(2),p(e.icon),n(3),p(e.label),n(2),p(e.description)}}function Y(s,t){if(s&1&&(r(0,"div",31)(1,"h3",32),a(2,"\u{1F3C6} Badges Earned"),i(),r(3,"div",46),v(4,G,8,3,"div",47),i()()),s&2){let e=g();n(4),c("ngForOf",e.newBadges)}}var M=class s{constructor(t,e,o,b,w){this.route=t;this.router=e;this.progressService=o;this.authService=b;this.firestoreService=w}mode="";score=0;baseScore=0;total=0;correct=0;streak=0;multiplier=1;bonusPoints=0;percentage=0;grade={label:"",color:"",bg:""};categoryScores=[];newBadges=[];weakestArea=null;modeLabels={"phishing-sim":"\u{1F3A3} Phishing Simulation","social-eng-quiz":"\u{1F9E0} Social Engineering Quiz"};async ngOnInit(){let t=this.route.snapshot.queryParamMap;this.mode=t.get("mode")??"",this.score=Number(t.get("score"))||0,this.baseScore=Number(t.get("baseScore"))||0,this.total=Number(t.get("total"))||0,this.correct=Number(t.get("correct"))||0,this.streak=Number(t.get("streak"))||0,this.multiplier=Number(t.get("multiplier"))||1,this.baseScore||(this.baseScore=this.multiplier>1?Math.round(this.score/this.multiplier):this.score),this.bonusPoints=Math.max(0,this.score-this.baseScore),this.percentage=this.total>0?Math.min(100,Math.round(this.baseScore/this.total*100)):0,this.grade=this.getGrade(this.percentage);let e=this.progressService.getUserProgress();this.categoryScores=e.categoryScores,this.newBadges=this.progressService.getEarnedBadges().slice(-3),this.weakestArea=this.progressService.getWeakestCategory(),await this.syncToFirebase(e)}async syncToFirebase(t){let e=this.authService.currentUser();if(e)try{await this.firestoreService.saveProgress(e.uid,t),await this.firestoreService.saveLeaderboardEntry(e.uid,{displayName:this.authService.userDisplayName,photoURL:this.authService.userPhotoURL,totalPoints:t.totalPoints,accuracy:this.progressService.getAccuracyPercentage(),sessions:t.totalSessions})}catch(o){console.error("Firebase sync failed:",o)}}getGrade(t){return t>=90?{label:"Outstanding",color:"text-cyber-green",bg:"bg-cyber-green"}:t>=75?{label:"Proficient",color:"text-cyber-accent",bg:"bg-cyber-accent"}:t>=60?{label:"Developing",color:"text-cyber-yellow",bg:"bg-cyber-yellow"}:t>=40?{label:"Needs Work",color:"text-cyber-red",bg:"bg-cyber-red"}:{label:"Keep Practicing",color:"text-cyber-red",bg:"bg-cyber-red"}}getModeLabel(){return this.modeLabels[this.mode]??this.mode}getCategoryColor(t){return t.percentage>=75?"bg-cyber-green":t.percentage>=50?"bg-cyber-yellow":"bg-cyber-red"}playAgain(){this.router.navigate([`/${this.mode}`])}goHome(){this.router.navigate(["/"])}goToDashboard(){this.router.navigate(["/dashboard"])}exportPDF(){let t=this.progressService.getUserProgress(),e=this.progressService.getEarnedBadges(),o=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),b=this.grade.bg.replace("bg-cyber-green","#00ff88").replace("bg-cyber-accent","#00d4ff").replace("bg-cyber-yellow","#ffd700").replace("bg-cyber-red","#ff4d6d"),w=t.categoryScores.length?`
      <div class="section">
        <h2>Category Breakdown</h2>
        ${t.categoryScores.map(d=>`
          <div class="bar-row">
            <div class="bar-label">
              <span style="text-transform:capitalize">${d.category}</span>
              <span>${d.correct}/${d.total} \xB7 ${d.percentage}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${d.percentage}%;background:${d.percentage>=75?"#00ff88":d.percentage>=50?"#ffd700":"#ff4d6d"}"></div>
            </div>
          </div>
        `).join("")}
      </div>`:"",B=e.length?`
      <div class="section">
        <h2>Badges Earned (${e.length})</h2>
        <div class="badge-grid">
          ${e.map(d=>`
            <div class="badge-item">
              <div class="badge-icon">${d.icon}</div>
              <div>
                <div class="badge-name">${d.label}</div>
                <div class="badge-desc">${d.description}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>`:"",O=`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CyberSense Training Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #1a1a2e; padding: 40px; }
    .header { background: #0a0e1a; color: white; padding: 30px; margin: -40px -40px 30px; }
    .header h1 { font-size: 28px; letter-spacing: 4px; color: #00d4ff; }
    .header p { color: #8892a4; margin-top: 6px; font-size: 13px; }
    .grade-badge { display: inline-block; background: ${b}; color: #0a0e1a; padding: 6px 20px; border-radius: 20px; font-weight: bold; font-size: 18px; margin: 20px 0; }
    .section { margin-bottom: 28px; }
    .section h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00d4ff; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 16px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .stat-box { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 14px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #00d4ff; }
    .stat-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .bar-row { margin-bottom: 10px; }
    .bar-label { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
    .bar-track { background: #e0e0e0; border-radius: 4px; height: 8px; }
    .bar-fill { height: 8px; border-radius: 4px; }
    .badge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .badge-item { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 10px; }
    .badge-icon { font-size: 24px; }
    .badge-name { font-weight: bold; font-size: 13px; }
    .badge-desc { font-size: 11px; color: #666; margin-top: 2px; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 16px; }
    .score-bar-track { background: #e0e0e0; border-radius: 6px; height: 12px; margin: 8px 0; }
    .score-bar-fill { height: 12px; border-radius: 6px; background: #00d4ff; }
  </style>
</head>
<body>
  <div class="header">
    <h1>CYBERSENSE</h1>
    <p>Security Awareness Training Report \xB7 Generated ${o}</p>
  </div>
  <div class="section">
    <h2>Session Summary</h2>
    <p style="font-size:13px;color:#666;margin-bottom:12px;">Mode: ${this.getModeLabel()}</p>
    <div class="grade-badge">${this.grade.label}</div>
    <div class="score-bar-track">
      <div class="score-bar-fill" style="width:${this.percentage}%"></div>
    </div>
    <p style="font-size:13px;color:#666;">${this.baseScore} base pts + ${this.bonusPoints} bonus = ${this.score} total (${this.percentage}%)</p>
  </div>
  <div class="section">
    <h2>Performance Metrics</h2>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-value" style="color:#00ff88">${t.totalSessions}</div><div class="stat-label">Sessions</div></div>
      <div class="stat-box"><div class="stat-value">${t.totalPoints}</div><div class="stat-label">Total Points</div></div>
      <div class="stat-box"><div class="stat-value" style="color:#00ff88">${t.totalCorrect}</div><div class="stat-label">Correct Answers</div></div>
      <div class="stat-box"><div class="stat-value" style="color:#ffd700">${this.progressService.getAccuracyPercentage()}%</div><div class="stat-label">Overall Accuracy</div></div>
    </div>
  </div>
  ${w}
  ${B}
  <div class="footer">CyberSense Trainer \xB7 Security Awareness Training \xB7 ${o}</div>
</body>
</html>`,u=window.open("","_blank");u&&(u.document.write(O),u.document.close(),setTimeout(()=>u.print(),500))}static \u0275fac=function(e){return new(e||s)(m(A),m(T),m(z),m(D),m(F))};static \u0275cmp=_({type:s,selectors:[["app-results"]],decls:53,vars:20,consts:[[1,"min-h-screen","bg-cyber-dark","text-white","page-enter"],[1,"fixed","inset-0","pointer-events-none","z-0"],[1,"grid-bg"],[1,"relative","z-10","max-w-3xl","mx-auto","px-6","py-12"],[1,"text-center","mb-10"],[1,"text-cyber-muted","text-sm","uppercase","tracking-widest","mb-2"],[1,"text-5xl","font-bold","mb-4"],[1,"card","text-center","mb-6"],[1,"text-7xl","font-bold","text-cyber-accent","mb-1"],[1,"text-cyber-muted","mb-1"],["class","inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-yellow bg-opacity-10 border border-cyber-yellow border-opacity-30 mb-4",4,"ngIf"],["class","mb-4",4,"ngIf"],[1,"h-4","bg-cyber-border","rounded-full","overflow-hidden","mb-2"],[1,"h-full","rounded-full","transition-all","duration-1000"],[1,"flex","justify-between","text-xs","text-cyber-muted"],[1,"grid","grid-cols-3","gap-4","mb-6"],[1,"card","text-center","py-5"],[1,"text-3xl","font-bold","text-cyber-green"],[1,"text-cyber-muted","text-xs","mt-1","uppercase","tracking-wider"],[1,"text-3xl","font-bold","text-cyber-accent"],[1,"text-3xl","font-bold","text-cyber-yellow"],["class","card mb-6",4,"ngIf"],["class","weak-area-card mb-6",4,"ngIf"],[1,"flex","flex-col","sm:flex-row","gap-4","justify-center"],[1,"btn-secondary",3,"click"],[1,"btn-primary",3,"click"],[1,"inline-flex","items-center","gap-2","px-3","py-1","rounded-full","bg-cyber-yellow","bg-opacity-10","border","border-cyber-yellow","border-opacity-30","mb-4"],[1,"text-cyber-yellow","text-sm","font-bold"],[1,"text-cyber-muted","text-xs"],[1,"mb-4"],[1,"text-cyber-muted","text-sm"],[1,"card","mb-6"],[1,"font-bold","text-white","mb-4"],[1,"space-y-3"],["class","category-row",4,"ngFor","ngForOf"],[1,"category-row"],[1,"flex","justify-between","items-center","mb-1"],[1,"text-sm","capitalize"],[1,"text-xs","text-cyber-muted"],[1,"h-2","bg-cyber-border","rounded-full","overflow-hidden"],[1,"h-full","rounded-full","transition-all","duration-700"],[1,"weak-area-card","mb-6"],[1,"flex","items-start","gap-3"],[1,"text-2xl"],[1,"font-bold","text-cyber-yellow","mb-1"],[1,"text-sm","text-cyber-muted"],[1,"flex","flex-wrap","gap-3"],["class","badge-card",4,"ngFor","ngForOf"],[1,"badge-card"],[1,"text-3xl"],[1,"font-bold","text-sm"]],template:function(e,o){e&1&&(r(0,"div",0)(1,"div",1),f(2,"div",2),i(),r(3,"div",3)(4,"div",4)(5,"p",5),a(6),i(),r(7,"h1",6),a(8,"Session Results"),i(),r(9,"div"),a(10),i()(),r(11,"div",7)(12,"div",8),a(13),i(),r(14,"p",9),a(15),i(),v(16,N,5,2,"div",10)(17,j,3,1,"div",11),r(18,"div",12),f(19,"div",13),i(),r(20,"div",14)(21,"span"),a(22,"0"),i(),r(23,"span"),a(24),i()()(),r(25,"div",15)(26,"div",16)(27,"p",17),a(28),i(),r(29,"p",18),a(30,"Correct"),i()(),r(31,"div",16)(32,"p",19),a(33),i(),r(34,"p",18),a(35,"Points Earned"),i()(),r(36,"div",16)(37,"p",20),a(38),i(),r(39,"p",18),a(40,"Best Streak"),i()()(),v(41,U,5,1,"div",21)(42,H,10,5,"div",22)(43,Y,5,1,"div",21),r(44,"div",23)(45,"button",24),x("click",function(){return o.goHome()}),a(46,"\u2190 Home"),i(),r(47,"button",25),x("click",function(){return o.playAgain()}),a(48,"Play Again \u2192"),i(),r(49,"button",24),x("click",function(){return o.goToDashboard()}),a(50,"Dashboard \u2192"),i(),r(51,"button",24),x("click",function(){return o.exportPDF()}),a(52,"\u{1F4C4} Export PDF"),i()()()()),e&2&&(n(6),l(" ",o.getModeLabel()," "),n(3),y("inline-block px-6 py-2 rounded-full text-cyber-dark font-bold text-xl "+o.grade.bg),n(),l(" ",o.grade.label," "),n(3),l("",o.percentage,"%"),n(2),S(" ",o.baseScore," / ",o.total," base points "),n(),c("ngIf",o.bonusPoints>0),n(),c("ngIf",o.bonusPoints===0),n(2),y(o.grade.bg),h("width",o.percentage,"%"),n(5),l("",o.total," base pts"),n(4),p(o.correct),n(5),p(o.score),n(5),p(o.streak),n(3),c("ngIf",o.categoryScores.length>0),n(),c("ngIf",o.weakestArea&&o.weakestArea.percentage<75),n(),c("ngIf",o.newBadges.length>0))},dependencies:[R,P,I,$],styles:[".grid-bg[_ngcontent-%COMP%]{width:100%;height:100%;background-image:linear-gradient(rgba(0,212,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.03) 1px,transparent 1px);background-size:50px 50px}.category-row[_ngcontent-%COMP%]{border-radius:.5rem;border-width:1px;--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(6 9 16 / var(--tw-bg-opacity, 1));padding:.75rem}.weak-area-card[_ngcontent-%COMP%]{border-radius:.75rem;border-width:1px;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity, 1));padding:1.5rem;--tw-border-opacity: 1;border-color:rgb(255 215 0 / var(--tw-border-opacity, 1));border-color:#ffd7004d;background:#ffd7000d}.badge-card[_ngcontent-%COMP%]{display:flex;min-width:200px;flex:1 1 0%;align-items:center;gap:.75rem;border-radius:.5rem;border-width:1px;--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(6 9 16 / var(--tw-bg-opacity, 1));padding:.75rem}"]})};export{M as ResultsComponent};
