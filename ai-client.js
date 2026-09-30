(() => {
  const nomes = ["ÁRIES","TOURO","GÊMEOS","CÂNCER","LEÃO","VIRGEM","LIBRA","ESCORPIÃO","SAGITÁRIO","CAPRICÓRNIO","AQUÁRIO","PEIXES"];
  const slugPorNome = {"ÁRIES":"aries","TOURO":"touro","GÊMEOS":"gemeos","CÂNCER":"cancer","LEÃO":"leao","VIRGEM":"virgem","LIBRA":"libra","ESCORPIÃO":"escorpiao","SAGITÁRIO":"sagitario","CAPRICÓRNIO":"capricornio","AQUÁRIO":"aquario","PEIXES":"peixes"};
  const elementoPorSigno = {aries:"Fogo", leao:"Fogo", sagitario:"Fogo", touro:"Terra", virgem:"Terra", capricornio:"Terra", gemeos:"Ar", libra:"Ar", aquario:"Ar", cancer:"Água", escorpiao:"Água", peixes:"Água"};
  const API_URL = "https://horoscopo-sincero.edsonfernandesvet.workers.dev/gerar-horoscopo";
  let signoSelecionado = null;

  function normalizar(texto) { return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, " ").trim(); }
  function porNome(nome) { const n = normalizar(nome); const encontrado = nomes.find(x => normalizar(x) === n); if (!encontrado) return null; const slug = slugPorNome[encontrado]; return { slug, nome: encontrado, elemento: elementoPorSigno[slug] }; }
  function identificarElemento(el) { if (!el) return null; const dados = [el.dataset?.signo, el.dataset?.sign, el.dataset?.value, el.getAttribute?.("aria-label")].filter(Boolean); for (const valor of dados) { const direto = porNome(valor); if (direto) return direto; } return null; }
  function identificarBotao(botao) {
    const direto = identificarElemento(botao); if (direto) return direto;
    const grid = document.getElementById("zodiacGrid"); if (!grid || !botao) return null;
    const botoes = [...grid.querySelectorAll("button")]; const indice = botoes.indexOf(botao);
    if (indice >= 0 && indice < nomes.length) return porNome(nomes[indice]);
    return porNome(normalizar(botao.textContent));
  }
  function marcarBotoes() {
    const grid = document.getElementById("zodiacGrid"); if (!grid) return;
    [...grid.querySelectorAll("button")].forEach((botao, indice) => {
      const dado = porNome(nomes[indice]);
      if (dado) { botao.dataset.signo = dado.nome; botao.dataset.sign = dado.nome; botao.dataset.elemento = dado.elemento; }
    });
  }
  function registrarSelecao(event) {
    const grid = document.getElementById("zodiacGrid"); if (!grid || !grid.contains(event.target)) return;
    marcarBotoes(); const botao = event.target.closest("button,[role='button']"); const encontrado = identificarBotao(botao);
    if (encontrado) { signoSelecionado = encontrado; window.__signoSelecionado = encontrado; }
  }
  document.addEventListener("click", registrarSelecao, true);
  setTimeout(marcarBotoes, 0);

  function descobrirSigno() {
    if (signoSelecionado) return signoSelecionado;
    if (window.__signoSelecionado) return window.__signoSelecionado;
    marcarBotoes(); const grid = document.getElementById("zodiacGrid"); if (!grid) return null;
    const ativo = grid.querySelector(".active,.selected,[aria-selected='true'],[aria-pressed='true'],[data-selected='true']"); return identificarBotao(ativo);
  }
  function perfilDoSigno(slug) {
    try { if (typeof signos !== "undefined" && signos[slug]) { const s = signos[slug]; return { verdade: s.verdade || "", super: s.super || "", defeito: s.defeito || "", semana: s.semana || "" }; } } catch (_) {}
    return {};
  }
  function fallbackLocal(signo) {
    const s = typeof signos !== "undefined" ? signos[signo.slug] : null;
    if (!s) return null;
    return {
      verdade: s.verdade || "",
      superpoder: s.super || "",
      defeito: s.defeito || "",
      semana: s.semana || "",
      diario: s.semana || "",
      frase: s.verdade ? s.verdade.split(/[.!?]/)[0].trim() : "",
      exposicao: s.defeito || "",
      conselho: s.conselho || ""
    };
  }
  function escapar(t) { return String(t || "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
  function quebrarTexto(ctx, texto, maxWidth) { const palavras = String(texto || "").split(/\s+/); const linhas = []; let linha = ""; for (const palavra of palavras) { const teste = linha ? `${linha} ${palavra}` : palavra; if (ctx.measureText(teste).width > maxWidth && linha) { linhas.push(linha); linha = palavra; } else linha = teste; } if (linha) linhas.push(linha); return linhas; }

  async function criarImagemCompartilhamento(signo, elemento, dados) {
    const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1920; const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920); grad.addColorStop(0, "#45205b"); grad.addColorStop(.42, "#160b22"); grad.addColorStop(1, "#100817"); ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1920);
    const glow = ctx.createRadialGradient(540, 80, 20, 540, 80, 650); glow.addColorStop(0, "rgba(245,201,106,.24)"); glow.addColorStop(1, "rgba(245,201,106,0)"); ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 800);
    ctx.textAlign = "center"; ctx.fillStyle = "#f5c96a"; ctx.font = "700 30px Arial"; ctx.fillText("MADAME VERÔNICA", 540, 90); ctx.fillStyle = "#fff8ff"; ctx.font = "800 68px Arial"; ctx.fillText(signo, 540, 175); ctx.fillStyle = "#cbbbd0"; ctx.font = "500 27px Arial"; ctx.fillText(`${elemento} • NÍVEL DE SINCERIDADE: BRUTAL`, 540, 225);
    let y = 300; const secoes = [["A VERDADE QUE NINGUÉM TE CONTA", dados.verdade],["SEU SUPERPODER", dados.superpoder],["SEU DEFEITO FATAL", dados.defeito],["PREVISÃO SINCERA DA SEMANA", dados.semana]]; ctx.textAlign = "left";
    for (const [titulo, texto] of secoes) { ctx.fillStyle = "#f5c96a"; ctx.font = "700 25px Arial"; ctx.fillText(titulo, 70, y); y += 43; ctx.fillStyle = "#fff8ff"; ctx.font = "500 29px Arial"; const linhas = quebrarTexto(ctx, texto, 940); for (const linha of linhas) { ctx.fillText(linha, 70, y); y += 39; } y += 35; if (y > 1690) break; }
    ctx.fillStyle = "rgba(232,90,173,.12)"; ctx.fillRect(55, 1740, 970, 105); ctx.fillStyle = "#ffe6a3"; ctx.font = "700 24px Arial"; ctx.fillText("📌 FRASE DO DIA", 80, 1780); ctx.fillStyle = "#fff8ff"; ctx.font = "500 25px Arial"; const frase = quebrarTexto(ctx, dados.frase, 650).slice(0, 2); frase.forEach((l, i) => ctx.fillText(l, 80, 1817 + i * 32)); ctx.textAlign = "center"; ctx.fillStyle = "#88788e"; ctx.font = "500 20px Arial"; ctx.fillText("Horóscopo Sincero • Madame Verônica", 540, 1885);
    return new Promise(resolve => canvas.toBlob(resolve, "image/png", 1));
  }
  async function compartilharImagem(signo, elemento, dados) { const blob = await criarImagemCompartilhamento(signo, elemento, dados); if (!blob) throw new Error("Não foi possível criar a imagem."); const arquivo = new File([blob], `horoscopo-sincero-${slugPorNome[signo] || "signo"}.png`, { type: "image/png" }); if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [arquivo] }))) { await navigator.share({ title: `Horóscopo Sincero — ${signo}`, text: "Madame Verônica acabou de me expor.", files: [arquivo] }); return; } const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = arquivo.name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }

  function renderizar(resultado, signo, dados) {
    resultado.innerHTML = `<article class="horoscope-card"><h2>🔮 HORÓSCOPO SINCERO POR MADAME VERÔNICA</h2><p><em>Porque alguém precisava te contar a verdade.</em></p><p><strong>Signo:</strong> ${escapar(signo.nome)}</p><p><strong>Elemento:</strong> ${escapar(signo.elemento)} | <strong>Nível de Sinceridade:</strong> Brutal</p><hr><h3>💀 A VERDADE QUE NINGUÉM TE CONTA:</h3><p>${escapar(dados.verdade)}</p><h3>🔥 SEU SUPERPODER:</h3><p>${escapar(dados.superpoder)}</p><h3>🚩 SEU DEFEITO FATAL:</h3><p>${escapar(dados.defeito)}</p><h3>📅 PREVISÃO SINCERA DA SEMANA:</h3><p>${escapar(dados.semana)}</p><h3>☀️ HORÓSCOPO DE HOJE:</h3><p>${escapar(dados.diario)}</p><h3>💬 CONSELHO QUE VOCÊ VAI IGNORAR:</h3><p>${escapar(dados.conselho)}</p><p class="quote"><strong>💥 MAIS UMA EXPOSIÇÃO:</strong> ${escapar(dados.exposicao)}</p><p class="quote"><strong>📌 FRASE DO DIA:</strong> ${escapar(dados.frase)}</p><button id="shareImageBtn" class="share-btn" type="button">📲 Compartilhar como imagem</button></article>`;
    document.getElementById("shareImageBtn")?.addEventListener("click", async () => { const b = document.getElementById("shareImageBtn"); const original = b.innerHTML; try { b.disabled = true; b.innerHTML = "🖼️ Preparando imagem..."; await compartilharImagem(signo.nome, signo.elemento, dados); } catch (e) { if (e?.name !== "AbortError") alert("Não consegui preparar o compartilhamento agora."); } finally { b.disabled = false; b.innerHTML = original; } });
  }

  async function gerar() {
    const signo = descobrirSigno(); const contexto = document.getElementById("context"); const resultado = document.getElementById("result"); if (!resultado) return;
    if (!signo) { resultado.classList.remove("hidden"); resultado.innerHTML = '<div class="error-box">🔮 Primeiro escolha seu signo, criatura cósmica.</div>'; return; }
    const botao = document.getElementById("generateBtn"); const original = botao?.innerHTML; if (botao) { botao.disabled = true; botao.innerHTML = "🔮 Madame está pensando..."; }
    resultado.classList.remove("hidden"); resultado.innerHTML = '<div class="loading">Madame Verônica está consultando o universo. E a sua ficha criminal emocional.</div>';
    try {
      const r = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ signo: signo.nome, elemento: signo.elemento, contexto: contexto?.value || "", perfil: perfilDoSigno(signo.slug) }) });
      const text = await r.text(); let dados; try { dados = JSON.parse(text); } catch { throw new Error(`Resposta inválida do servidor (HTTP ${r.status}).`); }
      if (!r.ok) throw new Error(dados.detail ? `${dados.error || "Erro do servidor."} ${dados.detail}` : (dados.error || "Erro ao gerar horóscopo."));
      renderizar(resultado, signo, dados);
    } catch (e) {
      const local = fallbackLocal(signo);
      if (local && local.verdade && local.superpoder && local.defeito && local.semana) {
        renderizar(resultado, signo, local);
      } else {
        resultado.innerHTML = `<div class="error-box">Não consegui falar com Madame Verônica agora.<br><small>${escapar(e.message || "Falha de comunicação com o servidor.")}</small></div>`;
      }
    } finally { if (botao) { botao.disabled = false; botao.innerHTML = original; } }
  }

  document.addEventListener("click", event => { const b = event.target.closest("#generateBtn"); if (!b) return; event.preventDefault(); event.stopImmediatePropagation(); gerar(); }, true);
})();
