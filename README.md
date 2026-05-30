# 💻 CodeCrush — LoveCode Web Edition
 
> *Donde los devs encuentran su match perfecto* ❤️
 
Aplicación web de matching para desarrolladores. Regístrate con tus tecnologías, desliza perfiles de otros programadores y, si el like es mutuo, ¡es un match!
 
---
 
## 🚀 Tech Stack
 
| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5 · CSS3 · JavaScript ES6+ (vanilla) |
| Backend | Java 17 · Spring Boot 3.x |
| Base de datos | MySQL 11.8 (Docker) |
| Contenedores | Docker / Docker Compose |
 
---
 
## 📁 Estructura del proyecto
 
```
codecrush/
│
├── 📂 Frontend
│   ├── index.html            # Landing page
│   ├── login.html            # Inicio de sesión
│   ├── Registrer.html        # Registro de usuario
│   ├── Dashboard.html        # Swipe de perfiles
│   ├── Maches.html           # Mis matches
│   │
│   ├── style.css             # Estilos globales
│   ├── DashboardStyle.css    # Estilos del dashboard
│   ├── MatchesStyle.css      # Estilos de matches
│   │
│   ├── Formlogin.js          # Lógica del login
│   ├── Formregistrer.js      # Lógica del registro
│   ├── Dashboardfuncion.js   # Motor de swipe + likes
│   └── Machesfuncion.js      # Carga de matches
│
├── 📂 Backend (com.example.BackEnd)
│   ├── Main.java             # Punto de entrada Spring Boot
│   ├── CorsConfig.java       # Configuración CORS
│   ├── Variables.java        # Credenciales JDBC
│   │
│   ├── Usuario.java / UsuarioDAO.java / UsuarioController.java
│   ├── Like.java    / LikeDAO.java    / LikeController.java
│   ├── Mach.java    / MachDAO.java    / MachController.java
│   └── Tecnologia.java / TecnologiaDAO.java / TecnologiaController.java
│
├── 📂 Base de Datos
│   ├── Estructura.sql        # Schema completo con tablas, triggers y procedimientos
│   └── LoveCodeDump.sql      # Dump de la BD con datos de prueba
│
└── 📂dockerDatabase 
    └── docker-compose.yaml    # Levanta MySQL en Docker

```
 
---
 
## ⚙️ Instalación y puesta en marcha
 
### Requisitos previos
 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Java 17+](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (o usar el wrapper del IDE)
- Navegador moderno (Chrome, Firefox, Edge)
---
 
### 1. Levantar la base de datos
 
```bash
docker-compose up -d
```
 
Esto arranca MySQL en el puerto **3306** con las siguientes credenciales:
 
| Parámetro | Valor |
|-----------|-------|
| Host | `localhost` |
| Puerto | `3306` |
| Base de datos | `LoveCode` |
| Usuario root | `root` |
| Contraseña root | `root` |
 
### 2. Inicializar el schema
 
Ejecuta el archivo `LoveCodeDump.sql` en tu cliente de base de datos (DBeaver, MySQL Workbench, etc.) o desde la línea de comandos:
 
```bash
mysql -h localhost -u root -proot LoveCode < LoveCodeDump.sql
```
 
> Si es la primera vez y la BD está vacía, usa `Estructura.sql` para crear las tablas, triggers y procedimientos almacenados.
 
### 3. Arrancar el backend
 
Desde el IDE (VS / Eclipse) ejecuta la clase `Main.java`, o desde la terminal:
 
```bash
mvn spring-boot:run
```
 
El servidor arranca en **http://localhost:8080**
 
### 4. Abrir el frontend
 
Abre `index.html` directamente en el navegador o sírvelo con Live Server (extensión de VS Code):
 
```
http://localhost:5500/index.html
```
 
---
 
## 🔌 API REST — Endpoints
 
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/registro` | Registra un nuevo usuario |
| `POST` | `/api/login` | Autentica al usuario |
| `GET`  | `/api/usuarios` | Lista todos los perfiles |
| `POST` | `/api/likes` | Registra un like (detecta match si es mutuo) |
| `GET`  | `/api/matches/{id}` | Matches del usuario con info del otro perfil |
| `GET`  | `/api/tecnologias` | Catálogo de tecnologías |
| `POST` | `/api/tecnologias/vincular` | Vincula tecnologías a un usuario |
 
### Ejemplo — Dar like
 
```http
POST http://localhost:8080/api/likes
Content-Type: application/json
 
{
  "idOrigen": 1,
  "idDestino": 2
}
```
 
**Respuesta:**
```json
{
  "insertado": true,
  "match": false
}
```
 
Si ambos usuarios se han dado like mutuamente, `match` devuelve `true`.
 
---
 
## 🗄️ Modelo de Base de Datos
 
```
usuario ──< Usuarios_Tecnologias >── Tecnologia
usuario (emisor) ──< Likes >── usuario (receptor)
usuario ──< Matches >── usuario
```
 
| Tabla | Descripción |
|-------|-------------|
| `usuario` | Usuarios registrados (nombre, correo, password, bio) |
| `Tecnologia` | Catálogo normalizado de tecnologías |
| `Usuarios_Tecnologias` | Relación N:M usuario ↔ tecnología |
| `Likes` | Likes emitidos entre usuarios |
| `Matches` | Matches mutuos generados automáticamente |
 
El match se detecta en **dos capas** para garantizar consistencia:
1. **Backend** — `LikeDAO.darLike()` comprueba reciprocidad y llama a `MachDAO.crearMatch()`
2. **Trigger SQL** — `after_like_insert` actúa como segunda línea de seguridad directamente en la BD
---
 
## 🎮 Cómo usar la app
 
1. Ve a `index.html` → **Crear cuenta**
2. Rellena nombre, correo, contraseña, bio y selecciona tus tecnologías
3. Inicia sesión con tu correo y contraseña
4. En el dashboard, desliza tarjetas:
   - ➡️ **Derecha / ❤️** → Like
   - ⬅️ **Izquierda / ✕** → Pasar
   - ⬆️ **Arriba / ↺** → Saltar
   - También puedes usar las **teclas de flecha** del teclado
5. Si alguien te da like de vuelta → **💞 ¡Es un match!**
6. Pulsa **💞 Matches** para ver tus coincidencias
---
 
## 💾 Backup de la base de datos
 
El script `Backup_LoveCode.ps1` genera automáticamente un volcado SQL con timestamp:
 
```powershell
.\Backup_LoveCode.ps1
# Genera: backup_LoveCode_20260527_143000.sql
```
 
---
 
## ⚠️ Notas de seguridad (Por implementar)
 
> Este proyecto es un entorno de **desarrollo/aprendizaje**. Antes de desplegarlo en producción habría que:
> - Hashear las contraseñas con **BCrypt**
> - Implementar autenticación con **JWT**
> - Restringir **CORS** a dominios conocidos
> - Externalizar las credenciales a **variables de entorno**
 
---
 
## 📜 Licencia
 
Proyecto académico — Proyecto Integrado DAW · 2026