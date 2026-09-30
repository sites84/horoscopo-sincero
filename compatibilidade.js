(() => {
  const signos=["ÁRIES","TOURO","GÊMEOS","CÂNCER","LEÃO","VIRGEM","LIBRA","ESCORPIÃO","SAGITÁRIO","CAPRICÓRNIO","AQUÁRIO","PEIXES"];
  const elementos={ARIES:"Fogo",TOURO:"Terra",GEMEOS:"Ar",CANCER:"Água",LEAO:"Fogo",VIRGEM:"Terra",LIBRA:"Ar",ESCORPIAO:"Água",SAGITARIO:"Fogo",CAPRICORNIO:"Terra",AQUARIO:"Ar",PEIXES:"Água"};
  const frases={Fogo:{Fogo:"Vocês têm combustível de sobra. O problema é descobrir quem vai apagar o incêndio depois.",Terra:"Um quer agir agora, o outro quer conferir três vezes. Dá certo, desde que ninguém chame isso de espontaneidade.",Ar:"Conversa não falta. O risco é os dois mudarem de assunto antes de resolver o primeiro.",Água:"Um fala na lata, o outro guarda a frase por seis meses. Comunicação exige cuidado aqui."},Terra:{Fogo:"Um acelera, o outro pergunta se precisava mesmo. A química existe, mas o calendário sofre.",Terra:"Vocês entendem rotina, conforto e teimosia. O problema é quando os dois descobrem que nenhum vai ceder.",Ar:"Um quer estabilidade, o outro quer experimentar. Negociem antes que o restaurante novo vire discussão diplomática.",Água:"Existe acolhimento e estabilidade. Só não transformem cuidado em controle."},Ar:{Fogo:"Conversa, curiosidade e decisões impulsivas. Pode ser ótimo até alguém lembrar que promessa também precisa de execução.",Terra:"Um pensa em possibilidades, o outro em consequências. Se respeitarem o ritmo, funciona melhor do que parece.",Ar:"Vocês conseguem conversar por horas sobre absolutamente tudo. Resolver o que importa já é outra história.",Água:"Um racionaliza, o outro sente. O desafio é não transformar cada conversa em tradução simultânea."},Água:{Fogo:"Sentimento encontra pressa. Pode render paixão ou uma discussão às 23h47 sobre uma frase dita às 18h.",Terra:"Existe acolhimento e estabilidade. Só cuidem para proteção não virar cobrança disfarçada.",Ar:"Um sente nas entrelinhas, o outro pergunta se existe mesmo uma entrelinha. Paciência será útil.",Água:"Vocês percebem até o silêncio do outro. Às vezes percebem demais e inventam problema onde só havia sono."}};
  const normalizar=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
  function montar(){
    if(document.getElementById("compatibilidadeBox"))return;
    const box=document.createElement("section");box.id="compatibilidadeBox";box.className="context-box compatibility-box";
    box.innerHTML=`<h2>❤️ COMPATIBILIDADE SINCERA</h2><p class="hint">Escolha dois signos. Madame Verônica já está preparando o constrangimento.</p><div class="compat-grid"><select id="compat1"><option value="">Seu signo</option>${signos.map(s=>`<option>${s}</option>`).join("")}</select><select id="compat2"><option value="">Outro signo</option>${signos.map(s=>`<option>${s}</option>`).join("")}</select></div><button id="compatBtn" class="primary-btn" type="button">❤️ VER A COMPATIBILIDADE</button><div id="compatResult" class="compat-result"></div>`;
    const result=document.getElementById("result");
    if(result) result.after(box); else document.querySelector(".context-box")?.after(box);
    document.getElementById("compatBtn").addEventListener("click",()=>{
      const a=normalizar(document.getElementById("compat1").value),b=normalizar(document.getElementById("compat2").value),out=document.getElementById("compatResult");
      if(!a||!b){out.textContent="Escolhe os dois signos primeiro, criatura.";return;}
      const ea=elementos[a],eb=elementos[b];
      if(!ea||!eb){out.textContent="Madame Verônica perdeu os signos por cinco minutos. Tenta de novo.";return;}
      window.horoscopoLoading?.show("Madame Verônica está comparando os dois signos...");
      setTimeout(()=>{out.innerHTML=`<p><strong>${a} + ${b}</strong></p><p>${frases[ea][eb]}</p>`;window.horoscopoLoading?.hide();},700);
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",montar);else montar();
})();
