(() => {
  const nomes = ["ÁRIES","TOURO","GÊMEOS","CÂNCER","LEÃO","VIRGEM","LIBRA","ESCORPIÃO","SAGITÁRIO","CAPRICÓRNIO","AQUÁRIO","PEIXES"];
  const slugPorNome = {"ÁRIES":"aries","TOURO":"touro","GÊMEOS":"gemeos","CÂNCER":"cancer","LEÃO":"leao","VIRGEM":"virgem","LIBRA":"libra","ESCORPIÃO":"escorpiao","SAGITÁRIO":"sagitario","CAPRICÓRNIO":"capricornio","AQUÁRIO":"aquario","PEIXES":"peixes"};
  const elementoPorSigno = {aries:"Fogo", leao:"Fogo", sagitario:"Fogo", touro:"Terra", virgem:"Terra", capricornio:"Terra", gemeos:"Ar", libra:"Ar", aquario:"Ar", cancer:"Água", escorpiao:"Água", peixes:"Água"};
  const API_URL = "https://horoscopo-sincero.edsonfernandesvet.workers.dev/gerar-horoscopo";
  let signoSelecionado = null;

  function normalizar(texto) {
    return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
  }

  function porNome(nome) {
    const n = normalizar(nome);
    const encontrado = nomes.find(x => normalizar(x) === n);
    if (!encontrado) return null;
    const slug = slugPorNome[encontrado];
    return { slug, nome: encontrado, elemento: elementoPorSigno[slug] };
  }

  function identificarElemento(el) {
    if (!el) return null;
    const dados = [el.dataset?.signo, el.dataset?.sign, el.dataset?.value, el.getAttribute?.("aria-label")].filter(Boolean);
    for (const valor of dados) {
      const direto = porNome(valor);
      if (direto) return direto;
    }
    return null;
  }

  function identificarBotao(botao) {
    const direto = identificarElemento(botao);
    if (direto) return direto;

    const grid = document.getElementById("zodiacGrid");
    if (!grid || !botao) return null;
    const botoes = [...grid.querySelectorAll("button")];
    const indice = botoes.indexOf(botao);
    if (indice >= 0 && indice < nomes.length) return porNome(nomes[indice]);

    const texto = normalizar(botao.textContent);
    return porNome(texto);
  }

  function registrarSelecao(event) {
    const grid = document.getElementById("zodiacGrid");
    if (!grid || !grid.contains(event.target)) return;
    const botao = event.target.closest("button,[role='button']");
    const encontrado = identificarBotao(botao);
    if (encontrado) {
      signoSelecionado = encontrado;
      window.__signoSelecionado = encontrado;
    }
  }

  document.addEventListener("click", registrarSelecao, true);

  function descobrirSigno() {
    if (signoSelecionado) return signoSelecionado;
    if (window.__signoSelecionado) return window.__signoSelecionado;

    const grid = document.getElementById("zodiacGrid");
    if (!grid) return null;

    const ativo = grid.querySelector(".active,.selected,[aria-selected='true'],[aria-pressed='true'],[data-selected='true']");
    const encontrado = identificarBotao(ativo);
    if (encontrado) return encontrado;

    return null;
  }

  function perfilDoSigno(slug) {
    try {
      if (typeof signos !== "undefined" && signos[slug]) {
        const s = signos[slug];
        return { verdade: s.verdade || "", super: s.super || "", defeito: s.defeito || "", semana: s.semana || "" };
      }
    } catch (_) {}
    return {};
  }

  function escapar(t) {
    return String(t || "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  }

  async function gerar() {
    const signo = descobrirSigno();
    const contexto = document.getElementById("context");
    const resultado = document.getElementById("result");
    if (!resultado) return;

    if (!signo) {
      resultado.classList.remove("hidden");
      resultado.innerHTML = '<div class="error-box">🔮 Primeiro escolha seu signo, criatura cósmica.</div>';
      return;
    }

    const botao = document.getElementById("generateBtn");
    const original = botao?.innerHTML;
    if (botao) { botao.disabled = true; botao.innerHTML = "🔮 Madame está pensando..."; }
    resultado.classList.remove("hidden");
    resultado.innerHTML = '<div class="loading">Madame Verônica está consultando o universo. E a sua ficha criminal emocional.</div>';

    try {
      const r = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signo: signo.nome,
          elemento: signo.elemento,
          contexto: contexto?.value || "",
          perfil: perfilDoSigno(signo.slug)
        })
      });

      const text = await r.text();
      let dados;
      try { dados = JSON.parse(text); }
      catch { throw new Error(`Resposta inválida do servidor (HTTP ${r.status}).`); }
      if (!r.ok) throw new Error(dados.detail ? `${dados.error || "Erro do servidor."} ${dados.detail}` : (dados.error || "Erro ao gerar horóscopo."));

      resultado.innerHTML = `<article class="horoscope-card">
        <h2>🔮 HORÓSCOPO SINCERO POR MADAME VERÔNICA</h2>
        <p><em>Porque alguém precisava te contar a verdade.</em></p>
        <p><strong>Signo:</strong> ${escapar(signo.nome)}</p>
        <p><strong>Elemento:</strong> ${escapar(signo.elemento)} | <strong>Nível de Sinceridade:</strong> Brutal</p>
        <hr>
        <h3>💀 A VERDADE QUE NINGUÉM TE CONTA:</h3><p>${escapar(dados.verdade)}</p>
        <h3>🔥 SEU SUPERPODER:</h3><p>${escapar(dados.superpoder)}</p>
        <h3>🚩 SEU DEFEITO FATAL:</h3><p>${escapar(dados.defeito)}</p>
        <h3>📅 PREVISÃO SINCERA DA SEMANA:</h3><p>${escapar(dados.semana)}</p>
        <h3>☀️ HORÓSCOPO DE HOJE:</h3><p>${escapar(dados.diario)}</p>
        <h3>💬 CONSELHO QUE VOCÊ VAI IGNORAR:</h3><p>${escapar(dados.conselho)}</p>
        <p class="quote"><strong>💥 MAIS UMA EXPOSIÇÃO:</strong> ${escapar(dados.exposicao)}</p>
        <p class="quote"><strong>📌 FRASE DO DIA:</strong> ${escapar(dados.frase)}</p>
      </article>`;
    } catch (e) {
      resultado.innerHTML = `<div class="error-box">Não consegui falar com Madame Verônica agora.<br><small>${escapar(e.message || "Falha de comunicação com o servidor.")}</small></div>`;
    } finally {
      if (botao) { botao.disabled = false; botao.innerHTML = original; }
    }
  }

  document.addEventListener("click", event => {
    const b = event.target.closest("#generateBtn");
    if (!b) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    gerar();
  }, true);
})();
