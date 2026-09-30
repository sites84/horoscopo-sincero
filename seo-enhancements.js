(() => {
  const frases = {
    ARIES:["Você chama de coragem. Às vezes era só falta de paciência.","Áries não espera a situação melhorar. Já piorou por conta própria.","Seu plano tinha começo, meio e fim. Você só começou.","Você não precisa ganhar toda discussão. Mas vai tentar mesmo assim."],
    TOURO:["Você não é teimoso. Você só demora muito para admitir que a outra pessoa estava certa.","Touro chama de estabilidade aquilo que o resto da humanidade chama de não querer mudar.","Você disse que não gastaria. A comida pediu e você obedeceu.","Seu restaurante de sempre já conhece seu pedido melhor que muita gente conhece você."],
    GÊMEOS:["Você não mudou de assunto. Seu cérebro só abriu outra aba sem fechar a anterior.","Gêmeos responde rápido quando é fofoca. Para mensagem importante, precisa de investigação.","Você tem opinião sobre tudo e provavelmente já mudou a de três assuntos hoje.","Seu WhatsApp parece uma central de atendimento sem horário de expediente."],
    CÂNCER:["Você não guarda rancor. Guarda detalhes, datas, prints e contexto.","Câncer diz que superou enquanto sabe exatamente onde está a foto do ex.","Você perguntou se estava tudo bem já esperando uma resposta específica.","Seu arquivo emocional tem documentos que deveriam ter sido eliminados em 2019."],
    LEÃO:["Você não quer atenção. Só acha curioso quando ninguém percebe que você chegou.","Leão diz que não liga para curtida e confere quem viu o story.","Você recebeu um elogio há seis meses e ainda está usando mentalmente.","Ignorar Leão é uma forma eficiente de iniciar uma investigação."],
    VIRGEM:["Você chama de organização porque admitir ansiedade seria inconveniente.","Virgem encontra um erro que ninguém viu e fica pessoalmente ofendido com a existência dele.","Você fez uma lista para organizar a lista que estava desorganizada.","Seu descanso começa quando você termina de organizar o descanso."],
    LIBRA:["Você não está indeciso. Está esperando a decisão perfeita cair do céu.","Libra pede opinião de três pessoas e continua sem escolher.","Você diz 'tanto faz' com uma preferência muito específica na cabeça.","Seu pedido no restaurante já esfriou enquanto você avaliava as opções."],
    ESCORPIÃO:["Você não investiga. Apenas sabe coisas que ninguém lembra de ter contado.","Escorpião diz que não está com ciúme enquanto abre o perfil da pessoa pela quarta vez.","Você perdoa, mas seu cérebro arquiva em qualidade 4K.","Sua intuição às vezes é excelente. Às vezes é só uma teoria com boa apresentação."],
    SAGITÁRIO:["Você disse 'bora' antes de perguntar onde, quando e quanto custa.","Sagitário chama de liberdade o compromisso que esqueceu de responder.","Seu plano tinha logística. Você preferiu confiar no universo e no cartão.","Você transforma uma saída rápida em uma história que começa com 'não era para acontecer isso'."],
    CAPRICÓRNIO:["Você chama de responsabilidade o hábito de não saber descansar.","Capricórnio transforma férias em planejamento estratégico.","Você pediu ajuda? Milagre. Deve estar realmente complicado.","Seu descanso tem meta, prazo e provavelmente uma planilha."],
    AQUÁRIO:["Você quer que entendam sua cabeça, mas não quer explicar como ela funciona.","Aquário some para pensar e volta quando todo mundo já desistiu da conversa.","Você discorda por princípio quando alguém diz 'sempre fizemos assim'.","Seu plano parece estranho até funcionar. Aí você age como se fosse óbvio."],
    PEIXES:["Você disse que estava tudo bem e depois criou uma trilha sonora para a situação.","Peixes sente a indireta antes de alguém decidir se era indireta.","Você não está imaginando demais. Só está imaginando mais 17 possibilidades.","Seu problema poderia durar dez minutos. Você já escreveu a versão do diretor." ]
  };
  const nomes={aries:"ÁRIES",touro:"TOURO",gemeos:"GÊMEOS",cancer:"CÂNCER",leao:"LEÃO",virgem:"VIRGEM",libra:"LIBRA",escorpiao:"ESCORPIÃO",sagitario:"SAGITÁRIO",capricornio:"CAPRICÓRNIO",aquario:"AQUÁRIO",peixes:"PEIXES"};
  const slug=n=>String(n||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z]/g,"");
  function selecionado(){const d=window.__signoSelecionado;if(d?.nome)return d.nome;return null;}
  function montarCompartilhaveis(){
    const result=document.getElementById("result");if(!result||result.dataset.enhanced)return;
    const signo=selecionado();if(!signo)return;
    const lista=frases[signo]||[];if(!lista.length)return;
    const box=document.createElement("section");box.className="shareable-box";box.innerHTML='<h3>📲 FRASES QUE DÃO VONTADE DE COMPARTILHAR</h3><p class="shareable-intro">Escolhe a que mais te representa e manda para quem precisa ler.</p><div class="shareable-list"></div>';
    const list=box.querySelector(".shareable-list");lista.slice(0,3).forEach((f,i)=>{const card=document.createElement("div");card.className="shareable-card";card.innerHTML=`<p>${f}</p><button type="button">Compartilhar frase</button>`;card.querySelector("button").addEventListener("click",async()=>{const texto=`${f}\n\n— Horóscopo Sincero por Madame Verônica`;try{if(navigator.share){await navigator.share({text:texto,title:"Horóscopo Sincero"});}else{await navigator.clipboard.writeText(texto);card.querySelector("button").textContent="Copiado";setTimeout(()=>card.querySelector("button").textContent="Compartilhar frase",1500);}}catch(e){}});list.appendChild(card);});
    result.appendChild(box);result.dataset.enhanced="1";result.classList.add("reveal-active");
  }
  function montarNavegacao(){const footer=document.querySelector("footer");if(!footer||document.getElementById("seoNav"))return;const nav=document.createElement("nav");nav.id="seoNav";nav.innerHTML='<a href="todos-os-signos.html">Todos os signos</a> · <a href="horoscopo-diario.html">Horóscopo diário</a>';footer.prepend(nav);}
  const observer=new MutationObserver(()=>setTimeout(montarCompartilhaveis,30));
  const result=document.getElementById("result");if(result)observer.observe(result,{childList:true,subtree:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",montarNavegacao);else montarNavegacao();
})();
