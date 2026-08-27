# JOVI Smart Camera Assist

Experiência guiada que ajuda a pessoa a descobrir os recursos avançados da câmera do
smartphone sem precisar de manual nem de caçar opção em menu.

Projeto acadêmico do Challenge JOVI, FIAP, turma 1TDS.

> **Status:** este repositório contém a **entrega da Sprint 1**. O projeto continua em
> andamento e o material da sprint atual será publicado após a entrega, em setembro de 2026.

## Problema

A maioria das pessoas usa uma fração pequena do que a câmera do celular sabe fazer.
Digitalização de documento, OCR, estabilização e modos específicos existem, mas ficam
escondidos atrás de menus que ninguém explora.

O problema não é falta de recurso. É falta de descoberta.

## Solução

Um guia no navegador, sem instalar nada e sem cadastro, que adapta a recomendação ao
contexto de uso da pessoa.

1. Apresentação da proposta
2. Escolha de perfil — Estudante, Idoso ou Criador
3. Guia personalizado com os recursos relevantes para aquele perfil
4. Demonstração interativa da câmera
5. Captura simulada e galeria temporária

## Como rodar

```bash
python3 -m http.server 4173
```

E abra <http://localhost:4173>.

> O Tailwind CSS vem pela CDN oficial, então **é necessária conexão com a internet** para o
> layout carregar corretamente. É uma limitação conhecida da entrega da Sprint 1.

## Tecnologias

HTML5, CSS3, JavaScript e Tailwind CSS via CDN. Sem build, sem framework, sem backend.

| Arquivo | Função |
|---|---|
| `index.html` | Estrutura da jornada completa |
| `app.js` | Seleção de perfil, guia, demonstração e galeria |
| `styles.css` | Estilos complementares ao Tailwind |
| `assets/` | Imagens de demonstração |

## Acessibilidade

Não foi um item de checklist — está implementado e dá para conferir no código:

- **Navegação por teclado** com handler de `keydown` em `app.js`
- **Estados de foco visíveis**, definidos em `styles.css`
- **17 atributos `aria-`** em `index.html` para leitores de tela
- **Tema claro e escuro**, com a preferência persistida
- **`prefers-reduced-motion`** respeitado em `styles.css`
- Estado de carregamento, validação da seleção de perfil e estado vazio da galeria

## Persistência

`localStorage`, com duas chaves:

- `jovi-profile` — o perfil escolhido, para não repetir a pergunta
- `jovi-theme` — a preferência de tema claro ou escuro

Sem backend e sem cadastro: nada sai do navegador da pessoa.

## Modelagem de dados

O modelo lógico da Sprint 1 tem três tabelas — [`docs/mer-sprint-1.png`](docs/mer-sprint-1.png):

| Tabela | Colunas |
|---|---|
| `T_PERFIL` | `id_perfil` (PK), `tipo` |
| `T_FUNC` | `id_func` (PK), `nome`, `descricao` |
| `T_PERFIL_FUNC` | `id_perfil` (FK), `id_func` (FK) |

**O modelo recebeu a crítica de estar simplificado, e a crítica estava certa.** Ele descreve
uma tabela de configuração — quais recursos pertencem a qual perfil — e nada além disso. Não
há usuário, sessão, captura nem métrica. A associativa `T_PERFIL_FUNC` sequer tem chave
primária: o diagrama mostra `PK ()`.

A razão é que o modelo acompanhava o produto: na Sprint 1 a personalização era um filtro
estático aplicado uma única vez. A pessoa escolhia o perfil, o sistema escondia alguns
botões, e a experiência acabava ali. Um filtro estático honestamente só precisa de três
tabelas.

A sprint em andamento ataca a causa em vez do sintoma — o perfil deixa de ser um destino e
passa a ser um ponto de partida que o sistema refina com o comportamento real. O modelo de
dados cresce como consequência disso, não como enfeite.

## Equipe

Trabalho em grupo, sem divisão fixa de frentes — todos participaram das várias etapas.

- Caio de Melo Dias
- Cesar Candido da Silva Junior
- Elias Antonio Oliveira Lopes
- Lucas Linyker de Souza Andreotti
- Mateus Costa de Almeida Rosa

## Limitações da Sprint 1

- A câmera é simulação visual. Não acessa o hardware do aparelho.
- Sem backend, sem persistência além do `localStorage`.
- Tailwind por CDN: não funciona offline.
- O modelo de dados é projeto, não implementação — não há banco.
- Sem testes automatizados.

## Apresentação

O PDF da apresentação final está anexado na [aba Releases](../../releases) — fora do
versionamento para não carregar 4,8 MB no histórico de clone.
