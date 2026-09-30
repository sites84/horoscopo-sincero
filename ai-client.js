(() => {
  const slugPorNome = {
    "ÁRIES":"aries","TOURO":"touro","GÊMEOS":"gemeos","CÂNCER":"cancer","LEÃO":"leao","VIRGEM":"virgem","LIBRA":"libra","ESCORPIÃO":"escorpiao","SAGITÁRIO":"sagitario","CAPRICÓRNIO":"capricornio","AQUÁRIO":"aquario","PEIXES":"peixes"
  };
  const elementoPorSigno = {
    aries:"Fogo", leao:"Fogo", sagitario:"Fogo",
    touro:"Terra", virgem:"Terra", capricornio:"Terra",
    gemeos:"Ar", libra:"Ar", aquario:"Ar",
    cancer:"Água", escorpiao:"Água", peixes:"Água"
  };
  const API_URL = "https://horoscopo-sincero.edsonfernandesvet.workers.dev/gerar-horoscopo";

  function descobrirSigno() {
    const botoes = [...document.querySelectorAll("#zodiacGrid button")];
    const ativo = botoes.find(b => b.classList.contains("active") || b.classList.contains("selected") || b.getAttribute("aria-pressed") === "true");
    const botao = ativo || botoes.find(b => b.dataset.selected === "true");
    if (!botao) return null;
    const bruto = String(botao.dataset.signo || botao.dataset.sign || botao.dataset.value || botao.textContent || "").trim();
    const nome = bruto.toUpperCase().replace(/\s+/g, " ").split("\n")[0].trim();
    const slug = slugPorNome[nome] || Object.keys(slugPorNome).find(n => bruto.toUpperCase().includes(n));
    return slug ? { slug, nome: Object.keys(slugPorNome).find(n => slugPorNome[n] === slug), elemento: elementoPorSigno[slug] } : null;
  }

  function escapar(texto) {
    return String(texto || "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  }

  async function gerar() {
    const signo = descobrirSigno();
    const contextoEl = document.getElementById("context");
    const resultado = document.getElementById("result");
    if (!signo || !resultado) return;

    const botao = document.getElementById("generateBtn");
    const textoOriginal = botao ? botao.innerHTML : "🔮 FALAR A VERDADE";
    if (botao) { botao.disabled = true; botao.innerHTML = "🔮 Madame está pensando..."; }
    resultado.classList.remove("hidden");
    resultado.innerHTML = '<div class="loading">Madame Verônica está consultando o universo. E a sua ficha criminal emocional.</div>';
    resultado.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signo: signo.nome, elemento: signo.elemento, contexto: contextoEl ? contextoEl.value : "" })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || "Erro ao gerar horóscopo.");

      resultado.innerHTML = `
        <article class="horoscope-card">
          <h2>🔮 HORÓSCOPO SINCERO POR MADAME VERÔNICA</h2>
          <p><em>Porque alguém precisava te contar a verdade.</em></p>
          <p><strong>Signo:</strong> ${escapar(signo.nome)} ${escapar((document.querySelector(`#zodiacGrid button.active, #zodiacGrid button.selected`) || {}).textContent || "")}</p>
          <p><strong>Elemento:</strong> ${escapar(signo.elemento)} | <strong>Nível de Sinceridade:</strong> Brutal</p>
          <hr>
          <h3>💀 A VERDADE QUE NINGUÉM TE CONTA:</h3><p>${escapar(dados.verdade)}</p>
          <h3>🔥 SEU SUPERPODER:</h3><p>Seu signo sabe usar suas próprias características a favor — quando não deixa o defeito assumir o volante.</p>
          <h3>🚩 SEU DEFEITO FATAL:</h3><p>${escapar(dados.exposicao)}</p>
          <h3>📅 PREVISÃO SINCERA DA SEMANA:</h3><p>${escapar(dados.semana)}</p>
          <h3>☀️ HORÓSCOPO DE HOJE:</h3><p>${escapar(dados.diario)}</p>
          <h3>💬 CONSELHO QUE VOCÊ VAI IGNORAR:</h3><p>${escapar(dados.conselho)}</p>
          <h3>🎯 COMPATIBILIDADE SEM MENTIRA:</h3><p>Madame deixou a compatibilidade para a próxima rodada. Primeiro sobreviva à exposição.</p>
          <p class="quote"><strong>💥 MAIS UMA EXPOSIÇÃO:</strong> ${escapar(dados.frase)}</p>
        </article>`;
    } catch (erro) {
      resultado.innerHTML = `<div class="error-box">Não consegui falar com Madame Verônica agora.<br><small>${escapar(erro.message)}</small></div>`;
    } finally {
      if (botao) { botao.disabled = false; botao.innerHTML = textoOriginal; }
    }
  }

  document.addEventListener("click", event => {
    const botao = event.target.closest("#generateBtn");
    if (!botao) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    gerar();
  }, true);
})();
