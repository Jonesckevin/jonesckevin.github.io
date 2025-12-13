document.addEventListener('DOMContentLoaded', () => {
  let currentResult = '';
  if (!window.apiManager) window.apiManager = new APIManager();
  if (!window.downloadManager) window.downloadManager = new DownloadManager();

  // Register standardized copy/download actions
  utils.registerToolActions('cron-expression-builder', () => currentResult);

  const form = document.getElementById('cronForm');
  const resultDiv = document.getElementById('resultDiv');
  const errorDiv = document.getElementById('errorDiv');
  const loadingDiv = document.getElementById('loadingDiv');
  const resultContent = document.getElementById('resultContent');

  form.addEventListener('submit', onSubmit);

  function clearErrors(){ errorDiv.style.display='none'; errorDiv.innerHTML=''; }
  function showLoading(msg='Building cron...'){ loadingDiv.innerHTML = `<div style='color:#ff6b35;'>${msg}</div>`; loadingDiv.style.display='block'; }
  function hideLoading(){ loadingDiv.style.display='none'; }

  async function onSubmit(e){
    if(e) e.preventDefault();
    const apiKey = window.apiManager?.getApiKey?.();
    if(!apiKey){ utils.showError(errorDiv, 'Set your API key via the ⚙️ settings menu.'); return; }

    const desc = document.getElementById('scheduleDesc').value.trim();
    const tz = document.getElementById('tz').value.trim() || 'UTC';
    const examplesCount = parseInt(document.getElementById('examples').value,10) || 5;
    if(!desc){ utils.showError(errorDiv, 'Schedule description required.'); return; }

    clearErrors(); resultDiv.style.display='none'; showLoading();

    try {
      const system = `You are an expert in cron scheduling. Convert the natural language schedule into ONE cron expression (standard 5-field unless clearly needs seconds). Create a bash commandline to create this cron job. Then output using this Markdown template:\n\n`+
      `## Cron Expression\n\nExpression: <CRON>\nTime Zone: ${tz}\n\n## Explanation\nBreak down each field meaning.\n\n## Next Runs (approx)\nList ${examplesCount} upcoming run times starting from now (${tz}).\n\nIf ambiguous, choose the most common interpretation and note assumptions.`;

      const response = await apiManager.makeRequest([
        { role: 'system', content: system },
        { role: 'user', content: `Schedule: ${desc}\nTZ: ${tz}` }
      ], { maxTokens: 900, temperature: 0.3 });

      currentResult = response;
      displayResults(response);
      hideLoading();
      resultDiv.style.display='block';
      resultDiv.scrollIntoView({behavior:'smooth'});
    } catch(err){ hideLoading(); utils.showError(errorDiv, 'Failed: '+(err.message||err)); }
  }

  function displayResults(md){
    window.downloadManager.setContent(md,'markdown');
    resultContent.innerHTML = window.downloadManager.currentContent.html;
  }
});
