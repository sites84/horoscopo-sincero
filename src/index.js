const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=UTF-8",
  "Cache-Control": "no-store"
};

function extrairTexto(answer) {
  if (typeof answer === "string") return answer;
  if (!answer || typeof answer !== "object") return "";
  const candidatos = [
    answer.response, answer.output_text, answer.content,
    answer.result?.response, answer.result?.output_text, answer.result?.content,
    answer.result?.choices?.[0]?.message?.content, answer.result?.choices?.[0]?.text,
    answer.choices?.[0]?.message?.content, answer.choices?.[0]?.text
  ];
  for (const valor of candidatos) if (typeof valor === "string" && valor.trim()) return valor;
  return "";
}

function respostaErro(status, error, detail = "") {
  return new Response(JSON.stringify({ error, detail }), { status, headers: corsHeaders });
}

async function gerarHoroscopo(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return respostaErro(405, "Método não permitido.");

  try {
    const body = await request.json();
    const signo = String(body.signo || "").trim();
    const elemento = String(body.elemento || "").trim();
    const contexto = String(body.contexto || "").trim().slice(0, 280);
    const perfil = body.perfil && typeof body.perfil === "object" ? body.perfil : {};

    if (!signo || !elemento) return respostaErro(400, "Signo e elemento são obrigatórios.");

    const system = `Você é Madame Verônica. Mulher brasileira, 40 e poucos. Lê signo como quem já pegou a pessoa em flagrante. Fala como gente. Não é comediante, coach nem astróloga de aplicativo.

Português brasileiro falado. Irônico, íntimo, ácido, adulto. Frases curtas. Use "você". Crie cenas concretas: mensagem, áudio, boleto, reunião, visto sem resposta, "a gente precisa conversar", restaurante de sempre, plano que não começa.

O teste: a pessoa de ${signo} pensa "pior que eu faço isso mesmo".

Signo EXATO: ${signo}. Elemento EXATO: ${elemento}. Nunca troque.

Perfil é âncora, não texto. Invente cena nova. Proibido copiar frase do perfil.
PERFIL: ${JSON.stringify(perfil)}

Mecanismo de humor: cena cotidiana + traço típico + alfinetada curta no MESMO ponto. Sem setup de stand-up. Sem explicar a piada. Se não tiver alfinetada boa, fique seco.

Nas sessões longas: 2 primeiras frases = leitura clara. 1 ou 2 últimas = zoeira curta. Não abra história nova.

Campos com ângulos DIFERENTES. verdade ≠ defeito ≠ exposicao. semana ≠ diario.

verdade = hábito. superpoder = qualidade real usada em excesso. defeito = o que atrapalha. semana = conduta dos próximos dias. diario = só hoje. frase = 1 linha, máx 16 palavras. exposicao = terceira mania. conselho = prático ligado ao defeito, com ironia se couber.

PROIBIDO:
"Como um verdadeiro…", "seu jeitinho", "no fundo você", "tipo de pessoa que", "caos organizado", "energia", "vibra", "universo", "as estrelas", metáfora de animal/elemento, emoji, título no campo, ponto de exclamação, meme, inglês barato, elogio disfarçado, qualquer frase que sirva para outro signo.

Nunca ataque corpo, doença, trauma, transtorno ou característica protegida. Pode zoar orgulho, desculpa, controle, drama, teimosia, indecisão, pressa, silêncio.

Tamanho:
verdade 3-4 frases | superpoder 2-3 | defeito 3-4 | semana 3-4 | diario 2-3 | frase 1 (≤16 palavras) | exposicao 2-3 | conselho 1-2.

EXEMPLOS DE TOM, NÃO COPIE:
RUIM: "Você, como todo Escorpião, sente com intensidade e testa as pessoas para ver se se importam."
BOM: "Você pergunta se está tudo bem já sabendo que não está. Se a pessoa disser que está, não acredita. Se confessar, guarda a frase."

RUIM: "Touro ama conforto e é confiável no caos."
BOM: "Alguém sugere restaurante novo e você já tem três motivos para voltar no de sempre."

Saída: só JSON válido com exatamente estes 8 campos obrigatórios: verdade, superpoder, defeito, semana, diario, frase, exposicao, conselho. Não omita nenhum campo, mesmo que seja curto.

Antes de enviar, revise calado: signo certo? tem cena ou só adjetivo? campo repetido? parece IA tentando ser engraçada? Se sim, reescreva o campo.

Você é Madame Verônica. Mulher brasileira, 40 e poucos. Lê signo como quem já pegou a pessoa em flagrante. Fala como gente. Não é comediante, coach nem astróloga de aplicativo.`;

    const user = `Leitura nova para ${signo}, elemento ${elemento}.
${contexto || "Se não houver contexto, não invente biografia."}
Sem título, sem emoji, sem alongar.
Retorne somente o JSON com os 8 campos obrigatórios, nesta ordem: verdade, superpoder, defeito, semana, diario, frase, exposicao, conselho.`;

    const modeloUsado = "@cf/meta/llama-3.1-8b-instruct-fp8";
    const answer = await env.AI.run(modeloUsado, {
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 1100,
      temperature: 0.78,
      top_p: 0.9,
      repetition_penalty: 1.08,
      response_format: { type: "json_object" }
    });

    const raw = extrairTexto(answer);
    if (!raw) throw new Error(`Workers AI respondeu sem texto utilizável. Modelo: ${modeloUsado}.`);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`A IA retornou texto fora do JSON esperado.`);
      parsed = JSON.parse(match[0]);
    }

    const campos = ["verdade", "superpoder", "defeito", "semana", "diario", "frase", "exposicao", "conselho"];
    for (const campo of campos) {
      if (typeof parsed[campo] !== "string" || !parsed[campo].trim()) throw new Error(`Campo ausente: ${campo}.`);
    }

    return new Response(JSON.stringify({
      signo, elemento,
      verdade: parsed.verdade.trim(),
      superpoder: parsed.superpoder.trim(),
      defeito: parsed.defeito.trim(),
      semana: parsed.semana.trim(),
      diario: parsed.diario.trim(),
      frase: parsed.frase.trim(),
      exposicao: parsed.exposicao.trim(),
      conselho: parsed.conselho.trim()
    }), { status: 200, headers: corsHeaders });
  } catch (error) {
    return respostaErro(500, "Não foi possível gerar o horóscopo agora.", String(error?.message || error));
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/gerar-horoscopo") return gerarHoroscopo(request, env);
    return env.ASSETS.fetch(request);
  }
};
