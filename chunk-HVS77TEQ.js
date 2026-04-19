import{a as h}from"./chunk-LKBAALGR.js";import{p as c,s as u}from"./chunk-ZWO3O3UP.js";var d=class r{constructor(i){this.adminService=i}staticPhishing=[];staticQuiz=[];customPhishing=[];customQuiz=[];staticLoaded=!1;customLoaded=!1;_allPhishing=[];_allQuiz=[];async loadStaticScenarios(){if(!this.staticLoaded)try{let[i,e]=await Promise.all([fetch("assets/data/phishing-scenarios.json"),fetch("assets/data/quiz-scenarios.json")]);this.staticPhishing=await i.json(),this.staticQuiz=await e.json(),this.staticLoaded=!0,this.rebuildArrays()}catch(i){console.error("Failed to load static scenarios:",i)}}async loadCustomScenarios(){if(!this.customLoaded)try{this.customPhishing=await this.adminService.getCustomScenarios(),this.customQuiz=await this.adminService.getCustomQuestions(),this.customLoaded=!0,this.rebuildArrays()}catch(i){console.warn("Could not load custom scenarios from Firestore:",i)}}async loadAll(){await Promise.all([this.loadStaticScenarios(),this.loadCustomScenarios()])}rebuildArrays(){this._allPhishing=[...this.staticPhishing,...this.customPhishing],this._allQuiz=[...this.staticQuiz,...this.customQuiz]}getPhishingScenarios(i){return i?this._allPhishing.filter(e=>e.difficulty===i):this._allPhishing}getRandomPhishingScenarios(i,e){return this.shuffleAndTake(this.getPhishingScenarios(e),i)}getQuizQuestions(i,e){let n=this._allQuiz;return i&&(n=n.filter(s=>s.difficulty===i)),e&&(n=n.filter(s=>s.attackType===e)),n}getRandomQuizQuestions(i,e,n){let s=this._allQuiz;return e&&(s=s.filter(t=>t.difficulty===e)),n?.length&&(s=s.filter(t=>n.includes(t.attackType))),this.shuffleAndTake(s,i)}shuffleAndTake(i,e){return[...i].sort(()=>Math.random()-.5).slice(0,e)}static \u0275fac=function(e){return new(e||r)(u(h))};static \u0275prov=c({token:r,factory:r.\u0275fac,providedIn:"root"})};var f=class r{API_URL=window.location.hostname==="localhost"?"http://localhost:3001/v1/messages":"https://us-central1-cybersense-trainer.cloudfunctions.net/anthropicProxy";MODEL="claude-sonnet-4-20250514";PHISHING_SEEDS=["a fake bank security alert","a fake package delivery notice","a fake IT helpdesk password reset","a fake invoice from a vendor","a fake HR benefits update","a fake cloud storage sharing request","a fake tax refund notification","a fake subscription renewal","a fake executive request for urgent wire transfer","a fake government compliance notice","a fake software license expiry warning","a fake prize or lottery win notification"];async callApi(i,e){try{let o=((await(await fetch(this.API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:this.MODEL,max_tokens:e,messages:[{role:"user",content:i}]})})).json()).content?.[0]?.text??"").replace(/```json|```/g,"").trim();return JSON.parse(o)}catch(n){return console.error("AI API call failed:",n),null}}async generatePhishingScenario(i,e=[]){let n=this.PHISHING_SEEDS[Math.floor(Math.random()*this.PHISHING_SEEDS.length)],s=e.length?`
Do NOT repeat any of these already-used scenarios: ${e.join("; ")}.
Your scenario MUST be on a completely different topic, brand, and attack vector.`:"",t=`You are generating a phishing simulation scenario for a cybersecurity training application.

Difficulty: ${i}
Topic seed (use this as inspiration): ${n}
${s}

Return ONLY a valid JSON object with EXACTLY this structure \u2014 no markdown, no explanation, no code fences:

{
  "id": "ai-p-001",
  "type": "email",
  "difficulty": "${i}",
  "title": "Short descriptive title (different from the seed, be creative)",
  "description": "One sentence instruction for the trainee",
  "explanation": "One sentence explaining the main phishing technique used",
  "category": "Phishing",
  "subject": "Realistic email subject line",
  "senderEmail": "fake@suspicious-domain.com",
  "totalPoints": 400,
  "redFlags": [
    {
      "id": "rf1",
      "elementId": "rf-sender",
      "description": "Explain exactly why the sender address is suspicious",
      "points": 100
    },
    {
      "id": "rf2",
      "elementId": "rf-urgency",
      "description": "Explain the urgency or pressure tactic used",
      "points": 100
    },
    {
      "id": "rf3",
      "elementId": "rf-link",
      "description": "Explain why the link or button is suspicious",
      "points": 100
    },
    {
      "id": "rf4",
      "elementId": "rf-footer",
      "description": "Explain the suspicious footer or branding element",
      "points": 100
    }
  ],
  "bodyHtml": "FULL HTML EMAIL BODY HERE"
}

bodyHtml requirements:
- Must be realistic, well-formatted HTML that looks like a genuine company email
- Must contain elements with EXACTLY these id attributes: rf-sender, rf-urgency, rf-link, rf-footer
- Difficulty rookie = obvious red flags (misspellings, obvious fake domains)
- Difficulty analyst = subtle red flags (slightly off branding, minor domain issues)
- Difficulty expert = very convincing (nearly identical to real emails, very subtle flaws)
- Use inline styles to make it look professional
- The HTML should be a complete email body div, not a full HTML document`,o=await this.callApi(t,3e3);return o?(o.id=`ai-p-${crypto.randomUUID()}`,o):null}async generateQuizQuestion(i,e,n=[]){let t=["a","b","c","d"][Math.floor(Math.random()*4)],o=n.length?`
Do NOT repeat scenarios similar to: ${n.join("; ")}.
Your scenario must be on a completely different topic.`:"",l=`You are generating a social engineering quiz question for a cybersecurity training application.

Difficulty: ${i}
Attack type: ${e}
${o}

The CORRECT answer MUST be option "${t}". This is mandatory \u2014 do not make any other option the correct answer.

Return ONLY a valid JSON object with EXACTLY this structure \u2014 no markdown, no explanation, no code fences:

{
  "id": "ai-q-001",
  "attackType": "${e}",
  "difficulty": "${i}",
  "scenario": "A realistic 2-4 sentence scenario description. Be specific and creative \u2014 describe a real-world situation involving ${e}.",
  "options": [
    { "id": "a", "text": "${t==="a"?"THE CORRECT RESPONSE - best security action to take":`Plausible but incorrect option - a wrong response to the ${e} attack`}" },
    { "id": "b", "text": "${t==="b"?"THE CORRECT RESPONSE - best security action to take":`Plausible but incorrect option - a wrong response to the ${e} attack`}" },
    { "id": "c", "text": "${t==="c"?"THE CORRECT RESPONSE - best security action to take":`Plausible but incorrect option - a wrong response to the ${e} attack`}" },
    { "id": "d", "text": "${t==="d"?"THE CORRECT RESPONSE - best security action to take":`Plausible but incorrect option - a wrong response to the ${e} attack`}" }
  ],
  "correctId": "${t}",
  "explanation": "2-3 sentences explaining why option ${t} is correct and what makes the other options wrong or risky",
  "points": ${i==="rookie"?100:i==="analyst"?150:200},
  "tip": "One concrete, actionable security tip related to defending against ${e} attacks"
}

Important rules:
- The scenario must be a specific, realistic situation \u2014 not generic
- Wrong options must be plausible enough to be tempting, not obviously wrong
- The correct answer (option ${t}) must be the best security response
- Explanation must reference why option ${t} specifically is correct
- Difficulty rookie = obvious attack with clear correct answer
- Difficulty analyst = moderately subtle, requires security knowledge
- Difficulty expert = very convincing scenario, correct answer requires careful reasoning`,a=await this.callApi(l,1200);return a?(a.correctId=t,a.id=`ai-q-${crypto.randomUUID()}`,a):null}async generatePhishingBatch(i,e){let n=[],s=[];for(let t=0;t<e;t++){let o=await this.generatePhishingScenario(i,s);o&&(n.push(o),s.push(o.title))}return n}async generateQuizBatch(i,e){let n=["phishing","vishing","smishing","baiting","pretexting"].sort(()=>Math.random()-.5),s=[],t=[];for(let o=0;o<e;o++){let l=n[o%n.length],a=await this.generateQuizQuestion(i,l,t);a&&(s.push(a),t.push(a.scenario.slice(0,80)))}return s}static \u0275fac=function(e){return new(e||r)};static \u0275prov=c({token:r,factory:r.\u0275fac,providedIn:"root"})};export{d as a,f as b};
