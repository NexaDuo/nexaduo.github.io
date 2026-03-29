# NexaDuo

Site institucional da NexaDuo — consultoria tecnologica, dados & analytics e saude digital.

**https://nexaduo.com**

## Stack

- HTML5, CSS3, JavaScript (vanilla, sem frameworks)
- Font Awesome 6.5 (icones)
- Google Fonts (Inter)
- GitHub Pages (deploy automatico)

## Estrutura

```
index.html        # Pagina unica com CSS critico inline
styles.css        # Estilos completos
script.js         # Navegacao, scroll effects, animacoes
tests/
  site.test.mjs   # 53 testes Playwright (desktop, mobile, a11y)
assets/
  *.webp, *.png   # Logo, fotos da equipe (WebP + fallback)
  favicon/        # Favicons + web manifest
```

## Desenvolvimento

```bash
# Servidor local
python3 -m http.server 8080

# Testes (headless)
npm test

# Testes (com browser visivel)
npm run test:headed
```

## Deploy

Push na branch `main` publica automaticamente via GitHub Pages.

## Contato

- contato@nexaduo.com
- Porto Alegre, RS — Brasil
- CNPJ: 29.667.108/0001-14
