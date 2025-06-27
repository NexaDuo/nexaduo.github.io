# NexaDuo - Documentação de Design

## 📋 Informações Gerais
- **Projeto**: Site institucional NexaDuo
- **Data de Análise**: 26 de Junho de 2025
- **Desenvolvedor**: Alexandre Machado & Sheyla Paladini
- **Localização**: Porto Alegre, RS - Brasil

---

## 🎨 Análise Cromática da Logo

### **Metodologia de Análise**
- **Ferramenta**: Python + PIL (Pillow)
- **Arquivo analisado**: `assets/NexaDuo.png` (1024x1024px)
- **Filtros aplicados**: Remoção de background branco e pixels transparentes

### **Descobertas Principais**

#### **Composição da Logo**
- **Total de pixels**: 1.048.576
- **Pixels não-transparentes**: 1.048.576 (100%)
- **Pixels significativos**: 1.046.377 (99.8% background removido)
- **Pixels da marca**: ~2.199 (0.2% contém elementos visuais)

#### **Paleta de Cores Identificada**

| Posição | RGB | Hex | Percentual | Pixels |
|---------|-----|-----|------------|--------|
| 1° | (13, 25, 40) | `#0d1928` | 11.1% | 116.624 |
| 2° | (12, 24, 39) | `#0c1827` | 10.0% | 104.174 |
| 3° | (12, 24, 40) | `#0c1828` | 9.5% | 99.348 |
| 4° | (13, 24, 40) | `#0d1828` | 8.3% | 87.054 |
| 5° | (12, 25, 40) | `#0c1928` | 7.6% | 79.895 |

#### **Características Cromáticas**
- **Família dominante**: 100% Blue-ish colors
- **Tonalidade**: Dark Slate Blue profundo
- **Variação**: Gradiente sutil monocromático
- **Saturação**: Baixa (tons escuros e sofisticados)
- **Brilho**: Muito baixo (valores RGB entre 11-41)

---

## 🎯 Estratégia de Design Aplicada

### **Paleta de Cores Final**

```css
/* Cores Primárias - Baseadas na Logo */
--brand-primary: #0d1928;     /* Cor exata da logo (RGB 13,25,40) */
--brand-secondary: #0c1827;   /* Segunda cor mais presente */
--brand-tertiary: #1e293b;    /* Variação para cards/elementos */

/* Cores de Interação - Versões Claras para UI */
--brand-accent: #3b82f6;      /* Blue-500 para elementos interativos */
--brand-hover: #60a5fa;       /* Blue-400 para hover states */
--brand-light: #93c5fd;       /* Blue-300 para detalhes sutis */

/* Cores de Texto */
--text-primary: #f1f5f9;      /* Slate-100 para títulos */
--text-secondary: #e5e7eb;    /* Gray-200 para texto geral */
--text-muted: #94a3b8;        /* Slate-400 para texto secundário */
--text-nav: #cbd5e1;          /* Slate-300 para navegação */
```

### **Arquitetura Visual**

#### **Layout Structure**
- **Header**: Fixed, transparente com blur effect
- **Hero**: Full viewport com gradiente baseado na logo
- **Services**: Grid responsivo 3→2→1 colunas
- **Contact**: Centralizado com cards de informação
- **Footer**: Background escuro com bordas sutis, 4 colunas (brand, links, contact, social)

#### **Responsive Breakpoints**
```css
/* Desktop First Approach */
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile */ }
@media (max-width: 480px)  { /* Small Mobile */ }
```

---

## 🚀 Componentes e Elementos

### **Cards de Serviços**
```css
.service-card {
    background: #1e293b;                           /* Slate-800 */
    border-top: 4px solid #3b82f6;                /* Brand accent */
    border: 1px solid rgba(59, 130, 246, 0.2);   /* Sutil border */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);  /* Deep shadow */
}

.service-card:hover {
    transform: translateY(-10px);                  /* Lift effect */
    border-top: 4px solid #60a5fa;               /* Lighter on hover */
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.25); /* Brand shadow */
}
```

