# 🌲 Dashboard Florestal - Frontend

Projeto frontend para visualização de dados operacionais de equipamentos utilizados em uma operação florestal. Desenvolvido com Angular 19, Angular Material e Leaflet.

## 🚀 Tecnologias Utilizadas

- [Angular 19](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [Leaflet](https://leafletjs.com/)
- [SCSS](https://sass-lang.com/)

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/services/data.service.ts   # Serviço para leitura dos arquivos JSON
│   ├── features/
│   │   ├── dashboard/map/              # Mapa com visualização dos equipamentos
│   │   └── equipment/                  # Componente de equipamentos
│   └── app.component.                 
├── assets/data/                        # Dados JSON fornecidos
│   ├── equipment.json
│   ├── equipmentModel.json
│   ├── equipmentPositionHistory.json
│   ├── equipmentState.json
│   └── equipmentStateHistory.json
```

## 📌 Funcionalidades

### Funcionalidades principais (requisitos obrigatórios):

- Exibição dos equipamentos no mapa com base na posição mais recente
- Visualização do nome do equipamento, estado atual e posição via popup
- Visualização do histórico de estados ao clicar no equipamento

## 📊 Dados de entrada (JSON)

Os arquivos estão em `assets/data/`:

- `equipment.json`: lista dos equipamentos
- `equipmentModel.json`: modelos e ganhos por hora
- `equipmentPositionHistory.json`: posições por equipamento
- `equipmentState.json`: estados e cores
- `equipmentStateHistory.json`: histórico de estados por equipamento

## 📦 Dependências Instaladas

```bash
@angular/material
@angular/animations
@angular/router
@angular/common/http
leaflet
@asymmetrik/ngx-leaflet
```

> ⚠️ O pacote `@asymmetrik/ngx-leaflet` pode precisar do flag `--legacy-peer-deps` para Angular 19.

## 🧪 Próximos passos / melhorias

- Calcular produtividade e ganhos
- Filtro por estado/modelo
- Listar equipamentos
- Testes Jest

## 🧑‍💻 Autor

Projeto desenvolvido como parte de um desafio técnico frontend.
