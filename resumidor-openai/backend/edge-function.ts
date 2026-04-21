import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ============================================
// CONFIGURACIÓN DE CORS
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

serve(async (req: Request) => {
  // Manejo de peticiones CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ============================================
    // VALIDACIÓN: Método HTTP
    // ============================================

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Solo se aceptan peticiones POST" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ============================================
    // OBTENER Y PARSEAR BODY
    // ============================================

    let requestBody: { texto?: string };

    try {
      requestBody = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Body debe ser JSON válido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { texto } = requestBody;

    // ============================================
    // VALIDACIÓN: Campo 'texto'
    // ============================================

    if (!texto || typeof texto !== "string") {
      return new Response(
        JSON.stringify({ error: "El campo 'texto' es requerido y debe ser string" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const textoLimpio = texto.trim();

    if (textoLimpio.length === 0) {
      return new Response(
        JSON.stringify({ error: "El texto no puede estar vacío" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (textoLimpio.length < 50) {
      return new Response(
        JSON.stringify({ error: "El texto debe tener al menos 50 caracteres" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ============================================
    // OBTENER API KEY DE OPENAI
    // ============================================

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      console.error("❌ OPENAI_API_KEY no está configurada");
      return new Response(
        JSON.stringify({ error: "Configuración del servidor incompleta" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ============================================
    // LLAMAR A OPENAI API
    // ============================================

    console.log(`📝 Procesando texto de ${textoLimpio.length} caracteres`);

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Eres un experto en resumir textos. Tu tarea es resumir el texto que recibas en máximo 3 líneas, manteniendo las ideas principales. Sé conciso y claro.",
            },
            {
              role: "user",
              content: `Resume este texto:\n\n${textoLimpio}`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );

    // ============================================
    // VALIDAR RESPUESTA DE OPENAI
    // ============================================

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      const errorMessage = errorData.error?.message || "Error desconocido";

      console.error(`❌ Error de OpenAI (${openaiResponse.status}):`, errorMessage);

      return new Response(
        JSON.stringify({
          error: `Error de OpenAI: ${errorMessage}`,
        }),
        {
          status: openaiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ============================================
    // PROCESAR RESPUESTA DE OPENAI
    // ============================================

    const data = await openaiResponse.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("❌ Respuesta de OpenAI con estructura inesperada:", data);
      return new Response(
        JSON.stringify({ error: "Respuesta de OpenAI inválida" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resumen = data.choices[0].message.content;

    console.log(`✅ Resumen generado: ${resumen.length} caracteres`);

    // ============================================
    // DEVOLVER RESPUESTA AL CLIENTE
    // ============================================

    return new Response(JSON.stringify({ resumen }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    // ============================================
    // MANEJO DE ERRORES NO CAPTURADOS
    // ============================================

    console.error("❌ Error no controlado:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Error desconocido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