### **Ícones de Serviços**
```css
.service-icon {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    /* Gradiente azul seguindo a identidade da marca */
}
```

### **Navegação Mobile**
```css
.nav-menu {
    background: #1e293b;                          /* Slate-800 */
    border-left: 1px solid rgba(59, 130, 246, 0.2); /* Brand border */
    /* Slide animation: right: -100% → right: 0 */
}
```

---

## 📱 Especificações Técnicas

### **Tipografia**
- **Font Family**: 'Inter', sans-serif
- **Weights**: 300, 400, 500, 600, 700
- **Responsive Scale**: 
  - H1: 3.5rem → 2.5rem → 2rem
  - H2: 2.5rem → 2rem → 1.75rem
  - Body: 1.25rem → 1.125rem → 1rem

### **Animações e Transições**
```css
/* Elementos Flutuantes (Hero Icons) */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

/* Transições Padrão */
transition: all 0.3s ease;

/* Hover Effects */
transform: translateY(-2px); /* Botões */
transform: translateY(-10px); /* Cards */
```

### **Efeitos Visuais**
- **Backdrop Filter**: `blur(10px)` no header
- **Glassmorphism**: Headers transparentes com blur
- **Gradient Overlays**: Hero section com 3 pontos de cor
- **Box Shadows**: Camadas profundas para depth

---

## 🔧 Ferramentas e Scripts Utilizados

### **Análise de Cores (Python)**
```python
# Script para extrair cores da logo
from PIL import Image
from collections import Counter

def analyze_logo_colors(image_path):
    # Carrega imagem, remove background, conta cores
    # Retorna top 20 cores com percentuais
```

**Arquivos gerados**:
- `analyze_logo.py` - Script básico de análise
- `analyze_logo_detailed.py` - Análise expandida com famílias de cores

### **Servidor de Desenvolvimento**
```bash
# Live Server (Node.js)
npm install -g live-server
live-server --port=8080 --host=0.0.0.0

# Python HTTP Server (Alternativa)
python3 -m http.server 8080
```

---

## 📊 Métricas e Performance

### **Acessibilidade**
- **Contraste**: Ratio mínimo 4.5:1 (WCAG AA)
- **Cores**: Nunca como única forma de informação
- **Focus**: Estados visuais claros para navegação por teclado

### **Responsividade**
- **Mobile First**: Abordagem desktop-first implementada
- **Breakpoints**: 3 principais pontos de quebra
- **Touch Targets**: Mínimo 44px para elementos interativos

### **SEO e Meta Tags**
```html
<title>NexaDuo - Soluções Tecnológicas Inovadoras</title>
<meta name="description" content="Empresa especializada em desenvolvimento de software, consultoria tecnológica e soluções digitais inovadoras.">
<meta name="keywords" content="desenvolvimento, software, tecnologia, consultoria, soluções digitais">
```

---

## 📞 Informações de Contato

### **Equipe**
- **Alexandre Machado**: +55 (51) 981 508 375
- **Sheyla Paladini**: +55 (51) 992 654 423
- **Email**: contato@nexaduo.com
- **CNPJ**: 29.667.108/0001-14
- **Localização**: Porto Alegre, RS - Brasil

### **Redes Sociais**
- LinkedIn: [Pendente]
- GitHub: https://github.com/NexaDuo
- Twitter: [Pendente]
- Instagram: [Pendente]

---

## 🏷️ Tags e Categorias

**Tags**: `web-design`, `color-analysis`, `brand-identity`, `dark-theme`, `responsive-design`, `css-grid`, `logo-analysis`, `nexaduo`

**Categorias**: Desenvolvimento Web, Design de Interface, Análise de Marca, Desenvolvimento Frontend

---

**Última atualização**: 26 de Junho de 2025  
**Versão**: 1.1  
**Status**: ✅ Completo e Implementado

### **Atualizações Recentes**
- ✅ Corrigido header que ficava branco durante rolagem (mantém tema dark)
- ✅ Adicionado link oficial do GitHub (https://github.com/NexaDuo) no footer
- ✅ Expandido footer para 4 colunas incluindo seção de redes sociais
