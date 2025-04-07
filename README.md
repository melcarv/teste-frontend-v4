##🌲 Dashboard Florestal - Frontend

Projeto frontend para visualização de dados operacionais de equipamentos utilizados em uma operação florestal. Desenvolvido com Angular 19, Angular Material e Leaflet.

## 🚀 Tecnologias Utilizadas

- Angular 19.2.0
- Angular Material 19.2.8
- Leaflet 1.9.4
- ngx-leaflet 0.0.16
- TypeScript 5.7.2
- SCSS

## 📌 Funcionalidades

Funcionalidades principais (requisitos obrigatórios):

- Exibição dos equipamentos no mapa com base na posição mais recente
- Visualização do nome do equipamento, estado atual e posição via popup
- Visualização do histórico de estados ao clicar no equipamento
- Listagem dos equipamentos e dados relevantes
- Dashboard com dados gerais

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                   # Funcionalidades principais e compartilhadas
│   │   ├── constants/          # Constantes e enums
│   │   ├── models/             # Interfaces e tipos
│   │   └── services/           # Serviços compartilhados
│   ├── features/               # Módulos de funcionalidades
│   │   ├── dashboard/          # Dashboard de dados gerais
│   │   ├── equipment/          # Lista de equipamentos e dados relevantes
│   │   ├── equipment-history/  # Histórico de estado dos equipamentos
│   │   └── map/                # Mapa de equipamentos
│   ├── services/               # Serviços específicos
│   ├── models/                 # Modelos de dados
│   ├── app.component.*         # Componente principal
│   ├── app.module.ts           # Módulo principal
│   ├── app.routes.ts           # Configuração de rotas
│   └── app.config.ts           # Configuração da aplicação
├── assets/                     # Recursos estáticos
├── styles.scss                 # Estilos globais
└── main.ts                     # Ponto de entrada da aplicação
```

## 🧪 Próximos passos / melhorias

- Filtro por estado/modelo
- Ser possível pesquisar por dados de um equipamento especifico
- Diferenciar visualmente os equipamentos por modelo de equipamento na visualização do mapa
- Que seja possível visualizar o histórico de posições de um equipamento, mostrando o trajeto realizado por ele

## 🧑‍💻 Autor

Projeto desenvolvido como parte de um desafio técnico frontend.
