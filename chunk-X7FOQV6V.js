import{b as T}from"./chunk-NHZELZKB.js";import{a as D}from"./chunk-X4DJFX37.js";import"./chunk-ADGDKN4Z.js";import{a as z}from"./chunk-TGZYWCTP.js";import"./chunk-OXLIK3IL.js";import{Aa as $,Ea as A,Ga as R,M as n,O as p,P as w,T as x,V as g,W as t,X as r,Y as f,aa as v,ba as u,ca as h,ea as y,fa as o,ga as l,ha as b,ia as S,ja as k,oa as C,pa as _,wa as E,xa as P,ya as I}from"./chunk-5O7KERED.js";function M(s,e){if(s&1&&(t(0,"div",29)(1,"div",30)(2,"span",31),o(3),r(),t(4,"span",32),o(5),r()(),t(6,"div",33),f(7,"div",34),r()()),s&2){let i=e.$implicit,a=u(2);n(3),l(i.category),n(2),k("",i.correct,"/",i.total," \xB7 ",i.percentage,"%"),n(2),y(a.getCategoryColor(i)),h("width",a.getCategoryBarWidth(i),"%")}}function B(s,e){if(s&1&&(t(0,"div",25)(1,"h3",26),o(2,"Performance by Category"),r(),t(3,"div",27),x(4,M,8,8,"div",28),r()()),s&2){let i=u();n(4),g("ngForOf",i.categoryScores)}}function O(s,e){if(s&1&&(t(0,"div",35)(1,"div",36)(2,"span",37),o(3,"\u{1F3AF}"),r(),t(4,"div")(5,"p",38),o(6),C(7,"titlecase"),r(),t(8,"p",39),o(9),r()()()()),s&2){let i=u();n(6),b("Focus Area: ",_(7,3,i.weakestArea.category)),n(3),S(" You scored ",i.weakestArea.percentage,"% in this category. Practice more ",i.weakestArea.category," scenarios to strengthen this skill. ")}}function N(s,e){if(s&1&&(t(0,"div",42)(1,"span",43),o(2),r(),t(3,"div")(4,"p",44),o(5),r(),t(6,"p",45),o(7),r()()()),s&2){let i=e.$implicit;n(2),l(i.icon),n(3),l(i.label),n(2),l(i.description)}}function j(s,e){if(s&1&&(t(0,"div",25)(1,"h3",26),o(2,"\u{1F3C6} Badges Earned"),r(),t(3,"div",40),x(4,N,8,3,"div",41),r()()),s&2){let i=u();n(4),g("ngForOf",i.newBadges)}}var F=class s{constructor(e,i,a,c,m){this.route=e;this.router=i;this.progressService=a;this.authService=c;this.firestoreService=m}mode="";score=0;total=0;correct=0;streak=0;percentage=0;grade={label:"",color:"",bg:""};categoryScores=[];newBadges=[];weakestArea=null;modeLabels={"phishing-sim":"\u{1F3A3} Phishing Simulation","social-eng-quiz":"\u{1F9E0} Social Engineering Quiz"};async ngOnInit(){let e=this.route.snapshot.queryParamMap;this.mode=e.get("mode")??"",this.score=Number(e.get("score"))||0,this.total=Number(e.get("total"))||0,this.correct=Number(e.get("correct"))||0,this.streak=Number(e.get("streak"))||0,this.percentage=this.total>0?Math.min(100,Math.round(this.score/this.total*100)):0,this.grade=this.getGrade(this.percentage),this.categoryScores=this.progressService.getUserProgress().categoryScores,this.newBadges=this.progressService.getEarnedBadges().slice(-3),this.weakestArea=this.progressService.getWeakestCategory(),await this.syncToFirebase()}async syncToFirebase(){let e=this.authService.currentUser();if(!e)return;let i=this.progressService.getUserProgress();try{await this.firestoreService.saveProgress(e.uid,i),await this.firestoreService.saveLeaderboardEntry(e.uid,{displayName:this.authService.userDisplayName,photoURL:this.authService.userPhotoURL,totalPoints:i.totalPoints,accuracy:this.progressService.getAccuracyPercentage(),sessions:i.totalSessions})}catch(a){console.error("Firebase sync failed:",a)}}getGrade(e){return e>=90?{label:"Outstanding",color:"text-cyber-green",bg:"bg-cyber-green"}:e>=75?{label:"Proficient",color:"text-cyber-accent",bg:"bg-cyber-accent"}:e>=60?{label:"Developing",color:"text-cyber-yellow",bg:"bg-cyber-yellow"}:e>=40?{label:"Needs Work",color:"text-cyber-red",bg:"bg-cyber-red"}:{label:"Keep Practicing",color:"text-cyber-red",bg:"bg-cyber-red"}}getScorePercentage(){return this.total?Math.min(100,Math.round(this.score/this.total*100)):0}getModeLabel(){return this.modeLabels[this.mode]??this.mode}getCategoryBarWidth(e){return e.percentage}getCategoryColor(e){return e.percentage>=75?"bg-cyber-green":e.percentage>=50?"bg-cyber-yellow":"bg-cyber-red"}playAgain(){this.router.navigate([`/${this.mode}`])}goHome(){this.router.navigate(["/"])}goToDashboard(){this.router.navigate(["/dashboard"])}exportPDF(){let e=this.progressService.getUserProgress(),i=this.progressService.getEarnedBadges(),a=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),c=`
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
          <p style="font-size:13px;color:#666;">${this.score} out of ${this.total} possible points (${this.percentage}%)</p>
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

        ${i.length?`
        <div class="section">
          <h2>Badges Earned (${i.length})</h2>
          <div class="badge-grid">
            ${i.map(d=>`
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
    `,m=window.open("","_blank");m&&(m.document.write(c),m.document.close(),setTimeout(()=>m.print(),500))}static \u0275fac=function(i){return new(i||s)(p(A),p(R),p(T),p(z),p(D))};static \u0275cmp=w({type:s,selectors:[["app-results"]],decls:52,vars:18,consts:[[1,"min-h-screen","bg-cyber-dark","text-white","page-enter"],[1,"min-h-screen","bg-cyber-dark","text-white"],[1,"fixed","inset-0","pointer-events-none","z-0"],[1,"grid-bg"],[1,"relative","z-10","max-w-3xl","mx-auto","px-6","py-12"],[1,"text-center","mb-10"],[1,"text-cyber-muted","text-sm","uppercase","tracking-widest","mb-2"],[1,"text-5xl","font-bold","mb-4"],[1,"card","text-center","mb-6"],[1,"text-7xl","font-bold","text-cyber-accent","mb-2"],[1,"text-cyber-muted","mb-6"],[1,"h-4","bg-cyber-border","rounded-full","overflow-hidden","mb-2"],[1,"h-full","rounded-full","transition-all","duration-1000"],[1,"flex","justify-between","text-xs","text-cyber-muted"],[1,"grid","grid-cols-3","gap-4","mb-6"],[1,"card","text-center","py-5"],[1,"text-3xl","font-bold","text-cyber-green"],[1,"text-cyber-muted","text-xs","mt-1","uppercase","tracking-wider"],[1,"text-3xl","font-bold","text-cyber-accent"],[1,"text-3xl","font-bold","text-cyber-yellow"],["class","card mb-6",4,"ngIf"],["class","weak-area-card mb-6",4,"ngIf"],[1,"flex","flex-col","sm:flex-row","gap-4","justify-center"],[1,"btn-secondary",3,"click"],[1,"btn-primary",3,"click"],[1,"card","mb-6"],[1,"font-bold","text-white","mb-4"],[1,"space-y-3"],["class","category-row",4,"ngFor","ngForOf"],[1,"category-row"],[1,"flex","justify-between","items-center","mb-1"],[1,"text-sm","capitalize"],[1,"text-xs","text-cyber-muted"],[1,"h-2","bg-cyber-border","rounded-full","overflow-hidden"],[1,"h-full","rounded-full","transition-all","duration-700"],[1,"weak-area-card","mb-6"],[1,"flex","items-start","gap-3"],[1,"text-2xl"],[1,"font-bold","text-cyber-yellow","mb-1"],[1,"text-sm","text-cyber-muted"],[1,"flex","flex-wrap","gap-3"],["class","badge-card",4,"ngFor","ngForOf"],[1,"badge-card"],[1,"text-3xl"],[1,"font-bold","text-sm"],[1,"text-cyber-muted","text-xs"]],template:function(i,a){i&1&&(t(0,"div",0)(1,"div",1)(2,"div",2),f(3,"div",3),r(),t(4,"div",4)(5,"div",5)(6,"p",6),o(7),r(),t(8,"h1",7),o(9,"Session Results"),r(),t(10,"div"),o(11),r()(),t(12,"div",8)(13,"div",9),o(14),r(),t(15,"p",10),o(16),r(),t(17,"div",11),f(18,"div",12),r(),t(19,"div",13)(20,"span"),o(21,"0"),r(),t(22,"span"),o(23),r()()(),t(24,"div",14)(25,"div",15)(26,"p",16),o(27),r(),t(28,"p",17),o(29,"Correct"),r()(),t(30,"div",15)(31,"p",18),o(32),r(),t(33,"p",17),o(34,"Points Earned"),r()(),t(35,"div",15)(36,"p",19),o(37),r(),t(38,"p",17),o(39,"Best Streak"),r()()(),x(40,B,5,1,"div",20)(41,O,10,5,"div",21)(42,j,5,1,"div",20),t(43,"div",22)(44,"button",23),v("click",function(){return a.goHome()}),o(45," \u2190 Home "),r(),t(46,"button",24),v("click",function(){return a.playAgain()}),o(47," Play Again \u2192 "),r(),t(48,"button",23),v("click",function(){return a.goToDashboard()}),o(49," Dashboard \u2192 "),r(),t(50,"button",23),v("click",function(){return a.exportPDF()}),o(51," \u{1F4C4} Export PDF "),r()()()()()),i&2&&(n(7),b(" ",a.getModeLabel()," "),n(3),y("inline-block px-6 py-2 rounded-full text-cyber-dark font-bold text-xl "+a.grade.bg),n(),b(" ",a.grade.label," "),n(3),b("",a.percentage,"%"),n(2),S("",a.score," out of ",a.total," possible points"),n(2),y(a.grade.bg),h("width",a.percentage,"%"),n(5),b("",a.total," pts"),n(4),l(a.correct),n(5),l(a.score),n(5),l(a.streak),n(3),g("ngIf",a.categoryScores.length>0),n(),g("ngIf",a.weakestArea&&a.weakestArea.percentage<75),n(),g("ngIf",a.newBadges.length>0))},dependencies:[$,E,P,I],styles:[".grid-bg[_ngcontent-%COMP%]{width:100%;height:100%;background-image:linear-gradient(rgba(0,212,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.03) 1px,transparent 1px);background-size:50px 50px}.category-row[_ngcontent-%COMP%]{border-radius:.5rem;border-width:1px;--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(6 9 16 / var(--tw-bg-opacity, 1));padding:.75rem}.weak-area-card[_ngcontent-%COMP%]{border-radius:.75rem;border-width:1px;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity, 1));padding:1.5rem;--tw-border-opacity: 1;border-color:rgb(255 215 0 / var(--tw-border-opacity, 1));border-color:#ffd7004d;background:#ffd7000d}.badge-card[_ngcontent-%COMP%]{display:flex;min-width:200px;flex:1 1 0%;align-items:center;gap:.75rem;border-radius:.5rem;border-width:1px;--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(6 9 16 / var(--tw-bg-opacity, 1));padding:.75rem}"]})};export{F as ResultsComponent};
