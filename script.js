const signos = {
  aries:{nome:"ÁRIES",simbolo:"♈",elemento:"Fogo",super:"Você consegue transformar uma ida rápida ao mercado numa missão de vida. Quando todo mundo ainda está pensando, você já fez — às vezes sem ler as instruções.",defeito:"Você acha que impulsividade é personalidade forte. Amiga, nem toda discussão precisa de resposta imediata e nem toda ideia precisa virar projeto às 23h.",verdade:"Você começa 47 coisas com a confiança de quem vai dominar o mundo e termina algumas com a mesma velocidade com que responde 'depois eu vejo'. Briga, fala tudo o que pensa e cinco minutos depois já está mandando meme como se nada tivesse acontecido.",semana:"Na terça você vai querer resolver uma coisa que poderia esperar até amanhã. Não vai esperar. Na quarta alguém vai te irritar por uma coisa pequena e você vai criar uma tese de doutorado sobre o assunto. No fim da semana, uma ideia nova vai aparecer e você vai jurar que agora vai até o fim. Vamos observar.",combina:["LEÃO","porque os dois gostam de intensidade e nenhum dos dois nasceu para ficar discutindo quem manda: os dois já decidiram que são eles."],foge:["CÂNCER","porque você quer resolver tudo em cinco minutos e Câncer quer conversar sobre como se sentiu durante os últimos cinco anos."],conselho:"Antes de responder no impulso, espera dez minutos. Eu sei que isso para você parece uma eternidade, mas tenta."},
  touro:{nome:"TOURO",simbolo:"♉",elemento:"Terra",super:"Você sabe aproveitar a vida sem precisar transformar tudo numa competição. E quando decide cuidar de alguém, vira praticamente serviço de entrega emocional com comida.",defeito:"Sua teimosia já poderia ter CPF. Você percebe que está errado, fica quieto, muda de assunto e espera que o universo esqueça.",verdade:"Você chama apego de 'memória afetiva'. Aquela pessoa que saiu da sua vida há três anos ainda mora num cantinho da sua cabeça pagando aluguel atrasado. E se tiver comida envolvida, você perdoa coisas que jurou que nunca perdoaria.",semana:"Você vai adiar uma mudança porque sua rotina atual é confortável demais. Depois vai reclamar que nada muda. No meio da semana, alguém vai tentar apressar você e você vai fazer exatamente o contrário só de birra. No domingo, vai gastar dinheiro em alguma coisa que justificará como 'investimento em qualidade de vida'.",combina:["CAPRICÓRNIO","porque os dois entendem que estabilidade, comida boa e boleto pago já são praticamente uma declaração de amor."],foge:["AQUÁRIO","porque enquanto você quer saber onde vai sentar e que horas volta, Aquário ainda está tentando decidir se realmente quer ir."],conselho:"Nem toda mudança é ameaça. Às vezes você só está confortável demais para admitir que já enjoou."},
  gemeos:{nome:"GÊMEOS",simbolo:"♊",elemento:"Ar",super:"Você consegue conversar com desconhecido, motorista de aplicativo, cachorro e atendente de farmácia como se fossem amigos de infância. Informação nunca falta.",defeito:"Você tem 15 abas abertas na cabeça e nenhuma terminou de carregar. Muda de opinião, de assunto e de plano antes que os outros consigam acompanhar.",verdade:"Você tem grupo de WhatsApp para tudo e provavelmente esqueceu de responder alguém importante porque estava respondendo outra pessoa sobre uma fofoca completamente inútil. Sua curiosidade é enorme; sua capacidade de terminar o assunto original é outra história.",semana:"Uma conversa casual vai virar fofoca, que vai virar investigação, que vai virar você descobrindo uma informação que nem queria saber. Na quarta você vai prometer focar em uma coisa e, naturalmente, fará cinco. No sábado vai reencontrar alguém e falar como se tivesse visto ontem, mesmo tendo passado dois anos.",combina:["LIBRA","porque vocês conseguem transformar uma simples conversa de dez minutos em três horas sem chegar ao assunto original."],foge:["ESCORPIÃO","porque você acha que está brincando e Escorpião já abriu um dossiê sobre o que você quis dizer."],conselho:"Termina uma coisa antes de começar outra. Não precisa terminar todas hoje, mas termina pelo menos uma."},
  cancer:{nome:"CÂNCER",simbolo:"♋",elemento:"Água",super:"Você lembra de detalhes que ninguém lembra e percebe mudanças de humor antes de a pessoa abrir a boca. O problema é que às vezes percebe até o que não aconteceu.",defeito:"Você guarda mágoa com a organização de um arquivo público. Diz que está tudo bem e depois lembra exatamente do que aconteceu numa terça-feira de 2019.",verdade:"Você diz que desapegou, mas ainda sabe o aniversário da mãe do ex. Guarda foto, mensagem, presente e aquela blusa esquecida como se fosse prova de um processo judicial. E quando sente saudade, não manda mensagem: vai olhar o perfil da pessoa.",semana:"Uma lembrança antiga vai aparecer do nada e você vai passar tempo demais pensando nela. Alguém vai procurar você pedindo conselho e você vai dar um excelente conselho que deveria seguir também. No fim de semana, vai querer ficar em casa, comer alguma coisa boa e fingir que não precisa sair.",combina:["PEIXES","porque os dois conseguem sentir falta de alguém que nem está presente e ainda encontrar motivo para uma conversa de duas horas sobre isso."],foge:["ÁRIES","porque Áries quer resolver o problema agora e você ainda está explicando como se sentiu quando o problema começou."],conselho:"Nem toda lembrança precisa virar assunto atual. Guarda o carinho e solta o arquivo morto."},
  leao:{nome:"LEÃO",simbolo:"♌",elemento:"Fogo",super:"Você entra num ambiente e, mesmo quando não está tentando chamar atenção, alguém percebe. Tem presença e sabe defender quem considera seu.",defeito:"Você diz que não liga para aprovação enquanto verifica discretamente quem curtiu, quem viu e quem não comentou. Amiga, o aplicativo não mente.",verdade:"Você quer ser admirado, mas prefere fingir que simplesmente aconteceu. Quando recebe elogio, faz cara de 'imagina' por três segundos e depois lembra da frase durante seis meses. E se alguém ignorar você, aí pronto: investigação particular.",semana:"Você vai receber uma atenção que estava esperando e vai agir como se não estivesse esperando. Na quinta, uma crítica pequena vai incomodar mais do que deveria porque atingiu exatamente um ponto que você tenta esconder. No fim de semana, vai fazer algo só porque quer se sentir bem e vai ficar ótimo — mesmo que você diga que foi sem intenção.",combina:["SAGITÁRIO","porque os dois gostam de liberdade, diversão e uma plateia que saiba apreciar a história depois."],foge:["VIRGEM","porque Virgem pode apontar o detalhe que você preferia que ninguém tivesse percebido."],conselho:"Você não precisa provar seu valor toda vez que entra numa sala. Deixa algumas coisas existirem sem aplauso."},
  virgem:{nome:"VIRGEM",simbolo:"♍",elemento:"Terra",super:"Você consegue encontrar o erro que ninguém viu e ainda resolver enquanto os outros estão discutindo de quem foi a culpa.",defeito:"Você chama preocupação de planejamento. Tem uma lista para fazer a lista e provavelmente já corrigiu mentalmente este texto.",verdade:"Você fala 'não vou me estressar' enquanto reorganiza mentalmente a vida de todo mundo ao redor. Critica porque quer ajudar, ajuda porque quer controlar e controla porque, sinceramente, você acha que faria melhor.",semana:"Você vai perceber um erro que ninguém mais notou e vai ter dificuldade de deixar passar. Uma tarefa simples vai ocupar sua cabeça mais tempo do que merece. No fim da semana, você vai organizar alguma coisa que nem estava desorganizada só para recuperar a sensação de que pelo menos uma área da vida está sob controle.",combina:["TOURO","porque os dois gostam de estabilidade e ninguém vai reclamar de um jantar bom e de uma casa minimamente organizada."],foge:["LEÃO","porque você vai apontar um detalhe e Leão vai ouvir como se você tivesse declarado guerra."],conselho:"Nem todo problema precisa de solução hoje. Às vezes o mundo sobrevive perfeitamente ao seu 'depois eu arrumo'."},
  libra:{nome:"LIBRA",simbolo:"♎",elemento:"Ar",super:"Você sabe conversar sem transformar toda divergência numa guerra. Também consegue fazer qualquer ambiente parecer mais agradável sem precisar de muito esforço.",defeito:"Você demora 45 minutos para decidir o que comer e, no final, pede a mesma coisa de sempre. Sua indecisão já tem testemunhas.",verdade:"Você diz 'tanto faz' esperando que a outra pessoa escolha exatamente o que você queria. Evita conflito até quando precisa dizer não e depois reclama, em silêncio, da decisão que você mesmo deixou outra pessoa tomar.",semana:"Uma escolha pequena vai ocupar espaço demais na sua cabeça. Você vai pedir opinião para pelo menos duas pessoas e ainda ficará em dúvida. Na sexta, alguém vai pedir uma decisão simples e você vai responder 'vamos ver' com a segurança de quem sabe que não vai ver nada.",combina:["GÊMEOS","porque vocês podem conversar sobre todas as possibilidades até o restaurante fechar."],foge:["CAPRICÓRNIO","porque Capricórnio quer uma resposta objetiva enquanto você ainda está analisando os prós e contras da entrada."],conselho:"Escolhe. Uma decisão imperfeita ainda é melhor que passar a vida esperando a opção perfeita."},
  escorpiao:{nome:"ESCORPIÃO",simbolo:"♏",elemento:"Água",super:"Você percebe clima estranho antes de alguém admitir que existe clima estranho. E quando confia, leva lealdade muito a sério.",defeito:"Você diz que não está investigando, mas já viu horário online, curtida antiga e até quem segue quem. Sherlock Holmes pediria estágio.",verdade:"Você não esquece quase nada. Pode até perdoar, mas seu cérebro arquiva o acontecimento em qualidade 4K. E quando alguém diz 'não foi nada', você já sabe que foi alguma coisa.",semana:"Uma conversa vai fazer você desconfiar de algo que talvez nem seja importante. Antes de montar a teoria completa, espere a pessoa falar. Alguém do passado pode aparecer com uma mensagem e você vai analisar cada palavra como se fosse contrato. No fim da semana, vai descobrir que metade do drama estava acontecendo na sua cabeça.",combina:["CAPRICÓRNIO","porque os dois levam lealdade a sério e preferem relações que tenham conteúdo, não conversa vazia."],foge:["GÊMEOS","porque Gêmeos fala uma coisa, lembra de outra e você já está calculando se existe uma segunda intenção."],conselho:"Nem toda pessoa que não responde em dois minutos está escondendo alguma coisa. Solta o celular, criatura."},
  sagitario:{nome:"SAGITÁRIO",simbolo:"♐",elemento:"Fogo",super:"Você consegue transformar uma situação ruim em história engraçada. Tem coragem para experimentar e não costuma ficar preso ao mesmo lugar por muito tempo.",defeito:"Você confunde sinceridade com falar qualquer coisa na hora errada. E quando percebe que exagerou, tenta consertar com uma piada.",verdade:"Você fala 'bora' antes de saber para onde vai, quanto custa ou quem vai pagar. Ama liberdade, mas às vezes usa essa palavra como desculpa para não responder mensagem, compromisso ou boleto.",semana:"Você vai aceitar alguma coisa no entusiasmo e só depois perceber a logística. Uma conversa vai virar convite e o convite pode virar rolê. No domingo, você vai querer descansar justamente porque passou a semana dizendo que precisava de aventura.",combina:["ÁRIES","porque ninguém vai perguntar demais antes de fazer alguma coisa que provavelmente vai render uma história."],foge:["VIRGEM","porque Virgem quer saber horário, endereço, orçamento e plano B antes de você terminar a frase."],conselho:"Liberdade não significa fugir de toda responsabilidade. Algumas coisas precisam ser resolvidas antes do rolê."},
  capricornio:{nome:"CAPRICÓRNIO",simbolo:"♑",elemento:"Terra",super:"Você aguenta pressão e continua fazendo o que precisa ser feito. Quando decide construir alguma coisa, costuma ter mais paciência que a maioria.",defeito:"Você transforma descanso em culpa e acha que pedir ajuda é sinal de fraqueza. Depois reclama que ninguém percebe o quanto você está cansado.",verdade:"Você fala que quer tranquilidade, mas está sempre criando uma nova meta. Até quando está de férias parece que existe um projeto invisível para administrar.",semana:"Uma pendência vai consumir sua atenção porque você odeia deixar coisa pela metade. Alguém vai pedir ajuda e você provavelmente vai aceitar mesmo sem ter tempo. No fim de semana, tente não transformar descanso em reunião de planejamento.",combina:["TOURO","porque estabilidade, compromisso e uma vida minimamente organizada já contam como romance."],foge:["LIBRA","porque você quer uma decisão e Libra quer discutir todas as possibilidades antes de escolher a cor da conversa."],conselho:"Descansar não é perder produtividade. Seu corpo não é uma planilha que precisa fechar no positivo todo dia."},
  aquario:{nome:"AQUÁRIO",simbolo:"♒",elemento:"Ar",super:"Você pensa diferente e não precisa que todo mundo concorde para seguir uma ideia. Sua cabeça encontra caminhos que os outros nem estavam procurando.",defeito:"Você pode ser emocionalmente misterioso até para quem mora com você. Some para 'processar' e depois volta falando de um assunto completamente diferente.",verdade:"Você quer ser entendido, mas odeia explicar demais. Quando alguém tenta controlar sua rotina, você imediatamente sente vontade de fazer exatamente o contrário só para provar que ninguém manda em você.",semana:"Uma ideia fora do padrão vai aparecer e você vai querer testar imediatamente. Uma pessoa vai cobrar uma resposta emocional e você vai tentar resolver com lógica. No fim da semana, vai precisar lembrar que nem todo mundo acompanha suas mudanças de assunto na mesma velocidade.",combina:["GÊMEOS","porque os dois conseguem começar uma conversa sobre trabalho e terminar discutindo uma teoria absurda sobre o universo."],foge:["TOURO","porque você quer mudar tudo de lugar e Touro quer saber por que mexer no que já estava funcionando."],conselho:"Explica o que você sente antes de desaparecer. As pessoas não têm acesso ao seu manual interno."},
  peixes:{nome:"PEIXES",simbolo:"♓",elemento:"Água",super:"Você tem uma imaginação que transforma qualquer situação em história e percebe nuances que muita gente ignora.",defeito:"Você romantiza sinais mínimos. A pessoa mandou 'kkk' e você já está avaliando o potencial narrativo da relação.",verdade:"Você diz que está seguindo em frente enquanto ouve a música que lembra a pessoa e olha para o teto pensando na vida. Tem empatia até demais e, às vezes, sofre por problemas que nem são seus.",semana:"Uma lembrança vai bater forte e você vai dar significado demais para uma coincidência. Alguém vai desabafar com você e, quando perceber, estará carregando o problema da pessoa no colo. No fim de semana, faça alguma coisa concreta antes de passar três horas imaginando cenários.",combina:["CÂNCER","porque alguém precisa chorar junto com você de madrugada e ainda entender exatamente por que a música era importante."],foge:["AQUÁRIO","porque você quer conversar sobre sentimentos e Aquário pode começar uma palestra sobre lógica."],conselho:"Sentir muito não significa precisar agir sobre tudo o que sente. Respira e deixa algumas emoções passarem."}
};

