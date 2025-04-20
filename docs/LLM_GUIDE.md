# Guia para LLMs - UX na Real

## Visão Geral do Projeto
O UX na Real é uma plataforma focada em análise e avaliação de experiência do usuário. O projeto utiliza Next.js com TypeScript e Tailwind CSS para o desenvolvimento.

## Estrutura do Projeto
```
src/
├── app/              # Rotas e páginas da aplicação
├── components/       # Componentes React
│   ├── shared/      # Componentes compartilhados
│   ├── ui/          # Componentes de interface básicos
│   └── heuristics/  # Componentes específicos de heurísticas
├── hooks/           # Hooks personalizados
├── lib/             # Utilitários e funções auxiliares
└── styles/          # Estilos globais e configurações CSS
```

## Design System

### Cores
- Fundo principal: `#1c1c1d`
- Borda padrão: `#2d2d2d`
- Texto primário: `#ffffff`
- Texto secundário: `#9ca3af`
- Destaque/primário: `#A8E80E`

### Tipografia
- Fonte padrão: ui-sans-serif, system-ui, sans-serif
- Tamanhos de texto:
  - Corpo: 0.875rem (14px)
  - Títulos: Variável conforme necessidade

### Espaçamento
- Padding padrão: 1rem (16px)
- Gap entre elementos: 0.5rem (8px)
- Margens: Múltiplos de 0.25rem

### Bordas
- Todas as bordas são definidas globalmente com:
  ```css
  *, ::before, ::after {
    border-style: solid;
    border-color: #e5e7eb;
  }
  ```
- Bordas específicas devem sobrescrever essas propriedades quando necessário

## Padrões de Código

### Componentes
- Todos os componentes devem ser escritos em TypeScript
- Use `'use client'` para componentes que precisam de interatividade
- Mantenha os componentes pequenos e focados em uma única responsabilidade
- Evite componentes com mais de 200-300 linhas

### Estilização
- Use Tailwind CSS para estilização
- Evite estilos inline quando possível
- Mantenha consistência com o design system
- Use variáveis CSS para cores e valores repetidos

### Responsividade
- Use prefixos do Tailwind para breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- Sempre considere a experiência mobile primeiro

## Convenções Importantes

### Nomenclatura
- Componentes: PascalCase (ex: `Sidebar.tsx`)
- Arquivos de estilo: kebab-case (ex: `globals.css`)
- Hooks: camelCase com prefixo 'use' (ex: `useAuth.ts`)

### Estrutura de Componentes
1. Importações
2. Tipos/Interfaces
3. Constantes
4. Componente Principal
5. Subcomponentes (se necessário)

### Acessibilidade
- Sempre inclua `alt` em imagens
- Use elementos semânticos apropriados
- Mantenha contraste adequado
- Considere navegação por teclado

## Fluxo de Desenvolvimento

### Novos Componentes
1. Crie o componente na pasta apropriada
2. Adicione tipos TypeScript
3. Implemente estilos seguindo o design system
4. Adicione testes quando necessário
5. Documente o componente

### Modificações Existentes
1. Analise o contexto atual
2. Mantenha consistência com o design system
3. Considere impactos em outros componentes
4. Documente mudanças significativas

## Considerações para LLMs

### Ao Auxiliar no Desenvolvimento
- Sempre mantenha o contexto do design system
- Considere a responsividade em todas as sugestões
- Mantenha a consistência com os padrões existentes
- Documente decisões importantes

### Ao Sugerir Mudanças
- Explique o impacto nas outras partes do sistema
- Considere a manutenibilidade a longo prazo
- Mantenha a simplicidade quando possível
- Sugira melhorias incrementais

### Ao Depurar Problemas
- Verifique o contexto completo do componente
- Considere interações com outros elementos
- Analise o comportamento em diferentes breakpoints
- Documente a solução encontrada

## Recursos Úteis
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Guia de Acessibilidade](https://www.w3.org/WAI/ARIA/apg/)
- [Design System Documentation](docs/DESIGN_SYSTEM.md) 