(() => {
  const API_URL = "https://horoscopo-sincero.edsonfernandesvet.workers.dev/gerar-horoscopo";

  function adicionarBotao() {
    const card = document.querySelector(".horoscope-card");
    if (!card || card.querySelector("#meExpoeBtn")) return;
    const share = card.querySelector("#shareImageBtn");
    const btn = document.createElement("button");
    btn.id = "meExpoeBtn";
    btn.className = "share-btn";
    btn.type = "button";
    btn.textContent = "💀 Me expõe mais";
    btn.addEventListener("click", gerarNovaExposicao);
    if (share) share.insertAdjacentElement("beforebegin", btn);
    else card.appendChild(btn);
  }

  async function gerarNovaExposicao() {
    const btn = document.getElementById("meExpoeBtn");
    const atual = document.querySelector(".horoscope-card .quote strong")?.parentElement;
    const signo = window.__signoSelecionado;
    const contexto = document.getElementById("context")?.value || "";
    if (!btn || !signo) return;

    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "💀 Madame está procurando outra coisa para jogar na sua cara...";

    try {
      const r = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signo: signo.nome,
          elemento: signo.elemento,
          contexto,
          perfil: {},
          modo: "exposicao"
        })
      });
      const data = await r.json();
      if (!r.ok || !data.exposicao) throw new Error(data.detail || data.error || "Não foi possível gerar uma nova exposição.");

      const exposicao = [...document.querySelectorAll(".horoscope-card .quote")]
        .find(el => /MAIS UMA EXPOSIÇÃO/i.test(el.textContent));
      if (exposicao) exposicao.innerHTML = `<strong>💥 MAIS UMA EXPOSIÇÃO:</strong> ${escapar(data.exposicao)}`;
      btn.textContent = "💀 Me expõe de novo";
    } catch (error) {
      btn.textContent = "💀 Tentar me expor de novo";
      alert("Madame não conseguiu achar outra coisa para jogar na sua cara agora.");
    } finally {
      btn.disabled = false;
      if (btn.textContent === original) btn.textContent = original;
    }
  }

  function escapar(texto) {
    return String(texto || "").replace(/[&<>\"]/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"
    }[c]));
  }

  const observer = new MutationObserver(adicionarBotao);
  observer.observe(document.body, { childList: true, subtree: true });
  adicionarBotao();
})();