const variacoes = {
  aries:{
    verdade:[
      "Você tem a delicadeza de um caminhão sem freio quando decide falar o que pensa. Depois percebe que exagerou, dá risada e segue a vida como se ninguém tivesse acabado de receber um discurso de quinze minutos.",
      "Sua paciência dura menos que bateria de celular velho. Você quer tudo para ontem, começa no entusiasmo e só lembra das consequências quando elas já estão sentadas na sua frente.",
      "Você não procura confusão, mas também não exatamente foge dela. Basta alguém contrariar sua ideia e pronto: nasceu uma reunião que ninguém marcou."
    ],
    semana:[
      "Uma coisa pequena vai irritar você mais do que deveria e sua primeira vontade será responder na hora. Não responda. Na quinta, uma ideia nova vai ocupar sua cabeça e você vai querer começar imediatamente. Pelo menos termine a anterior primeiro.",
      "Você vai dizer 'deixa comigo' e descobrir depois que assumiu mais uma tarefa. No meio da semana, alguém vai testar sua paciência. No fim de semana, você vai querer fazer alguma coisa diferente só porque ficou entediado.",
      "Uma oportunidade de fazer algo impulsivo aparece e você vai precisar escolher entre pensar ou agir. Seu histórico não favorece a primeira opção. No domingo, vai olhar para a semana e se perguntar por que aceitou tanta coisa."
    ]
  },
  touro:{
    verdade:[
      "Você chama de estabilidade o que às vezes é simplesmente medo de mexer no que já está confortável. E se tiver comida boa envolvida, sua capacidade de negociação misteriosamente aumenta.",
      "Você pode passar meses dizendo que não liga para determinada pessoa, lugar ou situação, mas basta alguém tocar no assunto para você lembrar de absolutamente todos os detalhes.",
      "Mudar seus hábitos é uma novela em 200 capítulos. Você sabe o que deveria fazer, concorda com quem fala e mesmo assim continua fazendo do seu jeito."
    ],
    semana:[
      "Uma mudança vai aparecer e sua primeira reação será pensar em dez motivos para deixar para depois. No fim, você vai fazer — mas somente quando estiver convencido de que ninguém vai atrapalhar seu conforto.",
      "Você vai economizar numa coisa e gastar o dobro em outra que considera indispensável. Na sexta, alguém vai tentar acelerar uma decisão sua e você vai andar ainda mais devagar.",
      "Uma pessoa vai insistir para você experimentar algo novo. Você vai reclamar, avaliar, desconfiar e provavelmente gostar depois. Só não espere que você admita isso imediatamente."
    ]
  },
  gemeos:{
    verdade:[
      "Você começa uma história, lembra de outra, abre uma conversa no celular e, quando percebe, ninguém sabe mais qual era o assunto original — inclusive você.",
      "Você tem opinião para tudo, inclusive para assuntos que descobriu há aproximadamente oito minutos. E quando aparece uma informação nova, sua opinião muda com a mesma tranquilidade.",
      "Sua mente parece um grupo de WhatsApp com 37 pessoas falando ao mesmo tempo. O problema é que todas as pessoas são você."
    ],
    semana:[
      "Uma conversa inocente vai virar fofoca e a fofoca vai virar investigação. Na quarta você terá começado várias coisas e terminado poucas. Pelo menos uma delas vai render uma história boa.",
      "Você vai receber uma mensagem enquanto está respondendo outra pessoa e esquecer completamente a primeira. No sábado, uma conversa antiga pode voltar e você vai agir como se tivesse sido ontem.",
      "Uma ideia nova vai interromper a tarefa que você estava fazendo. Você vai prometer que volta depois. Spoiler: provavelmente não volta."
    ]
  },
  cancer:{
    verdade:[
      "Você não guarda lembranças; você monta acervo. Uma mensagem antiga, uma foto e até uma música podem ficar arquivadas por anos esperando o momento certo para destruir sua paz por vinte minutos.",
      "Você diz que superou, mas ainda sabe exatamente onde encontrou aquela pessoa pela primeira vez. Não é memória, amiga. É HD externo emocional.",
      "Seu coração tem gavetas para pessoas que nem sabem que ainda estão cadastradas. E quando bate saudade, você chama de curiosidade e vai olhar o perfil."
    ],
    semana:[
      "Uma lembrança antiga vai aparecer sem convite e você vai passar tempo demais pensando nela. Na sexta, alguém vai procurar você para conversar e você vai virar terapeuta improvisado.",
      "Você vai perceber uma mudança no comportamento de alguém e provavelmente estará certo. O problema é que vai pensar nisso durante horas antes de perguntar diretamente.",
      "O melhor momento da semana pode ser justamente quando você decidir ficar quieto, comer alguma coisa boa e não resolver problema de ninguém."
    ]
  },
  leao:{
    verdade:[
      "Você não precisa ser o centro das atenções, mas também não acha ruim quando acontece. E quando alguém recebe um elogio que você queria, você percebe imediatamente — mesmo fingindo que não.",
      "Você diz que não liga para aprovação enquanto verifica quem viu sua postagem. Isso não é desinteresse; é auditoria.",
      "Seu orgulho é tão bem organizado que até quando você quer pedir desculpas começa procurando uma maneira de não parecer que pediu desculpas."
    ],
    semana:[
      "Alguém vai reconhecer algo que você fez e você vai fingir naturalidade enquanto guarda o elogio no coração. Uma crítica pequena também pode pegar mais fundo do que deveria.",
      "Você vai sentir vontade de mudar alguma coisa no visual, na rotina ou no ambiente. Faça se quiser, mas não precisa transformar a mudança em anúncio oficial.",
      "Uma pessoa vai disputar sua atenção e você vai perceber imediatamente. O desafio será não transformar isso numa competição que só existe na sua cabeça."
    ]
  },
  virgem:{
    verdade:[
      "Você encontra erro até onde ninguém pediu revisão. O problema é que depois fica difícil fingir que não viu.",
      "Você chama de organização, mas às vezes é ansiedade usando roupa social. Tem plano A, B e C e ainda quer saber o que fazer se o plano C der errado.",
      "Você ajuda todo mundo e depois fica irritado porque ninguém fez exatamente do jeito que você teria feito. A surpresa é zero."
    ],
    semana:[
      "Você vai notar um detalhe que todo mundo ignorou e vai precisar decidir se vale a pena falar. Nem sempre vale.",
      "Uma tarefa simples vai virar um projeto porque você decidiu melhorar o processo. No fim, vai funcionar, mas poderia ter terminado em vinte minutos.",
      "Alguém vai pedir sua opinião e você vai entregar uma análise que ninguém solicitou, mas que provavelmente precisava."
    ]
  },
  libra:{
    verdade:[
      "Você diz 'qualquer coisa está bom' com a esperança secreta de que alguém escolha exatamente a opção que você queria.",
      "Você evita conflito até o ponto em que começa a acumular pequenas irritações. Depois chama de 'nada demais' e continua sorrindo.",
      "Sua indecisão não é falta de opinião. Você tem opinião demais e quer escolher a opção que vai deixar todo mundo satisfeito — missão impossível, amiga."
    ],
    semana:[
      "Uma escolha simples vai ocupar espaço demais na sua cabeça. Você vai pedir opinião, ouvir duas respostas diferentes e ficar ainda mais indeciso.",
      "Alguém vai colocar você diante de uma decisão e você vai tentar negociar até o universo desistir. Escolha logo.",
      "Uma situação social vai exigir que você diga não. Vai dar vontade de inventar desculpa. Não invente uma novela; seja direto."
    ]
  },
  escorpiao:{
    verdade:[
      "Você diz que não está investigando, mas já sabe quem curtiu, quem deixou de seguir e quem apareceu no story. Isso não é curiosidade, é perícia.",
      "Sua memória emocional trabalha em alta definição. Você pode esquecer onde colocou a chave, mas lembra exatamente da frase que alguém falou há quatro anos.",
      "Você confia devagar e desconfia rápido. Quando alguma coisa parece estranha, sua cabeça já começou a montar a temporada inteira da série."
    ],
    semana:[
      "Uma mensagem curta vai parecer carregada de significado e você vai analisar mais do que deveria. Perguntar diretamente continua sendo mais barato que criar uma teoria.",
      "Alguém vai fazer algo inesperado e você vai imediatamente procurar a segunda intenção. Talvez exista. Talvez você só esteja trabalhando demais.",
      "Uma conversa pode esclarecer uma dúvida antiga. Não transforme a oportunidade em interrogatório policial."
    ]
  },
  sagitario:{
    verdade:[
      "Você aceita o convite primeiro e pergunta onde é depois. Planejamento para você às vezes significa descobrir o caminho enquanto já está saindo de casa.",
      "Sua sinceridade é ótima até chegar naquele momento em que você percebe que falou exatamente o que não precisava.",
      "Você ama liberdade e às vezes usa essa palavra para fugir de coisas simples como responder mensagem, marcar horário e pagar boleto."
    ],
    semana:[
      "Um convite inesperado pode virar o melhor acontecimento da semana — desde que você descubra os detalhes antes de dizer sim.",
      "Você vai ter vontade de mudar a rotina e provavelmente vai inventar um plano em cima da hora. Só não esqueça das responsabilidades que ficaram para trás.",
      "Uma conversa vai abrir uma possibilidade interessante. Antes de prometer qualquer coisa, confira se você realmente tem tempo."
    ]
  },
  capricornio:{
    verdade:[
      "Você consegue transformar descanso em culpa. Está sentado sem fazer nada e seu cérebro já abriu uma reunião sobre produtividade.",
      "Você diz que quer paz, mas cria metas como quem coleciona figurinha. Quando termina uma, já inventou outra.",
      "Pedir ajuda parece mais difícil para você do que fazer tudo sozinho e reclamar depois que ninguém ajuda."
    ],
    semana:[
      "Uma pendência vai incomodar você até ser resolvida. Tente não assumir também a pendência dos outros só porque sabe fazer melhor.",
      "Você vai ter uma oportunidade de descansar e provavelmente vai usar parte do tempo para organizar alguma coisa. Pelo menos tente sentar sem transformar o descanso em tarefa.",
      "Uma cobrança vai fazer você perceber que está carregando mais do que deveria. Delegar não vai destruir sua reputação."
    ]
  },
  aquario:{
    verdade:[
      "Você quer que entendam sua cabeça, mas explica pouco e depois fica surpreso quando ninguém entendeu.",
      "Quando alguém tenta controlar você, sua vontade imediata é fazer exatamente o contrário, mesmo que a ideia original nem fosse ruim.",
      "Você consegue passar de uma conversa emocional para uma teoria sobre o futuro da humanidade sem perceber que deixou a outra pessoa esperando uma resposta."
    ],
    semana:[
      "Uma ideia diferente vai surgir e você vai querer testar na hora. Só confira se não está abandonando outra ideia que teve ontem.",
      "Alguém vai pedir mais clareza sobre o que você sente. Não transforme a resposta em palestra; diga simplesmente o que está acontecendo.",
      "Uma mudança de rotina pode fazer bem, mas avise as pessoas envolvidas antes de desaparecer para reorganizar sua vida."
    ]
  },
  peixes:{
    verdade:[
      "Você consegue criar uma história inteira a partir de uma mensagem de três palavras. Às vezes a pessoa só escreveu 'kkkk'.",
      "Sua imaginação é ótima até começar a preencher lacunas com coisas que ninguém disse.",
      "Você sente o problema dos outros como se tivesse recebido a conta no seu nome. Depois fica cansado sem entender por quê."
    ],
    semana:[
      "Uma coincidência vai parecer carregada de significado. Antes de transformar isso em sinal do universo, confira se não foi apenas uma coincidência.",
      "Alguém vai desabafar e você vai querer resolver tudo. Escutar já pode ser suficiente.",
      "Uma atividade prática vai fazer bem justamente porque tira você da cabeça e coloca sua atenção no que está acontecendo de verdade."
    ]
  }
};

