# 📒 Address Book (Laravel + Angular) — Manual Completo (Principiantes)

Esta aplicación es una agenda de contactos con:
- **Backend:** Laravel (API REST)
- **Frontend:** Angular 15 + TailwindCSS

✅ Funcionalidades:
- CRUD de contactos (crear, ver, editar, eliminar)
- Búsqueda 
- Paginación
- Email automático al crear contacto (**modo prueba: se guarda en log**)

---

## ✅ 0) Checklist general (antes de empezar)

### 🧰 Herramientas necesarias
- [ ] **Git**
- [ ] **PHP 8.3+**
- [ ] **Composer**
- [ ] **MySQL / MariaDB**
- [ ] **Node.js + npm**
- [ ] **Angular CLI 15**
- [ ] (Recomendado) **Laragon** (trae PHP + MySQL en Windows)
- [ ] (Opcional) **VS Code**

---

## ✅ 2) Instalación de herramientas (si no las tienes)

## 🚀 Comandos para levantar el proyecto (Backend + Frontend)

> Abre **2 terminales**: una para el backend y otra para el frontend.

---

### ✅  Terminal 1 — Backend (Laravel)

1) Ir a la raíz del proyecto:
cd Backend 
php artisan serve
✅ Backend corriendo en:
http://127.0.0.1:8000
### ✅ Probar API:
http://127.0.0.1:8000/api/contacts

### ✅  Terminal 2 — Frontent (Angular)

1) Ir a la raíz del proyecto:
2) cd frontend
✅ Instalar dependencias::
npm install
ejecutar para levantar angular: ng serve -o
### ✅ Frontend corriendo en:
http://localhost:4200/contacts
