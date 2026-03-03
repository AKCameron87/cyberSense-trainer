import{p as u}from"./chunk-5O7KERED.js";var p=class c{API_URL=window.location.hostname==="localhost"?"http://localhost:3001/v1/messages":null;MODEL="claude-sonnet-4-20250514";async generatePhishingScenario(i,e=[]){let o=e.length?`Do NOT generate any of these scenarios: ${e.join(", ")}.`:"",n=`Generate a realistic phishing simulation scenario for a cybersecurity training app.
Difficulty: ${i}
${o}

Return ONLY a valid JSON object with this exact structure:
{
  "id": "ai-p-001",
  "type": "email",
  "difficulty": "${i}",
  "title": "Short descriptive title",
  "description": "One sentence instruction for the trainee",
  "category": "Attack category name",
  "subject": "Email subject line",
  "senderEmail": "fake@suspicious-domain.com",
  "totalPoints": 400,
  "redFlags": [
    {
      "id": "rf1",
      "elementId": "rf-sender",
      "description": "Why this is suspicious",
      "points": 100
    },
    {
      "id": "rf2",
      "elementId": "rf-urgency",
      "description": "Why this is suspicious",
      "points": 100
    },
    {
      "id": "rf3",
      "elementId": "rf-link",
      "description": "Why this is suspicious",
      "points": 100
    },
    {
      "id": "rf4",
      "elementId": "rf-footer",
      "description": "Why this is suspicious",
      "points": 100
    }
  ],
  "bodyHtml": "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'><!-- realistic email HTML here. IMPORTANT: each red flag elementId must appear as an id on a clickable HTML element inside this HTML --></div>"
}

Rules:
- difficulty rookie = obvious red flags, analyst = subtle, expert = very convincing
- The bodyHtml must be realistic looking HTML email content
- Every elementId in redFlags (rf-sender, rf-urgency, rf-link, rf-footer) MUST appear as an id attribute on a element in bodyHtml
- Make the email look convincing but with detectable flaws appropriate to the difficulty
- totalPoints = sum of all red flag points
- Return ONLY the JSON, no markdown, no explanation`;try{let a=((await(await fetch(this.API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:this.MODEL,max_tokens:2e3,messages:[{role:"user",content:n}]})})).json()).content?.[0]?.text??"").replace(/```json|```/g,"").trim(),r=JSON.parse(a);return r.id=`ai-p-${Date.now()}`,r}catch(t){return console.error("AI scenario generation failed:",t),null}}async generateQuizQuestion(i,e,o=[]){let n=`Generate a realistic social engineering quiz question for a cybersecurity training app.
Difficulty: ${i}
Attack type: ${e}

Return ONLY a valid JSON object with this exact structure:
{
  "id": "ai-q-001",
  "attackType": "${e}",
  "difficulty": "${i}",
  "scenario": "A realistic 2-4 sentence scenario description",
  "options": [
    { "id": "a", "text": "First answer option" },
    { "id": "b", "text": "Second answer option" },
    { "id": "c", "text": "Correct answer option" },
    { "id": "d", "text": "Fourth answer option" }
  ],
  "correctId": "c",
  "explanation": "2-3 sentence explanation of why this is the correct answer",
  "points": 150,
  "tip": "One practical security tip related to this scenario"
}

Rules:
- difficulty rookie = obvious attack, analyst = moderately subtle, expert = very convincing
- The scenario must be realistic and plausible
- One option must be clearly correct, others plausible but wrong
- The correct answer should NOT always be option c \u2014 randomize which option id is correct
- explanation should teach the user something valuable
- points: rookie=100, analyst=150, expert=200
- Return ONLY the JSON, no markdown, no explanation`;try{let a=((await(await fetch(this.API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:this.MODEL,max_tokens:1e3,messages:[{role:"user",content:n}]})})).json()).content?.[0]?.text??"").replace(/```json|```/g,"").trim(),r=JSON.parse(a);return r.id=`ai-q-${Date.now()}-${Math.random().toString(36).slice(2)}`,r}catch(t){return console.error("AI question generation failed:",t),null}}async generatePhishingBatch(i,e){let o=[],n=[];for(let t=0;t<e;t++){let s=await this.generatePhishingScenario(i,n);s&&(o.push(s),n.push(s.title))}return o}async generateQuizBatch(i,e){let o=["phishing","vishing","smishing","baiting","pretexting"],n=[],t=[];for(let s=0;s<e;s++){let l=o[s%o.length],a=await this.generateQuizQuestion(i,l,t);a&&(n.push(a),t.push(a.id))}return n}static \u0275fac=function(e){return new(e||c)};static \u0275prov=u({token:c,factory:c.\u0275fac,providedIn:"root"})};export{p as a};
