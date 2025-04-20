# HUB - Sistema de Análise de Heurísticas

Sistema para análise e documentação de heurísticas de usabilidade, com suporte para capturas de tela e feedback visual.

## Funcionalidades

- Upload de imagens com suporte para:
  - Upload único (início e fim)
  - Upload múltiplo (iterações)
  - Drag and drop para reordenação
  - Validação de tipos e tamanhos de arquivo
- Interface moderna e responsiva
- Feedback visual com toast notifications
- Suporte para imagens de exemplo para desenvolvimento

## Tecnologias

- Next.js
- TypeScript
- Tailwind CSS
- React Hot Toast
- @hello-pangea/dnd (drag and drop)

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/hub.git
cd hub
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── app/              # Páginas da aplicação
  ├── components/       # Componentes React
  │   ├── shared/      # Componentes compartilhados
  │   └── ...         # Outros componentes
  ├── services/        # Serviços (API, upload, etc)
  ├── types/           # Definições de tipos TypeScript
  └── utils/           # Funções utilitárias
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 