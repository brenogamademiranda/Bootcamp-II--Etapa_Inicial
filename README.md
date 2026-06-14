# Bootcamp-II--Etapa_Inicial

💧 Água em Dia

## 📌 Nome do Projeto
Água em Dia — Sistema de Controle de Hidratação Pessoal

## 📖 Descrição do Problema Real
Muitas pessoas não conseguem manter uma rotina adequada de hidratação ao longo do dia.
Isso acontece principalmente por falta de acompanhamento, controle de quantidade ingerida e ausência de alertas ou métricas visuais.
A consequência pode ser desidratação, queda de desempenho físico e mental e problemas de saúde.

## 💡 Proposta da Solução
A aplicação Água em Dia foi desenvolvida para ajudar o usuário a:
- Registrar o consumo de água ao longo do dia
- Definir uma meta diária personalizada
- Visualizar o progresso em tempo real
- Acompanhar o histórico de consumo
- Ver o intervalo médio entre ingestões

## 🎯 Público-Alvo
- Pessoas que querem melhorar hábitos de saúde
- Estudantes e trabalhadores com rotina intensa
- Usuários que esquecem de beber água regularmente
- Qualquer pessoa interessada em autocuidado

## ⚙️ Funcionalidades Principais
- ✅ Definição de meta diária (ml ou litros)
- ✅ Registro manual de consumo de água
- ✅ Cálculo automático de porcentagem atingida
- ✅ Barra de progresso dinâmica
- ✅ Histórico de consumo com horário automático
- ✅ Cálculo de intervalo médio entre registros
- ✅ Reset automático dos dados diariamente
- ✅ Armazenamento local (localStorage)
- ✅ Persistência em banco de dados na nuvem (Supabase / PostgreSQL)

## 🛠️ Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- LocalStorage (armazenamento no navegador)
- Supabase (PostgreSQL) - banco de dados em nuvem
- Jest (testes automatizados)
- ESLint (lint)
- GitHub Actions (CI)
- Vercel (deploy)

## 📥 Instruções de Instalação
1. Clone o repositório:
```bash
git clone https://github.com/brenogamademiranda/Bootcamp-II--Etapa_Inicial.git
```
2. Acesse a pasta do projeto:
```bash
cd Bootcamp-II--Etapa_Inicial
```

## ▶️ Instruções de Execução
Como é um projeto front-end simples, basta abrir o arquivo `index.html` no navegador (Chrome, Edge, etc.) ou usar a extensão "Live Server".

## ☁️ Banco de Dados (Supabase)
A aplicação utiliza o Supabase (PostgreSQL) para persistir os registros de hidratação na nuvem, na tabela `hydration_logs` (colunas: `id`, `amount_ml`, `created_at`), com políticas de Row Level Security configuradas para leitura e escrita públicas.

As credenciais (URL e chave pública anon) já estão configuradas no `index.html` e no `app.js`.

## 🧪 Instruções para Rodar os Testes
```bash
npm install
npm test
```
Os testes são executados com Jest e cobrem as funções principais de cálculo, integração com a API de clima e integração com o Supabase (com mock de fetch).

## 🧹 Instruções para Rodar o Lint
```bash
npm run lint
```

## Deploy Online
https://bootcamp-ii-etapa-inicial-lbaz.vercel.app/

## 📦 Versão Atual
1.3

## 👨‍💻 Integrante(s) do Grupo
- Breno Gama de Miranda — Matrícula: 22503883