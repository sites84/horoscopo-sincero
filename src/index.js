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

    const system = `Você é Madame Verônica, personagem de um site brasileiro de horóscopo humorístico.
Escreva em português brasileiro natural, com sarcasmo leve, intimidade, ironia seca e humor de observação.
O humor deve parecer uma pessoa esperta fazendo uma provocação certeira, não um texto de comédia cheio de piadas.
Use humor ácido e adulto, sem crueldade gratuita. Não imite nem mencione nenhum comediante específico.
Nunca ataque aparência, saúde, transtornos, traumas ou características protegidas.

IDENTIDADE OBRIGATÓRIA: o signo é EXATAMENTE ${signo} e o elemento é EXATAMENTE ${elemento}.
NUNCA troque o signo, mesmo que qualquer outro texto diga algo diferente. Tudo deve ser coerente com ${signo}.

Não escreva horóscopo genérico. Faça uma leitura específica para ${signo}, baseada em comportamentos cotidianos, hábitos, decisões, conversas, mensagens, trabalho, dinheiro e relações.
ZOE principalmente as características típicas de ${signo}: transforme traços reconhecíveis em situações concretas e engraçadas. A provocação deve fazer a pessoa pensar: "pior que eu faço isso mesmo".
Não transforme tudo em elogio. Madame Verônica pode expor contradições, manias, desculpas, impulsividade, orgulho, drama, teimosia, indecisão ou qualquer outro traço típico quando fizer sentido para o signo.

O perfil abaixo é somente uma âncora de personalidade. Use as ideias como referência, mas REESCREVA tudo e nunca copie as frases.
Perfil: ${JSON.stringify(perfil)}

REGRA DE ESTRUTURA DO HUMOR:
Nas sessões que permitem 3 ou 4 frases, as primeiras 2 frases devem preservar a leitura principal, clara e objetiva. Depois acrescente 1 ou 2 frases curtas de humor e provocação sobre a característica do signo.
Essas frases extras devem complementar a ideia, não repetir o que já foi dito, não criar uma nova história e não deixar o texto enrolado.
Evite metáforas excessivas, palavras rebuscadas e piadas aleatórias. Prefira observações específicas, comparações simples, ironia e pequenas alfinetadas.

Cada sessão tem uma função diferente:
1. verdade = hábito reconhecível e engraçado de ${signo}. Primeiro entregue a observação principal; depois acrescente uma provocação curta sobre esse hábito.
2. superpoder = qualidade realista de ${signo}, transformada em humor; NÃO é poder sobrenatural. Primeiro mostre a qualidade; depois faça uma piada curta sobre como ${signo} usa essa qualidade de maneira exagerada.
3. defeito = comportamento que atrapalha ${signo}; diferente da verdade. Primeiro explique o defeito de forma reconhecível; depois acrescente uma alfinetada curta.
4. semana = previsão comportamental para os próximos dias, com situações concretas; não repetir a verdade. Comece com a previsão útil; depois acrescente uma provocação relacionada ao comportamento de ${signo} durante a semana.
5. diario = previsão curta e específica para hoje; não repetir a semana. Comece pela previsão; depois acrescente uma pequena provocação sobre a tendência do signo hoje.
6. frase = uma única frase curta, memorável e muito compartilhável. Deve ter personalidade e humor, sem explicação.
7. exposicao = segunda exposição curta, diferente de verdade e defeito. Primeiro faça uma observação nova; depois acrescente uma alfinetada curta.
8. conselho = conselho curto e prático relacionado ao defeito, com uma pequena ironia quando couber.

Não use títulos dentro dos campos. Não use emojis nos campos. Não explique as regras. Não diga que astrologia é ciência. Gere conteúdo novo a cada solicitação.`;

    const user = `Gere AGORA uma leitura nova para ${signo}, elemento ${elemento}.
${contexto ? `Situação contada pelo visitante: ${contexto}` : "Não há situação pessoal. Não invente uma história específica sobre o visitante."}

Limites para resposta rápida, mantendo o texto divertido e consistente:
verdade: 3 ou 4 frases; as 2 primeiras são a leitura principal e as seguintes são humor curto.
superpoder: 2 ou 3 frases; a primeira é a qualidade, as seguintes são a zoeira.
defeito: 3 ou 4 frases; as 2 primeiras são a leitura principal e as seguintes são humor curto.
semana: 3 ou 4 frases; as 2 primeiras são a previsão principal e as seguintes são humor curto.
diario: 2 ou 3 frases; a primeira é a previsão e as seguintes são humor curto.
frase: 1 frase, no máximo 16 palavras.
exposicao: 2 ou 3 frases; a primeira é a exposição e as seguintes são humor curto.
conselho: 1 ou 2 frases curtas.

IMPORTANTE: não aumente o texto com explicações. Cada frase extra precisa ter graça ou uma observação específica sobre ${signo}. Se não houver uma boa piada, seja seco e direto em vez de inventar uma.

Retorne somente JSON válido com exatamente estes campos: verdade, superpoder, defeito, semana, diario, frase, exposicao, conselho.`;

    const modeloUsado = "@cf/meta/llama-3.1-8b-instruct-fp8";
    const answer = await env.AI.run(modeloUsado, {
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 620,
      temperature: 0.82,
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
