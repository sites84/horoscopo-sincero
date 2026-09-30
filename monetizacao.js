(() => {
  const PIX = "00020101021126330014BR.GOV.BCB.PIX0111308810008415204000053039865802BR5921Edson Lopes Fernandes6009SAO PAULO62080504daqr63042D44";
  function iniciar() {
    const btn = document.getElementById("copyPixBtn");
    const status = document.getElementById("pixCopied");
    if (btn) btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(PIX);
        if (status) status.textContent = "Pix copiado.";
      } catch (_) {
        const area = document.createElement("textarea");
        area.value = PIX; document.body.appendChild(area); area.select();
        document.execCommand("copy"); area.remove();
        if (status) status.textContent = "Pix copiado.";
      }
      setTimeout(() => { if (status) status.textContent = ""; }, 2500);
    });
    const hoje = new Date().toISOString().slice(0,10);
    if (localStorage.getItem("horoscopoSinceroPopup") !== hoje) {
      const overlay = document.createElement("div"); overlay.className = "daily-popup";
      overlay.innerHTML = `<div class="daily-popup-card"><div class="crystal">🔮</div><h2>Antes de entrar, uma coisa</h2><p>O Horóscopo Sincero gera uma leitura diferente para o seu signo, permite adicionar contexto, consultar a previsão do dia, conferir compatibilidade e compartilhar sua leitura como imagem.</p><p>Continue para conhecer a página que ajuda a manter este projeto no ar.</p><button id="continueSiteBtn" class="primary-btn">CONTINUAR</button></div>`;
      document.body.appendChild(overlay);
      document.body.classList.add("popup-locked");
      document.getElementById("continueSiteBtn").addEventListener("click", () => {
        localStorage.setItem("horoscopoSinceroPopup", hoje);
        window.open("https://s.shopee.com.br/9KiKsrOPFh", "_blank", "noopener,noreferrer");
        overlay.remove(); document.body.classList.remove("popup-locked");
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