const frasesCompartilhaveis = {
  aries:["Eu não sou impulsivo. Eu só tenho pressa de descobrir se vai dar merda.","Se eu pensei, eu falei. Se eu falei, agora já foi.","Minha paciência não acabou. Ela só pediu demissão."],
  touro:["Eu não sou teimoso. Eu só demoro para concordar com quem está errado.","Meu conceito de aventura é mudar o pedido no restaurante.","Conforto não é preguiça. É planejamento emocional."],
  gemeos:["Eu não mudo de assunto. Minha mente só trabalha em várias abas.","Eu ia explicar, mas me distraí no meio da frase.","Tenho opinião sobre tudo. Inclusive sobre o que acabei de descobrir."],
  cancer:["Eu não guardo rancor. Eu guardo detalhes.","Superei. Só não apaguei o arquivo.","Não é saudade. É uma investigação emocional sem autorização."],
  leao:["Eu não preciso de atenção. Mas, se vier, eu aceito.","Não é ego. É manutenção da autoestima.","Eu finjo que não ligo com uma qualidade impressionante."],
  virgem:["Eu não sou controlador. Eu só percebi que ninguém fez direito.","Relaxa. Eu já organizei até o que você não pediu.","Não é preocupação. É planejamento com excesso de imaginação."],
  libra:["Eu sei o que quero. Só preciso analisar mais 47 opções.","'Tanto faz' significa 'escolhe exatamente o que eu estou pensando'.","Não estou indeciso. Estou dando uma chance para todas as possibilidades."],
  escorpiao:["Eu não investigo. Eu apenas observo com profundidade.","Esquecer eu até esqueço. O detalhe é que eu lembro de tudo.","Não desconfio de todo mundo. Só dos motivos."],
  sagitario:["Eu disse 'bora' antes de perguntar para onde.","Planejamento é descobrir os detalhes depois de aceitar.","Eu não fujo de responsabilidade. Só gosto de manter distância."],
  capricornio:["Eu descanso, sim. Minha culpa é que descanso pensando no que falta fazer.","Não estou trabalhando demais. Estou evitando pensar na vida.","Minha meta de hoje era descansar. Acabei criando outra meta."],
  aquario:["Eu explicaria, mas provavelmente você não acompanharia a linha de raciocínio.","Não é rebeldia. Eu só fiquei com vontade de fazer o contrário.","Eu tenho sentimentos. Só preciso de um tutorial para explicar."],
  peixes:["Eu não criei expectativa. Só imaginei 14 futuros possíveis.","A pessoa mandou 'kkk' e minha cabeça escreveu uma temporada inteira.","Eu sinto tanto que às vezes até problema dos outros vem com meu nome."]
};

