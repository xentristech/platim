<div align="center">

<img src="https://www.platim.co/assets/images/logos/logo-isoh.png" alt="PLATIM" width="320" />

### Seguridad que inspira confianza

**Sitio web corporativo de PLATIM — Dotaindustria Platim**
Elementos de Protección Personal · Uniformes · Calzado de Seguridad · Colombia

<br/>

[![Sitio en vivo](https://img.shields.io/badge/🌐_Ver_sitio_en_vivo-platim.co-6BAA1F?style=for-the-badge&labelColor=0D1B2A)](https://www.platim.co)
[![Deploy](https://img.shields.io/badge/CI%2FCD-GitHub_Actions_→_Hostinger-2088FF?style=for-the-badge&logo=githubactions&logoColor=white&labelColor=0D1B2A)](https://github.com/xentristech/platim/actions)

<br/>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Sin frameworks](https://img.shields.io/badge/Sin_frameworks-vanilla-6BAA1F?style=flat-square)
![SEO](https://img.shields.io/badge/SEO_+_IA-AEO%2FGEO-A7D957?style=flat-square)
![Hecho en Colombia](https://img.shields.io/badge/Hecho_en-Colombia-FCD116?style=flat-square&labelColor=003893)

</div>

---

<div align="center">
  <img src="https://www.platim.co/assets/images/hero800x800.png" alt="Equipo PLATIM con dotación de seguridad" width="80%" style="border-radius:16px" />
</div>

---

## 🎯 Sobre el proyecto

**PLATIM** es una empresa colombiana que dota a otras empresas con **Elementos de Protección Personal (EPP), uniformes corporativos y calzado de seguridad**. Este repositorio contiene su sitio web corporativo: rápido, accesible, optimizado para buscadores tradicionales **y de IA**, y con despliegue 100% automatizado.

> [!NOTE]
> Un sitio **estático puro** (HTML + CSS + JS, sin frameworks ni build) que aun así incorpora sistema de diseño propio, URLs limpias, datos estructurados, optimización para motores generativos y CI/CD. Demostración de que lo simple, bien hecho, rinde.

<div align="center">

### 👉 [**www.platim.co**](https://www.platim.co) 👈

</div>

---

## ✨ Características

| | Característica | Detalle |
|:--:|---|---|
| 🎨 | **Sistema de diseño propio** | Paleta, tipografía y componentes reutilizables en CSS modular (`variables`, `components`, `responsive`) |
| 📱 | **100% responsive** | Adaptado a móvil, tablet y escritorio con menú móvil accesible |
| 🔗 | **URLs limpias** | Sin `.html` (`/epp`, `/uniformes`…) vía `.htaccess` con redirecciones 301 |
| ⚡ | **Rendimiento** | Lazy loading, `fetchpriority` en el hero, imágenes dimensionadas (cero CLS), caché y GZIP |
| ♿ | **Accesibilidad** | HTML semántico, `aria-labels`, foco visible, `skip links`, `prefers-reduced-motion` |
| 🔍 | **SEO técnico** | Meta tags, Open Graph, canonical, `sitemap.xml`, datos estructurados Schema.org |
| 🤖 | **SEO para IA (AEO/GEO)** | `FAQPage` schema, `llms.txt` y `robots.txt` que habilita ChatGPT, Perplexity y Google AI |
| 💬 | **Cotización por WhatsApp** | El formulario arma el mensaje y abre WhatsApp con un clic |
| 🚀 | **Despliegue automático** | `git push` → publicado en producción en segundos |

---

## 🛠️ Stack tecnológico

<div align="center">

| Frontend | Infraestructura | Automatización |
|:--:|:--:|:--:|
| HTML5 semántico | Hostinger (Apache/LiteSpeed) | GitHub Actions |
| CSS3 (modular, sin frameworks) | Dominio `platim.co` | Deploy por FTP |
| JavaScript vanilla | HTTPS + www forzado | Versionado con Git |
| Google Fonts (Archivo) | Caché y compresión GZIP | — |

</div>

---

## 🚀 Despliegue automático (CI/CD)

Cada cambio en `main` se publica **solo**, sin intervención manual:

```mermaid
flowchart LR
    A[💻 Editar en local] --> B[git push a main]
    B --> C{GitHub Actions}
    C -->|FTP Deploy| D[🌐 Hostinger · public_html]
    D --> E[✅ platim.co actualizado]
    style A fill:#0D1B2A,color:#fff
    style C fill:#2088FF,color:#fff
    style D fill:#6BAA1F,color:#fff
    style E fill:#A7D957,color:#0D1B2A
```

> [!TIP]
> Editar el servidor a mano quedó en el pasado. La fuente de verdad es **GitHub**: se edita, se hace `push`, y el sitio se actualiza en producción automáticamente.

---

## 📁 Estructura del proyecto

```
platim/
├── index.html                 # Inicio
├── epp.html                   # Elementos de Protección Personal
├── uniformes.html             # Uniformes y dotaciones
├── calzado-proteccion.html    # Calzado de seguridad
├── politica-privacidad.html   # Legal · Ley 1581 de 2012
├── terminos-condiciones.html  # Legal
├── 404.html                   # Página de error personalizada
├── llms.txt                   # Resumen del sitio para modelos de IA
├── robots.txt · sitemap.xml   # SEO / rastreo
├── .htaccess                  # URLs limpias, caché, seguridad
├── assets/
│   ├── css/                   # variables · style · components · responsive
│   ├── js/                    # main · menu · forms
│   └── images/                # logos · banners · products
└── .github/workflows/         # deploy.yml (CI/CD)
```

---

## 💻 Desarrollo local

<details>
<summary><b>Ver instrucciones</b></summary>

<br/>

Al ser un sitio estático, basta con un servidor local:

```bash
# Clonar el repositorio
git clone https://github.com/xentristech/platim.git
cd platim

# Levantar un servidor local (Python)
python -m http.server 8000

# Abrir en el navegador
# http://localhost:8000
```

> [!IMPORTANT]
> Las URLs limpias (`/epp` sin `.html`) dependen del `.htaccess` de Apache, que **no** interpreta el servidor de Python. En local usa el menú o agrega `.html`. En producción funcionan perfecto.

</details>

---

## 👤 Autor

Desarrollado por **[xentristech](https://github.com/xentristech)** — diseño, desarrollo y automatización.

<div align="center">

[![Portafolio](https://img.shields.io/badge/🌐_Proyecto-platim.co-6BAA1F?style=for-the-badge&labelColor=0D1B2A)](https://www.platim.co)
[![GitHub](https://img.shields.io/badge/GitHub-xentristech-181717?style=for-the-badge&logo=github)](https://github.com/xentristech)

<br/>

<sub>© 2026 PLATIM — Dotaindustria Platim · Hecho con 💚 en Colombia</sub>

</div>
