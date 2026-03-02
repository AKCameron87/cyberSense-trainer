import{b as A}from"./chunk-R6KMNEWQ.js";import{B as E,C as P,D as $,E as I,I as R,K as z,f as o,g as v,h as S,i as u,j as c,k as e,l as t,m as f,o as b,p as m,q as h,s as y,t as a,u as l,v as g,w,x as k,y as C,z as _}from"./chunk-5GH7QX5K.js";function T(s,r){if(s&1&&(e(0,"div",29)(1,"div",30)(2,"span",31),a(3),t(),e(4,"span",32),a(5),t()(),e(6,"div",33),f(7,"div",34),t()()),s&2){let i=r.$implicit,n=m(2);o(3),l(i.category),o(2),k("",i.correct,"/",i.total," \xB7 ",i.percentage,"%"),o(2),y(n.getCategoryColor(i)),h("width",n.getCategoryBarWidth(i),"%")}}function M(s,r){if(s&1&&(e(0,"div",25)(1,"h3",26),a(2,"Performance by Category"),t(),e(3,"div",27),u(4,T,8,8,"div",28),t()()),s&2){let i=m();o(4),c("ngForOf",i.categoryScores)}}function B(s,r){if(s&1&&(e(0,"div",35)(1,"div",36)(2,"span",37),a(3,"\u{1F3AF}"),t(),e(4,"div")(5,"p",38),a(6),C(7,"titlecase"),t(),e(8,"p",39),a(9),t()()()()),s&2){let i=m();o(6),g("Focus Area: ",_(7,3,i.weakestArea.category)),o(3),w(" You scored ",i.weakestArea.percentage,"% in this category. Practice more ",i.weakestArea.category," scenarios to strengthen this skill. ")}}function F(s,r){if(s&1&&(e(0,"div",42)(1,"span",43),a(2),t(),e(3,"div")(4,"p",44),a(5),t(),e(6,"p",45),a(7),t()()()),s&2){let i=r.$implicit;o(2),l(i.icon),o(3),l(i.label),o(2),l(i.description)}}function O(s,r){if(s&1&&(e(0,"div",25)(1,"h3",26),a(2,"\u{1F3C6} Badges Earned"),t(),e(3,"div",40),u(4,F,8,3,"div",41),t()()),s&2){let i=m();o(4),c("ngForOf",i.newBadges)}}var D=class s{constructor(r,i,n){this.route=r;this.router=i;this.progressService=n}mode="";score=0;total=0;correct=0;streak=0;percentage=0;grade={label:"",color:"",bg:""};categoryScores=[];newBadges=[];weakestArea=null;modeLabels={"phishing-sim":"\u{1F3A3} Phishing Simulation","social-eng-quiz":"\u{1F9E0} Social Engineering Quiz"};ngOnInit(){let r=this.route.snapshot.queryParamMap;this.mode=r.get("mode")??"",this.score=Number(r.get("score"))||0,this.total=Number(r.get("total"))||0,this.correct=Number(r.get("correct"))||0,this.streak=Number(r.get("streak"))||0,this.percentage=this.total>0?Math.round(this.score/this.total*100):0,this.grade=this.getGrade(this.percentage),this.categoryScores=this.progressService.getUserProgress().categoryScores,this.newBadges=this.progressService.getEarnedBadges().slice(-3),this.weakestArea=this.progressService.getWeakestCategory()}getGrade(r){return r>=90?{label:"Outstanding",color:"text-cyber-green",bg:"bg-cyber-green"}:r>=75?{label:"Proficient",color:"text-cyber-accent",bg:"bg-cyber-accent"}:r>=60?{label:"Developing",color:"text-cyber-yellow",bg:"bg-cyber-yellow"}:r>=40?{label:"Needs Work",color:"text-cyber-red",bg:"bg-cyber-red"}:{label:"Keep Practicing",color:"text-cyber-red",bg:"bg-cyber-red"}}getScorePercentage(){return this.total?Math.min(100,Math.round(this.score/this.total*100)):0}getModeLabel(){return this.modeLabels[this.mode]??this.mode}getCategoryBarWidth(r){return r.percentage}getCategoryColor(r){return r.percentage>=75?"bg-cyber-green":r.percentage>=50?"bg-cyber-yellow":"bg-cyber-red"}playAgain(){this.router.navigate([`/${this.mode}`])}goHome(){this.router.navigate(["/"])}goToDashboard(){this.router.navigate(["/dashboard"])}exportPDF(){let r=this.progressService.getUserProgress(),i=this.progressService.getEarnedBadges(),n=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),p=`
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
        <p>Security Awareness Training Report \xB7 Generated ${n}</p>
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
            <div class="stat-value" style="color:#00ff88">${r.totalSessions}</div>
            <div class="stat-label">Sessions</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${r.totalPoints}</div>
            <div class="stat-label">Total Points</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color:#00ff88">${r.totalCorrect}</div>
            <div class="stat-label">Correct Answers</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color:#ffd700">${this.progressService.getAccuracyPercentage()}%</div>
            <div class="stat-label">Overall Accuracy</div>
          </div>
        </div>
      </div>

      ${r.categoryScores.length?`
      <div class="section">
        <h2>Category Breakdown</h2>
        ${r.categoryScores.map(d=>`
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
        CyberSense Trainer \xB7 Security Awareness Training \xB7 ${n}
      </div>
    </body>
    </html>
  `,x=window.open("","_blank");x&&(x.document.write(p),x.document.close(),setTimeout(()=>x.print(),500))}static \u0275fac=function(i){return new(i||s)(v(R),v(z),v(A))};static \u0275cmp=S({type:s,selectors:[["app-results"]],decls:52,vars:18,consts:[[1,"min-h-screen","bg-cyber-dark","text-white","page-enter"],[1,"min-h-screen","bg-cyber-dark","text-white"],[1,"fixed","inset-0","pointer-events-none","z-0"],[1,"grid-bg"],[1,"relative","z-10","max-w-3xl","mx-auto","px-6","py-12"],[1,"text-center","mb-10"],[1,"text-cyber-muted","text-sm","uppercase","tracking-widest","mb-2"],[1,"text-5xl","font-bold","mb-4"],[1,"card","text-center","mb-6"],[1,"text-7xl","font-bold","text-cyber-accent","mb-2"],[1,"text-cyber-muted","mb-6"],[1,"h-4","bg-cyber-border","rounded-full","overflow-hidden","mb-2"],[1,"h-full","rounded-full","transition-all","duration-1000"],[1,"flex","justify-between","text-xs","text-cyber-muted"],[1,"grid","grid-cols-3","gap-4","mb-6"],[1,"card","text-center","py-5"],[1,"text-3xl","font-bold","text-cyber-green"],[1,"text-cyber-muted","text-xs","mt-1","uppercase","tracking-wider"],[1,"text-3xl","font-bold","text-cyber-accent"],[1,"text-3xl","font-bold","text-cyber-yellow"],["class","card mb-6",4,"ngIf"],["class","weak-area-card mb-6",4,"ngIf"],[1,"flex","flex-col","sm:flex-row","gap-4","justify-center"],[1,"btn-secondary",3,"click"],[1,"btn-primary",3,"click"],[1,"card","mb-6"],[1,"font-bold","text-white","mb-4"],[1,"space-y-3"],["class","category-row",4,"ngFor","ngForOf"],[1,"category-row"],[1,"flex","justify-between","items-center","mb-1"],[1,"text-sm","capitalize"],[1,"text-xs","text-cyber-muted"],[1,"h-2","bg-cyber-border","rounded-full","overflow-hidden"],[1,"h-full","rounded-full","transition-all","duration-700"],[1,"weak-area-card","mb-6"],[1,"flex","items-start","gap-3"],[1,"text-2xl"],[1,"font-bold","text-cyber-yellow","mb-1"],[1,"text-sm","text-cyber-muted"],[1,"flex","flex-wrap","gap-3"],["class","badge-card",4,"ngFor","ngForOf"],[1,"badge-card"],[1,"text-3xl"],[1,"font-bold","text-sm"],[1,"text-cyber-muted","text-xs"]],template:function(i,n){i&1&&(e(0,"div",0)(1,"div",1)(2,"div",2),f(3,"div",3),t(),e(4,"div",4)(5,"div",5)(6,"p",6),a(7),t(),e(8,"h1",7),a(9,"Session Results"),t(),e(10,"div"),a(11),t()(),e(12,"div",8)(13,"div",9),a(14),t(),e(15,"p",10),a(16),t(),e(17,"div",11),f(18,"div",12),t(),e(19,"div",13)(20,"span"),a(21,"0"),t(),e(22,"span"),a(23),t()()(),e(24,"div",14)(25,"div",15)(26,"p",16),a(27),t(),e(28,"p",17),a(29,"Correct"),t()(),e(30,"div",15)(31,"p",18),a(32),t(),e(33,"p",17),a(34,"Points Earned"),t()(),e(35,"div",15)(36,"p",19),a(37),t(),e(38,"p",17),a(39,"Best Streak"),t()()(),u(40,M,5,1,"div",20)(41,B,10,5,"div",21)(42,O,5,1,"div",20),e(43,"div",22)(44,"button",23),b("click",function(){return n.goHome()}),a(45," \u2190 Home "),t(),e(46,"button",24),b("click",function(){return n.playAgain()}),a(47," Play Again \u2192 "),t(),e(48,"button",23),b("click",function(){return n.goToDashboard()}),a(49," Dashboard \u2192 "),t(),e(50,"button",23),b("click",function(){return n.exportPDF()}),a(51," \u{1F4C4} Export PDF "),t()()()()()),i&2&&(o(7),g(" ",n.getModeLabel()," "),o(3),y("inline-block px-6 py-2 rounded-full text-cyber-dark font-bold text-xl "+n.grade.bg),o(),g(" ",n.grade.label," "),o(3),g("",n.percentage,"%"),o(2),w("",n.score," out of ",n.total," possible points"),o(2),y(n.grade.bg),h("width",n.percentage,"%"),o(5),g("",n.total," pts"),o(4),l(n.correct),o(5),l(n.score),o(5),l(n.streak),o(3),c("ngIf",n.categoryScores.length>0),o(),c("ngIf",n.weakestArea&&n.weakestArea.percentage<75),o(),c("ngIf",n.newBadges.length>0))},dependencies:[I,E,P,$],styles:[".grid-bg[_ngcontent-%COMP%]{width:100%;height:100%;background-image:linear-gradient(rgba(0,212,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.03) 1px,transparent 1px);background-size:50px 50px}.category-row[_ngcontent-%COMP%]{border-radius:.5rem;border-width:1px;--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(6 9 16 / var(--tw-bg-opacity, 1));padding:.75rem}.weak-area-card[_ngcontent-%COMP%]{border-radius:.75rem;border-width:1px;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity, 1));padding:1.5rem;--tw-border-opacity: 1;border-color:rgb(255 215 0 / var(--tw-border-opacity, 1));border-color:#ffd7004d;background:#ffd7000d}.badge-card[_ngcontent-%COMP%]{display:flex;min-width:200px;flex:1 1 0%;align-items:center;gap:.75rem;border-radius:.5rem;border-width:1px;--tw-border-opacity: 1;border-color:rgb(31 41 55 / var(--tw-border-opacity, 1));--tw-bg-opacity: 1;background-color:rgb(6 9 16 / var(--tw-bg-opacity, 1));padding:.75rem}"]})};export{D as ResultsComponent};