function escolherFraseCompartilhavel(signo){
  const lista=frasesCompartilhaveis[signo] || [];
  return lista.length ? lista[Math.floor(Math.random()*lista.length)] : "";
}

function personalizarContexto(contexto, signo, campo){
  if(!contexto) return "";
  const texto=contexto.toLowerCase();
  const temas=[
    {palavras:["ex","termin","separ","término","divórc","divor"],frases:{
      semana:"E sobre esse assunto afetivo que você contou: não transforme saudade em convite para voltar para uma situação que já mostrou por que terminou. Se houver conversa, observe atitudes — não só palavras.",
      conselho:"Não procure resposta no perfil de quem você está tentando esquecer. Se a pessoa quisesse falar, existe telefone. Você não precisa virar detetive de story."
    }},
    {palavras:["namor","casad","ficante","relacion","crush","amor"],frases:{
      semana:"Na parte amorosa, você pode perceber uma diferença entre aquilo que a pessoa fala e aquilo que ela realmente faz. Presta atenção no comportamento antes de inventar desculpas para ninguém.",
      conselho:"Pare de tentar adivinhar o que a outra pessoa sente. Perguntar claramente costuma economizar uma quantidade absurda de drama."
    }},
    {palavras:["trabalho","emprego","chefe","faculdade","estudo","prova","escola","curso"],frases:{
      semana:"No trabalho ou nos estudos, uma pendência que você está empurrando pode voltar para cobrar atenção. Resolva uma parte concreta antes de abrir mais dez abas mentais.",
      conselho:"Não tente resolver sua vida profissional inteira em uma noite. Escolha a próxima tarefa e faça direito."
    }},
    {palavras:["dinheiro","dívida","divida","boleto","finance","salário","salario","conta"],frases:{
      semana:"Na parte financeira, evite aquela compra que começa com 'eu mereço' e termina com você olhando o saldo em silêncio. Antes de gastar, veja se você realmente precisava.",
      conselho:"Se o dinheiro está apertado, não trate ansiedade de compra como recompensa. Seu cartão não conhece astrologia."
    }},
    {palavras:["família","familia","mãe","mae","pai","irmão","irmao","filho","filha"],frases:{
      semana:"Uma questão familiar pode exigir uma conversa que você vem adiando. Não tente resolver tudo de uma vez; diga claramente o que está incomodando.",
      conselho:"Você pode amar alguém e ainda colocar limite. Parentesco não transforma qualquer comportamento em obrigação sua."
    }},
    {palavras:["amigo","amizade","amiga","grupo"],frases:{
      semana:"Uma amizade pode pedir mais clareza do que você costuma oferecer. Se alguma coisa incomodou, falar diretamente é melhor do que acumular pequenas irritações.",
      conselho:"Não espere que seus amigos adivinhem o que você não contou. Fala."
    }}
  ];
  const tema=temas.find(t=>t.palavras.some(p=>texto.includes(p)));
  if(!tema) return "";
  return tema.frases[campo] || "";
}

