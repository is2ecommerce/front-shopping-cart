# Guía Rápida: Conectar Frontend y Backend

## 🎯 Resumen

Esta guía te ayudará a conectar **front-shopping-cart** (Angular) con **back-shopping-cart** (Spring Boot) en una arquitectura de microservicios con Keycloak.

## ✅ Cambios Realizados

### Frontend (Angular)
1. ✅ **Servicio HTTP creado** (`src/app/services/cart.service.ts`)
   - Métodos para: obtener carrito, agregar/actualizar/eliminar items, checkout
   - **SIN headers JWT** (Keycloak los inyecta automáticamente)

2. ✅ **Modelos TypeScript** (`src/app/models/cart.model.ts`)
   - Interfaces que mapean con las clases Java del backend

3. ✅ **Variables de entorno** (`src/environments/`)
   - `environment.ts`: desarrollo → `http://localhost:8080/shopping-cart/api`
   - `environment.prod.ts`: producción → actualizar con URL real

4. ✅ **HttpClient habilitado** (`src/app/app.config.ts`)
   - `provideHttpClient(withFetch())`

5. ✅ **Componentes actualizados**
   - `shopping-cart.ts`: integrado con el servicio, carga datos reales
   - `checkout.ts`: llama al endpoint `/checkout` del backend

### Backend (Spring Boot)
1. ✅ **CORS eliminado** - Keycloak maneja la seguridad
2. ✅ **Endpoints ya disponibles** en `/api/cart/*`

## 🚀 Pasos para Probar la Integración

### 1. Instalar Dependencias del Frontend

```powershell
cd c:\Github\front-shopping-cart
npm install
```

### 2. Levantar el Backend

```powershell
cd c:\Github\back-shopping-cart
.\gradlew bootRun
```

**Verificar que esté corriendo**:
```powershell
curl http://localhost:8080/shopping-cart/actuator/health
```

### 3. Levantar el Frontend

```powershell
cd c:\Github\front-shopping-cart
npm start
```

**Acceder a**: http://localhost:4200

### 4. Probar la Conexión

El frontend intentará conectarse al backend automáticamente:
- Si el backend NO está corriendo → mostrará datos mock
- Si el backend SÍ está corriendo → cargará datos reales

## ⚠️ Nota Importante: Keycloak

**Actualmente el código está listo para Keycloak**, pero para probarlo sin Keycloak:

### Opción A: Desarrollo Sin Keycloak (Temporal)

Comentar la validación JWT en el controlador temporalmente:

**Backend** - `ShoppingCartController.java`:
```java
@GetMapping
public ResponseEntity<ShoppingCart> getCart(
    // @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) String jwt
) {
    // UUID userId = Tools.extractUserId(jwt);
    UUID userId = UUID.fromString("123e4567-e89b-12d3-a456-426614174000"); // Usuario mock
    return ResponseEntity.ok(cartService.getCart(userId));
}
```

**Repetir para todos los endpoints** (addItem, updateItemQuantity, removeItemFromCart, checkout).

### Opción B: Integración Completa con Keycloak

Seguir la guía completa en: `MICROSERVICES_INTEGRATION.md`

## 🔧 Configuración de Puertos

Para evitar conflictos con Keycloak, ajustar el puerto del backend:

**Backend** - `application.yml`:
```yaml
server:
  port: 8081  # Cambiar de 8080 a 8081
  servlet:
    context-path: /shopping-cart
```

**Frontend** - `environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/shopping-cart/api'  // Puerto 8081
};
```

## 📋 Checklist de Verificación

- [ ] Backend corriendo en puerto 8080 (o 8081 si Keycloak está en 8080)
- [ ] Redis corriendo en puerto 6379
- [ ] RabbitMQ corriendo en puerto 5672
- [ ] Frontend corriendo en puerto 4200
- [ ] Navegador puede acceder a http://localhost:4200
- [ ] Consola del navegador NO muestra errores CORS
- [ ] Endpoint `/api/cart` responde correctamente

## 🐛 Troubleshooting

### Error: "ng: El término 'ng' no se reconoce"
**Solución**:
```powershell
npm install
npm start  # Usa el script local de package.json
```

### Error: CORS blocked
**Solución**: 
- Verificar que NO haya `CorsConfig.java` en el backend (ya eliminado)
- Si Keycloak NO está activo, agregar CORS temporal solo para desarrollo

### Error: 401 Unauthorized
**Solución**: 
- **Sin Keycloak**: comentar validación JWT (ver Opción A arriba)
- **Con Keycloak**: verificar que el token sea válido

### Error: Cannot GET /api/cart
**Solución**:
- Verificar que el backend esté corriendo
- Confirmar el puerto y context-path en `application.yml`
- URL debe ser: `http://localhost:8080/shopping-cart/api/cart`

## 📚 Archivos Clave Creados/Modificados

```
front-shopping-cart/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── cart.service.ts          ✨ NUEVO - Servicio HTTP
│   │   ├── models/
│   │   │   └── cart.model.ts            ✨ ACTUALIZADO - Modelos
│   │   ├── components/
│   │   │   ├── shopping-cart/
│   │   │   │   └── shopping-cart.ts     ✅ MODIFICADO - Usa servicio
│   │   │   └── checkout/
│   │   │       └── checkout.ts          ✅ MODIFICADO - Usa servicio
│   │   └── app.config.ts                ✅ MODIFICADO - HttpClient
│   └── environments/
│       ├── environment.ts               ✨ NUEVO
│       └── environment.prod.ts          ✨ NUEVO
└── MICROSERVICES_INTEGRATION.md        ✨ NUEVO - Guía completa

back-shopping-cart/
└── src/main/java/ecommerce/cart/
    └── config/
        └── CorsConfig.java              ❌ ELIMINADO
```

## 🎉 Siguiente Paso

**Ver documentación completa**: `MICROSERVICES_INTEGRATION.md`

Incluye:
- Arquitectura detallada
- Configuración de Keycloak
- Flujo de autenticación
- Ejemplos de código
- Referencias y recursos
