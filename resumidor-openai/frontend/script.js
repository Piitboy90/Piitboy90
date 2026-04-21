// ============================================
// CONFIGURACIÓN DE SUPABASE
// ============================================

const SUPABASE_URL = "https://cgyroimzmhlrgnfimwen.supabase.co";
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/resumidor-openai`;

// ============================================
// REFERENCIAS AL DOM
// ============================================

const textInput = document.getElementById("textInput");
const resumeBtn = document.getElementById("resumeBtn");
const resultDiv = document.getElementById("result");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const resumeOutput = document.getElementById("resumeOutput");

// ============================================
// EVENT LISTENERS
// ============================================

resumeBtn.addEventListener("click", resumirTexto);

// Permitir Enter en textarea para resumir
textInput.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    resumirTexto();
  }
});

// ============================================
// FUNCIÓN PRINCIPAL: RESUMIR TEXTO
// ============================================

async function resumirTexto() {
  // Obtener y limpiar el texto
  const texto = textInput.value.trim();
  
  // Validación: ¿hay texto?
  if (!texto) {
    mostrarError("⚠️ Por favor, pega un texto para resumir.");
    return;
  }
  
  // Validación: longitud mínima
  if (texto.length < 50) {
    mostrarError("⚠️ El texto debe tener al menos 50 caracteres.");
    return;
  }
  
  // Limpiar UI de estados anteriores
  errorDiv.style.display = "none";
  resultDiv.style.display = "none";
  
  // Mostrar loading
  loadingDiv.style.display = "block";
  
  // Deshabilitar botón mientras se procesa
  resumeBtn.disabled = true;
  resumeBtn.textContent = "Procesando...";
  
  try {
    // ============================================
    // LLAMADA A EDGE FUNCTION
    // ============================================
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        texto: texto
      })
    });
    
    // ============================================
    // MANEJO DE RESPUESTA
    // ============================================
    
    if (!response.ok) {
      // Si la respuesta no es exitosa (2xx), intentar obtener el error
      let errorMessage = "Error desconocido";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Si no podemos parsear el error, usar el status
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Parsear la respuesta JSON
    const data = await response.json();
    
    // Validar que tenemos el resumen
    if (!data.resumen) {
      throw new Error("La respuesta no contiene un resumen válido");
    }
    
    const resumen = data.resumen;
    
    // ============================================
    // MOSTRAR RESULTADO
    // ============================================
    
    loadingDiv.style.display = "none";
    resumeOutput.textContent = resumen;
    resultDiv.style.display = "block";
    
    // Log de éxito
    console.log("✅ Resumen generado exitosamente");
    console.log("Caracteres originales:", texto.length);
    console.log("Caracteres del resumen:", resumen.length);
    
  } catch (error) {
    // ============================================
    // MANEJO DE ERRORES
    // ============================================
    
    loadingDiv.style.display = "none";
    console.error("❌ Error en resumirTexto():", error);
    mostrarError(`❌ Error: ${error.message}`);
    
  } finally {
    // ============================================
    // LIMPIAR ESTADO DEL BOTÓN
    // ============================================
    
    resumeBtn.disabled = false;
    resumeBtn.textContent = "Resumir Texto";
  }
}

// ============================================
// FUNCIÓN AUXILIAR: MOSTRAR ERROR
// ============================================

function mostrarError(mensaje) {
  errorDiv.textContent = mensaje;
  errorDiv.style.display = "block";
  resultDiv.style.display = "none";
  loadingDiv.style.display = "none";
}

// ============================================
// LOGS Y DEBUGGING
// ============================================

console.log("🚀 App inicializada");
console.log("📍 Supabase URL:", SUPABASE_URL);
console.log("📍 Edge Function URL:", EDGE_FUNCTION_URL);