function escolherVariacao(signo, campo){
  const lista=variacoes[signo] && variacoes[signo][campo];
  return lista && lista.length ? lista[Math.floor(Math.random()*lista.length)] : signos[signo][campo];
}

const ordem=["aries","touro","gemeos","cancer","leao","virgem","libra","escorpiao","sagitario","capricornio","aquario","peixes"];
let selecionado=null;
const grid=document.getElementById("zodiacGrid");
const result=document.getElementById("result");

ordem.forEach(id=>{
  const s=signos[id];
  const b=document.createElement("button");
  b.className="sign";
  b.innerHTML='<span class="symbol">'+s.simbolo+'</span><span class="name">'+s.nome+'</span>';
  b.onclick=()=>{document.querySelectorAll(".sign").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selecionado=id;};
  grid.appendChild(b);
});

document.getElementById("generateBtn").onclick=()=>{
  if(!selecionado){
    alert("🔮 Ô, criatura sem identidade cósmica! Qual é o teu signo? Se não souber, me diz a data de nascimento que eu descubro e já te julgo de uma vez.");
    return;
  }
  const s=signos[selecionado];
  const contexto=document.getElementById("context").value.trim();
  const verdade=escolherVariacao(selecionado,"verdade");
  const semanaBase=escolherVariacao(selecionado,"semana");
  const semanaContexto=personalizarContexto(contexto,selecionado,"semana");
  const semana=semanaContexto || semanaBase;
  const fraseCompartilhavel=escolherFraseCompartilhavel(selecionado);
  const extra=contexto?'<p class="quote"><strong>Madame recebeu seu contexto:</strong> "'+escapeHtml(contexto)+'"<br><br>Agora presta atenção porque eu vou considerar isso na leitura. Não adianta fingir que não contou.</p>':"";
  result.innerHTML=
    '<div class="title"><h2>🔮 HORÓSCOPO SINCERO POR MADAME VERÔNICA</h2><p class="subtitle">"Porque alguém precisava te contar a verdade."</p><div class="meta">Signo: '+s.nome+' '+s.simbolo+' · Elemento: '+s.elemento+' · Nível de Sinceridade: Brutal</div></div>'+
    '<h3>💀 A VERDADE QUE NINGUÉM TE CONTA:</h3><p>'+verdade+'</p>'+
    '<h3>🔥 SEU SUPERPODER (Sim, você tem um):</h3><p>'+s.super+'</p>'+
    '<h3>🚩 SEU DEFEITO FATAL (Todo mundo já percebeu, menos você):</h3><p>'+s.defeito+'</p>'+
    '<h3>📅 PREVISÃO SINCERA DA SEMANA:</h3><p>'+semana+'</p>'+extra+
    '<div class="share-phrase"><h3>📲 FRASE PARA COMPARTILHAR:</h3><p class="quote">'+fraseCompartilhavel+'</p></div>'+
    '<h3>💬 CONSELHO QUE VOCÊ VAI IGNORAR (Mas eu vou dar mesmo assim):</h3><p>'+s.conselho+'</p>'+
    '<h3>🎯 COMPATIBILIDADE SEM MENTIRA:</h3><div class="compat"><div><strong>Combina com: '+s.combina[0]+'</strong>'+s.combina[1]+'</div><div><strong>Foge de: '+s.foge[0]+'</strong>'+s.foge[1]+'</div></div>'+
    '';
  result.classList.remove("hidden");
  result.scrollIntoView({behavior:"smooth",block:"start"});
};

function escapeHtml(text){
  return text.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}