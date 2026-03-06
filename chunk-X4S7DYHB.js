import{a as D,b as T}from"./chunk-PNMQLERL.js";import{a as z}from"./chunk-KY4AMF2S.js";import"./chunk-AR67FC2M.js";import{a as F}from"./chunk-6OBAOGK4.js";import"./chunk-G56U33VL.js";import{Ba as $,Fa as R,Ha as A,M as n,O as m,P as w,T as v,V as c,W as r,X as i,Y as f,aa as x,ba as g,ca as h,ea as y,fa as o,ga as p,ha as l,ia as S,ja as _,oa as C,pa as k,xa as E,ya as P,za as I}from"./chunk-TLI6RBTH.js";function B(s,e){if(s&1&&(r(0,"div",26)(1,"span",27),o(2),i(),r(3,"span",28),o(4),i()()),s&2){let t=g();n(2),l("+",t.bonusPoints," difficulty bonus"),n(2),l("= ",t.score," total pts")}}function O(s,e){if(s&1&&(r(0,"div",29)(1,"span",30),o(2),i()()),s&2){let t=g();n(2),l("",t.score," points earned")}}function N(s,e){if(s&1&&(r(0,"div",35)(1,"div",36)(2,"span",37),o(3),i(),r(4,"span",38),o(5),i()(),r(6,"div",39),f(7,"div",40),i()()),s&2){let t=e.$implicit,a=g(2);n(3),p(t.category),n(2),_("",t.correct,"/",t.total," \xB7 ",t.percentage,"%"),n(2),y(a.getCategoryColor(t)),h("width",a.getCategoryBarWidth(t),"%")}}function j(s,e){if(s&1&&(r(0,"div",31)(1,"h3",32),o(2,"Performance by Category"),i(),r(3,"div",33),v(4,N,8,8,"div",34),i()()),s&2){let t=g();n(4),c("ngForOf",t.categoryScores)}}function L(s,e){if(s&1&&(r(0,"div",41)(1,"div",42)(2,"span",43),o(3,"\u{1F3AF}"),i(),r(4,"div")(5,"p",44),o(6),C(7,"titlecase"),i(),r(8,"p",45),o(9),i()()()()),s&2){let t=g();n(6),l("Focus Area: ",k(7,3,t.weakestArea.category)),n(3),S(" You scored ",t.weakestArea.percentage,"% in this category. Practice more ",t.weakestArea.category," scenarios to strengthen this skill. ")}}function U(s,e){if(s&1&&(r(0,"div",48)(1,"span",49),o(2),i(),r(3,"div")(4,"p",50),o(5),i(),r(6,"p",28),o(7),i()()()),s&2){let t=e.$implicit;n(2),p(t.icon),n(3),p(t.label),n(2),p(t.description)}}function G(s,e){if(s&1&&(r(0,"div",31)(1,"h3",32),o(2,"\u{1F3C6} Badges Earned"),i(),r(3,"div",46),v(4,U,8,3,"div",47),i()()),s&2){let t=g();n(4),c("ngForOf",t.newBadges)}}var M=class s{constructor(e,t,a,b,u){this.route=e;this.router=t;this.progressService=a;this.authService=b;this.firestoreService=u}mode="";score=0;baseScore=0;total=0;correct=0;streak=0;multiplier=1;bonusPoints=0;percentage=0;grade={label:"",color:"",bg:""};categoryScores=[];newBadges=[];weakestArea=null;modeLabels={"phishing-sim":"\u{1F3A3} Phishing Simulation","social-eng-quiz":"\u{1F9E0} Social Engineering Quiz"};async ngOnInit(){let e=this.route.snapshot.queryParamMap;this.mode=e.get("mode")??"",this.score=Number(e.get("score"))||0,this.baseScore=Number(e.get("baseScore"))||0,this.total=Number(e.get("total"))||0,this.correct=Number(e.get("correct"))||0,this.streak=Number(e.get("streak"))||0,this.multiplier=Number(e.get("multiplier"))||1,!this.baseScore&&this.multiplier>1?this.baseScore=Math.round(this.score/this.multiplier):this.baseScore||(this.baseScore=this.score),this.bonusPoints=Math.max(0,this.score-this.baseScore),this.percentage=this.total>0?Math.min(100,Math.round(this.baseScore/this.total*100)):0,this.grade=this.getGrade(this.percentage),this.categoryScores=this.progressService.getUserProgress().categoryScores,this.newBadges=this.progressService.getEarnedBadges().slice(-3),this.weakestArea=this.progressService.getWeakestCategory(),await this.syncToFirebase()}async syncToFirebase(){let e=this.authService.currentUser();if(!e)return;let t=this.progressService.getUserProgress();try{await this.firestoreService.saveProgress(e.uid,t),await this.firestoreService.saveLeaderboardEntry(e.uid,{displayName:this.authService.userDisplayName,photoURL:this.authService.userPhotoURL,totalPoints:t.totalPoints,accuracy:this.progressService.getAccuracyPercentage(),sessions:t.totalSessions})}catch(a){console.error("Firebase sync failed:",a)}}getGrade(e){return e>=90?{label:"Outstanding",color:"text-cyber-green",bg:"bg-cyber-green"}:e>=75?{label:"Proficient",color:"text-cyber-accent",bg:"bg-cyber-accent"}:e>=60?{label:"Developing",color:"text-cyber-yellow",bg:"bg-cyber-yellow"}:e>=40?{label:"Needs Work",color:"text-cyber-red",bg:"bg-cyber-red"}:{label:"Keep Practicing",color:"text-cyber-red",bg:"bg-cyber-red"}}getDifficultyLabel(){let e=this.progressService.getUserProgress().preferredDifficulty;return D.find(t=>t.level===e)?.label??""}getModeLabel(){return this.modeLabels[this.mode]??this.mode}getCategoryBarWidth(e){return e.percentage}getCategoryColor(e){return e.percentage>=75?"bg-cyber-green":e.percentage>=50?"bg-cyber-yellow":"bg-cyber-red"}playAgain(){this.router.navigate([`/${this.mode}`])}goHome(){this.router.navigate(["/"])}goToDashboard(){this.router.navigate(["/dashboard"])}exportPDF(){let e=this.progressService.getUserProgress(),t=this.progressService.getEarnedBadges(),a=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),b=`
      <!DOCTYPE html>
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
          .grade-badge { display: inline-block; background: ${this.grade.bg.replace("bg-cyber-green","#00ff88").replace("bg-cyber-accent","#00d4ff").replace("bg-cyber-yellow","#ffd700").replace("bg-cyber-red","#ff4d6d")}; color: #0a0e1a; padding: 6px 20px; border-radius: 20px; font-weight: bold; font-size: 18px; margin: 20px 0; }
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
          <p>Security Awareness Training Report \xB7 Generated ${a}</p>
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
            <div class="stat-box">
              <div class="stat-value" style="color:#00ff88">${e.totalSessions}</div>
              <div class="stat-label">Sessions</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${e.totalPoints}</div>
              <div class="stat-label">Total Points</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color:#00ff88">${e.totalCorrect}</div>
              <div class="stat-label">Correct Answers</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color:#ffd700">${this.progressService.getAccuracyPercentage()}%</div>
              <div class="stat-label">Overall Accuracy</div>
            </div>
          </div>
        </div>

        ${e.categoryScores.length?`
        <div class="section">
          <h2>Category Breakdown</h2>
          ${e.categoryScores.map(d=>`
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
        </div>`:""}

        ${t.length?`
        <div class="section">
          <h2>Badges Earned (${t.length})</h2>
          <div class="badge-grid">
            ${t.map(d=>`
              <div class="badge-item">
                <div class="badge-icon">${d.icon}</div>
                <div>
                  <div class="badge-name">${d.label}</div>
                  <div class="badge-desc">${d.description}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>`:""}

        <div class="footer">
          CyberSense Trainer \xB7 Security Awareness Training \xB7 ${a}
        </div>
      </body>
      </html>
    `,u=window.open("","_blank");u&&(u.document.write(b),u.document.close(),setTimeout(()=>u.print(),500))}static \u0275fac=function(t){return new(t||s)(m(R),m(A),m(T),m(F),m(z))};static \u0275cmp=w({type:s,selectors:[["app-results"]],decls:53,vars:20,consts:[[1,"min-h-screen","bg-cyber-dark","text-white","page-enter"],[1,"fixed","inset-0","pointer-events-none","z-0"],[1,"grid-bg"],[1,"relative","z-10","max-w-3xl","mx-auto","px-6","py-12"],[1,"text-center","mb-10"],[1,"text-cyber-muted","text-sm","uppercase","tracking-widest","mb-2"],[1,"text-5xl","font-bold","mb-4"],[1,"card","text-center","mb-6"],[1,"text-7xl","font-bold","text-cyber-accent","mb-1"],[1,"text-cyber-muted","mb-1"],["class","inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-yellow bg-opacity-10 border border-cyber-yellow border-opacity-30 mb-4",4,"ngIf"],["class","mb-4",4,"ngIf"],[1,"h-4","bg-cyber-border","rounded-full","overflow-hidden","mb-2"],[1,"h-full","rounded-full","transition-all","duration-1000"],[1,"flex","justify-between","text-xs","text-cyber-muted"],[1,"grid","grid-cols-3","gap-4","mb-6"],[1,"card","text-center","py-5"],[1,"text-3xl","font-bold","text-cyber-green"],[1,"text-cyber-muted","text-xs","mt-1","uppercase","tracking-wider"],[1,"text-3xl","font-bold","text-cyber-accent"],[1,"text-3xl","font-bold","text-cyber-yellow"],["class","card mb-6",4,"ngIf"],["class","weak-area-card mb-6",4,"ngIf"],[1,"flex","flex-col","sm:flex-row","gap-4","justify-center"],[1,"btn-secondary",3,"click"],[1,"btn-primary",3,"click"],[1,"inline-flex","items-center","gap-2","px-3","py-1","rounded-full","bg-cyber-yellow","bg-opacity-10","border","border-cyber-yellow","border-opacity-30","mb-4"],[1,"text-cyber-yellow","text-sm","font-bold"],[1,"text-cyber-muted","text-xs"],[1,"mb-4"],[1,"text-cyber-muted","text-sm"],[1,"card","mb-6"],[1,"font-bold","text-white","mb-4"],[1,"space-y-3"],["class","category-row",4,"ngFor","ngForOf"],[1,"category-row"],[1,"flex","justify-between","items-center","mb-1"],[1,"text-sm","capitalize"],[1,"text-xs","text-cyber-muted"],[1,"h-2","bg-cyber-border","rounded-full","overflow-hidden"],[1,"h-full","rounded-full","transition-all","duration-700"],[1,"weak-area-card","mb-6"],[1,"flex","items-start","gap-3"],[1,"text-2xl"],[1,"font-bold","text-cyber-yellow","mb-1"],[1,"text-sm","text-cyber-muted"],[1,"flex","flex-wrap","gap-3"],["class","badge-card",4,"ngFor","ngForOf"],[1,"badge-card"],[1,"text-3xl"],[1,"font-bold","text-sm"]],template:function(t,a){t&1&&(r(0,"div",0)(1,"div",1),f(2,"div",2),i(),r(3,"div",3)(4,"div",4)(5,"p",5),o(6),i(),r(7,"h1",6),o(8,"Session Results"),i(),r(9,"div"),o(10),i()(),r(11,"div",7)(12,"div",8),o(13),i(),r(14,"p",9),o(15),i(),v(16,B,5,2,"div",10)(17,O,3,1,"div",11),r(18,"div",12),f(19,"div",13),i(),r(20,"div",14)(21,"span"),o(22,"0"),i(),r(23,"span"),o(24),i()()(),r(25,"div",15)(26,"div",16)(27,"p",17),o(28),i(),r(29,"p",18),o(30,"Correct"),i()(),r(31,"div",16)(32,"p",19),o(33),i(),r(34,"p",18),o(35,"Points Earned"),i()(),r(36,"div",16)(37,"p",20),o(38),i(),r(39,"p",18),o(40,"Best Streak"),i()()(),v(41,j,5,1,"div",21)(42,L,10,5,"div",22)(43,G,5,1,"div",21),r(44,"div",23)(45,"button",24),x("click",function(){return a.goHome()}),o(46,"\u2190 Home"),i(),r(47,"button",25),x("click",function(){return a.playAgain()}),o(48,"Play Again \u2192"),i(),r(49,"button",24),x("click",function(){return a.goToDashboard()}),o(50,"Dashboard \u2192"),i(),r(51,"button",24),x("click",function(){return a.exportPDF()}),o(52,"\u{1F4C4} Export PDF"),i()()()()),t&2&&(n(6),l(" ",a.getModeLabel()," "),n(3),y("inline-block px-6 py-2 rounded-full text-cyber-dark font-bold text-xl "+a.grade.bg),n(),l(" ",a.grade.label," "),n(3),l("",a.percentage,"%"),n(2),S(" ",a.baseScore," / ",a.total," base points "),n(),c("ngIf",a.bonusPoints>0),n(),c("ngIf",a.bonusPoints===0),n(2),y(a.grade.bg),h("width",a.percentage,"%"),n(5),l("",a.total," base pts"),n(4),p(a.correct),n(5),p(a.score),n(5),p(a.streak),n(3),c("ngIf",a.categoryScores.length>0),n(),c("ngIf",a.weakestArea&&a.weakestArea.percentage<75),n(),c("ngIf",a.newBadges.length>0))},dependencies:[$,E,P,I],styles:[".grid-bg[_ngcontent-%COMP%]{width:100%;height:100%;background-image:linear-gradient(rgba(0,212,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.03) 1px,transparent 1px);background-size:50px 50px}.category-row[_ngcontent-%COMP%]{border-radius:.5rem;border-width:1px;--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(6 9 16 / var(--tw-bg-opacity, 1));padding:.75rem}.weak-area-card[_ngcontent-%COMP%]{border-radius:.75rem;border-width:1px;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity, 1));padding:1.5rem;--tw-border-opacity: 1;border-color:rgb(255 215 0 / var(--tw-border-opacity, 1));border-color:#ffd7004d;background:#ffd7000d}.badge-card[_ngcontent-%COMP%]{display:flex;min-width:200px;flex:1 1 0%;align-items:center;gap:.75rem;border-radius:.5rem;border-width:1px;--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(6 9 16 / var(--tw-bg-opacity, 1));padding:.75rem}"]})};export{M as ResultsComponent};
