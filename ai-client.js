(() => {
  const nomes = ["ÁRIES","TOURO","GÊMEOS","CÂNCER","LEÃO","VIRGEM","LIBRA","ESCORPIÃO","SAGITÁRIO","CAPRICÓRNIO","AQUÁRIO","PEIXES"];
  const slugPorNome = {"ÁRIES":"aries","TOURO":"touro","GÊMEOS":"gemeos","CÂNCER":"cancer","LEÃO":"leao","VIRGEM":"virgem","LIBRA":"libra","ESCORPIÃO":"escorpiao","SAGITÁRIO":"sagitario","CAPRICÓRNIO":"capricornio","AQUÁRIO":"aquario","PEIXES":"peixes"};
  const elementoPorSigno = {aries:"Fogo", leao:"Fogo", sagitario:"Fogo", touro:"Terra", virgem:"Terra", capricornio:"Terra", gemeos:"Ar", libra:"Ar", aquario:"Ar", cancer:"Água", escorpiao:"Água", peixes:"Água"};
  const API_URL = "https://horoscopo-sincero.edsonfernandesvet.workers.dev/gerar-horoscopo";
  function identificar(el) {
    if (!el) return null;
    const texto = String([el.dataset?.signo,el.dataset?.sign,el.dataset?.value,el.textContent].filter(Boolean).join(" ")).toUpperCase().replace(/\s+/g," ");
    const nome = nomes.find(n => texto.includes(n));
    if (!nome) return null;
    const slug = slugPorNome[nome];
    return {slug,nome,elemento:elementoPorSigno[slug]};
  }
  document.addEventListener("click", event => {
    let el = event.target;
    for (let i=0; el && i<8; i++, el=el.parentElement) {
      if (el.id === "zodiacGrid") break;
      const signo = identificar(el);
      if (signo) { window.__signoSelecionado = signo; break; }
    }
  }, true);
  function descobrirSigno() {
    if (window.__signoSelecionado) return window.__signoSelecionado;
    const grid = document.getElementById("zodiacGrid");
    if (!grid) return null;
    return identificar(grid.querySelector(".active,.selected,[aria-pressed='true'],[data-selected='true']"));
  }
  function escapar(t) { return String(t||"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
  async function gerar() {
    const signo=descobrirSigno(), contexto=document.getElementById("context"), resultado=document.getElementById("result");
    if(!resultado) return;
    if(!signo){resultado.classList.remove("hidden");resultado.innerHTML='<div class="error-box">🔮 Primeiro escolha seu signo, criatura cósmica.</div>';return;}
    const botao=document.getElementById("generateBtn"), original=botao?.innerHTML;
    if(botao){botao.disabled=true;botao.innerHTML="🔮 Madame está pensando...";}
    resultado.classList.remove("hidden");resultado.innerHTML='<div class="loading">Madame Verônica está consultando o universo. E a sua ficha criminal emocional.</div>';
    try{
      const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({signo:signo.nome,elemento:signo.elemento,contexto:contexto?.value||""})});
      const text=await r.text(); let dados; try{dados=JSON.parse(text);}catch{throw new Error("A resposta do servidor não é JSON válido.");}
      if(!r.ok) throw new Error(dados.error||"Erro ao gerar horóscopo.");
      resultado.innerHTML=`<article class="horoscope-card"><h2>🔮 HORÓSCOPO SINCERO POR MADAME VERÔNICA</h2><p><em>Porque alguém precisava te contar a verdade.</em></p><p><strong>Signo:</strong> ${escapar(signo.nome)}</p><p><strong>Elemento:</strong> ${escapar(signo.elemento)} | <strong>Nível de Sinceridade:</strong> Brutal</p><hr><h3>💀 A VERDADE QUE NINGUÉM TE CONTA:</h3><p>${escapar(dados.verdade)}</p><h3>🔥 SEU SUPERPODER:</h3><p>${escapar(dados.super)}</p><h3>🚩 SEU DEFEITO FATAL:</h3><p>${escapar(dados.exposicao)}</p><h3>📅 PREVISÃO SINCERA DA SEMANA:</h3><p>${escapar(dados.semana)}</p><h3>☀️ HORÓSCOPO DE HOJE:</h3><p>${escapar(dados.diario)}</p><h3>💬 CONSELHO QUE VOCÊ VAI IGNORAR:</h3><p>${escapar(dados.conselho)}</p><p class="quote"><strong>💥 MAIS UMA EXPOSIÇÃO:</strong> ${escapar(dados.frase)}</p></article>`;
    }catch(e){resultado.innerHTML=`<div class="error-box">Não consegui falar com Madame Verônica agora.<br><small>${escapar(e.message)}</small></div>`;}finally{if(botao){botao.disabled=false;botao.innerHTML=original;}}
  }
  document.addEventListener("click",event=>{const b=event.target.closest("#generateBtn");if(!b)return;event.preventDefault();event.stopImmediatePropagation();gerar();},true);
})();
