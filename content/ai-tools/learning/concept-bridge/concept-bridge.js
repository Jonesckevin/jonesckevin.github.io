document.addEventListener('DOMContentLoaded',()=>{
  if (!window.downloadManager) window.downloadManager = new DownloadManager();
  let currentResult = '';
  
  async function buildBridge(e){
    if(e) e.preventDefault();
    const known = document.getElementById('known').value.trim();
    const target = document.getElementById('target').value.trim();
    const err = document.getElementById('errorDiv');
    const load = document.getElementById('loadingDiv');
    const res = document.getElementById('resultDiv');
    err.style.display='none'; res.style.display='none';
    if(!known||!target){ err.innerHTML='Enter both known and target concepts.'; err.style.display='block'; return; }
    if(!window.apiManager){ err.innerHTML='API manager not available.'; err.style.display='block'; return; }
    const key = window.apiManager.getApiKey(); if(!key){ err.innerHTML='Set API key in AI Settings.'; err.style.display='block'; return; }
    load.style.display='block';
    try{
      const messages=[
        { role:'system', content:'You are a teacher who uses analogies and stepwise scaffolding.'},
        { role:'user', content:`Known: ${known}\nTarget: ${target}\nReturn: 1) bridging analogy, 2) 3-step explanation ladder, 3) a quick practice exercise, 4) one misconception to avoid.` }
      ];
      const response = await apiManager.makeRequest(messages,{ provider:'anthropic', apiKey:key, model:'claude-4-sonnet-20250514', maxTokens:900, temperature:0.3 });
      currentResult = response;
      downloadManager.setContent(response, 'markdown');
      load.style.display='none'; res.style.display='block'; res.innerHTML=`<div class='result-display'>${window.utils?window.utils.formatMarkdown(response):response}</div>${downloadManager.createDownloadButtons('concept-bridge')}`; res.scrollIntoView({behavior:'smooth'});
    }catch(ex){ load.style.display='none'; err.innerHTML=`<div style='color:#ff6666;'>${ex.message||'Generation failed'}</div>`; err.style.display='block'; }
  }
  window.buildBridge = buildBridge;
});
