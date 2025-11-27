# Integración de Microservicios con Keycloak

Este documento describe la arquitectura de microservicios para el sistema de e-commerce y cómo conectar el frontend Angular con el backend Spring Boot a través de Keycloak.

## 🏗️ Arquitectura de Microservicios

```
┌─────────────────┐
│   Keycloak      │ (Gateway de Autenticación)
│   (Puerto 8080) │
└────────┬────────┘
         │
         ├──────────────────────┬─────────────────────┐
         │                      │                     │
┌────────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│  Frontend       │   │  Backend        │   │  Otros         │
│  Angular        │   │  Shopping Cart  │   │  Microservicios│
│  (Puerto 4200)  │   │  (Puerto 8080)  │   │                │
└─────────────────┘   └─────────────────┘   └────────────────┘
```

## ⚙️ Configuración del Backend (Spring Boot)

### 1. URLs del Backend

El backend está configurado en:
- **Context Path**: `/shopping-cart`
- **Puerto**: `8080` (por defecto de Spring Boot, configurable en `application.yml`)
- **Base URL API**: `http://localhost:8080/shopping-cart/api`

### 2. Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cart` | Obtener el carrito del usuario |
| POST | `/api/cart/items?productId={uuid}` | Agregar producto al carrito |
| PUT | `/api/cart/items?productId={uuid}&quantity={n}` | Actualizar cantidad de producto |
| DELETE | `/api/cart/items?productId={uuid}` | Eliminar producto del carrito |
| POST | `/api/cart/checkout` | Procesar checkout del carrito |

### 3. Configuración Sin CORS (Keycloak maneja la seguridad)

El backend **NO requiere** configuración CORS porque:
- Keycloak actúa como API Gateway
- Todas las peticiones pasan por Keycloak primero
- Keycloak valida tokens y redirige al microservicio correspondiente

### 4. Headers Esperados (Manejados por Keycloak)

Keycloak inyecta automáticamente:
- `Authorization: Bearer <token>` - Token JWT del usuario
- Headers de usuario extraídos del token (userId, roles, etc.)

El backend extrae el `userId` del JWT usando:
```java
UUID userId = Tools.extractUserId(jwt);
```

## 🎨 Configuración del Frontend (Angular)

### 1. Variables de Entorno

**Desarrollo** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/shopping-cart/api'
};
```

**Producción** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-keycloak-gateway.com/shopping-cart/api'
};
```

### 2. Servicio HTTP sin Autenticación Manual

El `CartService` NO incluye:
- ❌ Headers `Authorization` manuales
- ❌ Manejo de tokens JWT
- ❌ Lógica de refresh tokens

**Keycloak se encarga de:**
- ✅ Autenticar al usuario
- ✅ Inyectar el token JWT en cada petición
- ✅ Renovar tokens automáticamente
- ✅ Redirigir al login si el token expira

### 3. Ejemplo de Petición desde Angular

```typescript
// El servicio hace una petición simple sin headers de autenticación
this.http.get<ShoppingCart>('http://localhost:8080/shopping-cart/api/cart')
  .subscribe(cart => console.log(cart));

// Keycloak intercepta y añade:
// Authorization: Bearer eyJhbGc...
```

## 🔐 Integración con Keycloak

### 1. Configuración del Cliente Keycloak (Frontend)

En Keycloak Admin Console:

1. **Crear Cliente**:
   - Client ID: `shopping-cart-frontend`
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:4200/*`
   - Web Origins: `http://localhost:4200`

2. **Instalar Keycloak Adapter en Angular**:
```powershell
npm install keycloak-angular keycloak-js
```

3. **Configurar en `app.config.ts`**:
```typescript
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080/auth',
        realm: 'ecommerce',
        clientId: 'shopping-cart-frontend'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    provideHttpClient(withFetch())
  ]
};
```

### 2. Configuración del Resource Server (Backend)

En `application.yml`:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/auth/realms/ecommerce
          jwk-set-uri: http://localhost:8080/auth/realms/ecommerce/protocol/openid-connect/certs

server:
  port: 8081  # Diferente del puerto de Keycloak
  servlet:
    context-path: /shopping-cart
```

### 3. Flujo de Autenticación

```
1. Usuario accede a http://localhost:4200
   ↓
2. Keycloak Angular verifica si hay sesión
   ↓
3. Si no hay sesión → Redirige a Keycloak Login
   ↓
4. Usuario se autentica en Keycloak
   ↓
5. Keycloak devuelve token JWT al frontend
   ↓
6. Frontend hace petición a /api/cart
   ↓
7. Keycloak intercepta y añade header Authorization
   ↓
8. Backend valida token JWT con Keycloak
   ↓
9. Backend responde con datos del carrito
```

## 🚀 Pasos para Ejecutar

### 1. Levantar Keycloak

```powershell
# Usando Docker
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

### 2. Configurar Realm en Keycloak

1. Acceder a http://localhost:8080/admin
2. Crear realm `ecommerce`
3. Crear cliente `shopping-cart-frontend`
4. Crear roles y usuarios de prueba

### 3. Levantar Backend (Shopping Cart)

```powershell
cd c:\Github\back-shopping-cart
.\gradlew bootRun
```

El backend estará disponible en: `http://localhost:8081/shopping-cart`

### 4. Levantar Frontend (Angular)

```powershell
cd c:\Github\front-shopping-cart
npm install
npm start
```

El frontend estará disponible en: `http://localhost:4200`

## 🔍 Verificación de la Integración

### 1. Verificar que Keycloak está corriendo

```powershell
curl http://localhost:8080/auth/realms/ecommerce/.well-known/openid-configuration
```

### 2. Verificar que el Backend está corriendo

```powershell
curl http://localhost:8081/shopping-cart/actuator/health
```

### 3. Probar Endpoint Protegido (requiere token)

```powershell
# Primero obtener token de Keycloak
$token = "eyJhbGc..." # Token JWT obtenido de Keycloak

# Hacer petición con token
curl -H "Authorization: Bearer $token" http://localhost:8081/shopping-cart/api/cart
```

## 📝 Notas Importantes

1. **Sin CORS Manual**: No agregar configuración CORS en el backend, Keycloak lo maneja
2. **Sin JWT Manual**: No manejar tokens JWT manualmente en Angular, Keycloak lo hace automáticamente
3. **Puertos**:
   - Frontend: 4200
   - Backend: 8081 (NO 8080, para evitar conflicto con Keycloak)
   - Keycloak: 8080
4. **Dependencias del Backend**:
   - Redis: Puerto 6379 (para sesiones)
   - RabbitMQ: Puerto 5672 (para mensajería)
   - Catalog Service: Puerto 8082 (otro microservicio)

## 🛠️ Troubleshooting

### Problema: CORS Error
**Solución**: Verificar que todas las peticiones pasen por Keycloak, no directamente al backend.

### Problema: 401 Unauthorized
**Solución**: 
1. Verificar que el token JWT no haya expirado
2. Confirmar que Keycloak está validando correctamente
3. Revisar logs del backend para ver el error específico

### Problema: Frontend no puede conectarse al backend
**Solución**:
1. Verificar que `environment.apiUrl` apunte a la URL correcta
2. Confirmar que el backend esté corriendo en el puerto configurado
3. Revisar la consola del navegador para errores de red

## 📚 Referencias

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak Angular Adapter](https://github.com/mauriciovigolo/keycloak-angular)
- [Spring Security OAuth2 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html)
