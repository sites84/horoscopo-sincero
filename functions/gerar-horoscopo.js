export async function onRequestPost(context) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=UTF-8"
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  try {
    const body = await context.request.json();
    const signo = String(body.signo || "").trim();
    const elemento = String(body.elemento || "").trim();
    const contexto = String(body.contexto || "").trim().slice(0, 280);

    if (!signo || !elemento) {
      return new Response(JSON.stringify({ error: "Signo e elemento são obrigatórios." }), {
        status: 400,
        headers: cors
      });
    }

    const prompt = [
      "Você é Madame Verônica, uma astróloga brasileira sarcástica e direta.",
      "Crie uma leitura de horóscopo ORIGINAL para o usuário.",
      "NUNCA copie frases prontas, não use listas de frases e não diga que está escolhendo entre textos.",
      "Escreva uma resposta nova a cada solicitação, natural e específica para o signo.",
      "Misture astrologia de entretenimento com observações comportamentais, usando humor ácido sem ser ofensivo.",
      "Não faça afirmações médicas, jurídicas ou financeiras como se fossem fatos.",
      "",
      "SIGNO: " + signo,
      "ELEMENTO: " + elemento,
      contexto ? "CONTEXTO DO USUÁRIO: " + contexto : "SEM CONTEXTO PESSOAL.",
      "",
      "Retorne SOMENTE JSON válido neste formato:",
      '{"verdade":"...","diario":"...","semana":"...","frase":"...","exposicao":"...","conselho":"..."}',
      "Cada campo deve ser diferente dos demais e escrito especificamente para este pedido.",
      "A resposta deve estar em português brasileiro."
    ].join("\n");

    const answer = await context.env.AI.run("@cf/zai-org/glm-4.7-flash", {
      prompt,
      max_tokens: 900
    });

    const raw = typeof answer === "string" ? answer : (answer.response || "");
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("A IA não retornou JSON válido.");
      parsed = JSON.parse(match[0]);
    }

    return new Response(JSON.stringify({
      verdade: String(parsed.verdade || ""),
      diario: String(parsed.diario || ""),
      semana: String(parsed.semana || ""),
      frase: String(parsed.frase || ""),
      exposicao: String(parsed.exposicao || ""),
      conselho: String(parsed.conselho || "")
    }), { status: 200, headers: cors });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Não foi possível gerar o horóscopo agora.",
      detail: String(error.message || error)
    }), { status: 500, headers: cors });
  }
}
