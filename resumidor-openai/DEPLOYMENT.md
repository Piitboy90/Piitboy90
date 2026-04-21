# 🚀 GUÍA DE DEPLOYMENT

## Índice
1. [Configuración Local](#configuración-local)
2. [Deployment en Supabase](#deployment-en-supabase)
3. [Deployment en GitHub Pages](#deployment-en-github-pages)
4. [Troubleshooting](#troubleshooting)

---

## 🖥️ Configuración Local

### Requisitos
- Node.js 16+ (opcional, solo para servidor local)
- Git
- Editor de código (VSCode recomendado)
- Navegador moderno

### Pasos

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Piitboy90/Piitboy90.git
cd Piitboy90/resumidor-openai
```

2. **Crear archivo `.env.local`:**
```bash
cp .env.example .env.local
---

## 🔍 Troubleshooting

### Error 401: Unauthorized

**Síntomas:** "server responded with a status of 401"

**Causa:** JWT verification activado en Supabase

**Solución:**
1. Ve a Supabase Dashboard
2. Edge Functions → resumidor-openai → Settings
3. Desactiva "Verify JWT with legacy secret"
4. Guarda cambios

---

### Error 500: Internal Server Error

**Síntomas:** "Error en Edge Function"

**Causa:** OPENAI_API_KEY no configurada o inválida

**Solución:**
1. Verificar que la API key es válida en OpenAI Dashboard
2. Regenerar si es necesario
3. Actualizar secret en Supabase:
```bash
supabase secrets set OPENAI_API_KEY=sk-proj-nueva-key
```
4. Redeploy:
```bash
supabase functions deploy resumidor-openai
```

---

### CORS Error

**Síntomas:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Causa:** Headers CORS incorrectos

**Solución:** Verificar que Edge Function tiene:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
```

---

### La app no carga en GitHub Pages

**Causa:** Rutas relativas incorrectas

**Solución:**
- En `index.html`, asegúrate que:
```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```
- NO uses rutas absolutas como `/style.css`

---

## 📊 Monitoreo

### Ver logs de Edge Function

```bash
supabase functions logs resumidor-openai
```

### Ver métricas en Supabase Dashboard

1. Ir a Edge Functions
2. Haz clic en `resumidor-openai`
3. Pestaña `Invocations` → Ver requests recientes
4. Pestaña `Logs` → Ver console.log()

---

## 🔐 Seguridad en Producción

### Checklist

- ✅ OPENAI_API_KEY en Supabase Secrets (NO en código)
- ✅ `.env.local` en `.gitignore`
- ✅ CORS headers configurados
- ✅ Rate limiting en Edge Function (recomendado)
- ✅ Input validation en backend
- ✅ Error handling sin exponer detalles sensibles

### Mejorar seguridad

1. **Rate Limiting:**
```typescript
const MAX_REQUESTS_PER_MINUTE = 10;
// Implementar en Edge Function
```

2. **Autenticación de usuarios:**
```typescript
const user = await supabase.auth.getUser();
if (!user) return error(401);
```

3. **Logs de auditoría:**
```typescript
await supabase
  .from('logs')
  .insert({ user_id, action, timestamp });
```

---

## 🚀 Próximos Pasos

- [ ] Agregar autenticación de usuarios
- [ ] Implementar caché de resultados
- [ ] Agregar rate limiting
- [ ] Crear dashboard de analytics
- [ ] Integrar con base de datos para histórico
- [ ] Agregar tests automatizados

---

## 📞 Support

- [Docs OpenAI](https://platform.openai.com/docs)
- [Docs Supabase](https://supabase.com/docs)
- [GitHub Issues](https://github.com/Piitboy90/Piitboy90/issues)

---

**Última actualización:** 21 de abril de 2026
```

3. **Editar `.env.local` con tus datos:**
