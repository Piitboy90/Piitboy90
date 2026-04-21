# 📝 Resumidor de Textos con OpenAI + Supabase

## 🎯 Descripción del Proyecto

Aplicación web full-stack que integra la API de OpenAI para resumir textos automáticamente. 

**Stack:**
- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Backend:** Supabase Edge Functions (TypeScript/Deno)
- **API:** OpenAI GPT-3.5 Turbo
- **Base de datos:** Supabase PostgreSQL

---

## 🏗️ Arquitectura
┌─────────────────────────────────────────────────────────┐
│              NAVEGADOR (Frontend)                       │
│  • Textarea para input de usuario                       │
│  • Botón "Resumir Texto"                               │
│  • Muestra resultado en tiempo real                     │
└────────────────────┬────────────────────────────────────┘
│ fetch() POST
↓
┌─────────────────────────────────────────────────────────┐
│         SUPABASE EDGE FUNCTION (Backend)               │
│  • Recibe texto del usuario                            │
│  • Llama a OpenAI API (con clave segura)              │
│  • Procesa respuesta y devuelve resumen               │
└────────────────────┬────────────────────────────────────┘
│ HTTP POST
↓
┌────────────────────┐
│  OpenAI API GPT    │
│  (en internet)     │
└────────────────────┘
---

## 📂 Estructura de Archivos
resumidor-openai/
├── frontend/
│   ├── index.html          # Estructura HTML
│   ├── style.css           # Estilos CSS
│   └── script.js           # Lógica JavaScript
├── backend/
│   └── edge-function.ts    # Edge Function (Supabase)
├── .env.example            # Variables de entorno (ejemplo)
└── README.md               # Este archivo
---

## 🚀 Cómo Usar

### 1. **Clonar el Repositorio**

```bash
git clone https://github.com/Piitboy90/Piitboy90.git
cd Piitboy90/resumidor-openai
```

### 2. **Configurar Backend (Supabase)**

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Crear una Edge Function llamada `resumidor-openai`
3. Pegar el código de `backend/edge-function.ts`
4. Agregar variable de entorno: `OPENAI_API_KEY` con tu clave de OpenAI
5. Desactivar JWT verification en Settings → "Verify JWT with legacy secret" (OFF)
6. Copiar la URL de la función

### 3. **Configurar Frontend**

1. Abrir `frontend/index.html` en un navegador
2. O servir con un servidor local:
```bash
   python -m http.server 8000
   # O con Node.js:
   npx http-server
```

### 4. **Actualizar Variables**

En `frontend/script.js`, actualizar:
```javascript
const SUPABASE_URL = "https://tu-proyecto.supabase.co";
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/resumidor-openai`;
```

---

## 🔑 Variables de Entorno

Crear archivo `.env` (o `.env.local`) con:
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
**Nota:** El `.env` NUNCA se sube a GitHub. Ver `.env.example`.

---

## 📝 Conceptos Clave Aprendidos

| Concepto | Descripción |
|----------|-------------|
| **async/await** | Esperar promesas de red sin bloquear la UI |
| **fetch API** | Enviar peticiones HTTP desde el navegador |
| **Edge Functions** | Funciones serverless en Supabase (backend seguro) |
| **API Keys** | Autenticación en servicios externos (OpenAI) |
| **CORS** | Controlar peticiones entre dominios |
| **JSON** | Formato estándar de datos en APIs |

---

## 🧪 Testing

### Test Manual
1. Pegar texto en el textarea
2. Hacer clic en "Resumir Texto"
3. Esperar 2-5 segundos
4. Ver resumen generado

### Errores Comunes
- **401 Unauthorized:** Verificar JWT settings en Supabase
- **500 Internal Server Error:** Verificar API key de OpenAI
- **Network Error:** Verificar CORS headers en Edge Function

---

## 📊 Flujo de la Aplicación
[Usuario escribe texto]
↓
[Hace clic en "Resumir"]
↓
[JavaScript valida entrada]
↓
[fetch() envía a Edge Function]
↓
[Edge Function recibe POST]
↓
[Edge Function autentica con OpenAI]
↓
[OpenAI procesa y devuelve resumen]
↓
[Edge Function devuelve JSON al frontend]
↓
[Frontend muestra resultado]
---

## 🔒 Seguridad

✅ **Bien Implementado:**
- API key de OpenAI almacenada en servidor (Edge Function)
- No expuesta en código del navegador
- CORS configurado correctamente
- Validación de entrada en backend

⚠️ **Mejoras Futuras:**
- Rate limiting por usuario
- Autenticación de usuarios
- Log de auditoría
- Caché de resultados

---

## 💡 Casos de Uso

- 📚 Resumir artículos largos
- 📄 Generar abstracts de documentos
- 💬 Procesar feedback de clientes
- 📰 Curar noticias
- 🎓 Material educativo

---

## 🛠️ Tech Stack Detallado

| Tecnología | Propósito |
|-----------|-----------|
| HTML5 | Estructura semántica |
| CSS3 | Diseño responsivo y variables CSS |
| JavaScript ES6+ | Lógica de aplicación |
| Supabase | Backend serverless |
| OpenAI API | Procesamiento de IA |
| Deno | Runtime de Edge Functions |
| TypeScript | Tipado en backend |

---

## 📈 Métricas y Aprendizajes

**Tiempo de desarrollo:** ~2 horas (diseño + implementación)

**Conceptos practicados:**
- ✅ Integración de APIs externas
- ✅ Arquitectura frontend-backend
- ✅ Manejo de errores
- ✅ UX con loading states
- ✅ CORS y autenticación

---

## 🔗 Links Útiles

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [MDN Web Docs - fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [GitHub - Piitboy90](https://github.com/Piitboy90)

---

## 👨‍💻 Autor

**Peter Siteng Tumpap**
- GitHub: [@Piitboy90](https://github.com/Piitboy90)
- Objetivo: Full Stack Web Developer + AI Implementation Specialist
- Ubicación: Madrid, España

---

## 📄 Licencia

Este proyecto es público y está disponible bajo licencia MIT.

---

**Última actualización:** 21 de abril de 2026

Proyecto resumidor-openai: estructura inicial y documentación
