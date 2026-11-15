# Plano de refinamento visual

Status: plano para implementação em outra sessão; nenhuma alteração nos fontes da aplicação foi feita nesta revisão.
Data: 14/11/2026.
Atualizado em: 15/11/2026, com o requisito de temas claro/escuro/sistema.

## Leitura para a próxima sessão

- Este documento reúne a revisão das mudanças não comitadas, o refinamento visual e o requisito posterior de seletor claro/escuro. Implementar o conjunto, não apenas o seletor.
- Reaproveitar as alterações locais; não executar reset, limpar o diretório de trabalho nem aplicar o stash automaticamente. Antes de começar, ler instruções locais e conferir novamente o diff, pois ele pode ter mudado desde esta revisão.
- Escolha explicitamente corrigida pelo usuário: o tema escuro será **Clube esportivo contemporâneo**, com grafite e verde-lima; o claro será **papel e terracota**. Esta é a dupla de implementação. O primeiro preview escuro com azul de ação não é o tema escolhido.
- Referências visuais preservadas no repositório: [escuro Clube esportivo contemporâneo](referencias/tema-escuro-clube.html) e [claro com papel](referencias/tema-claro-papel.html). São fragmentos HTML dos previews, não páginas prontas para produção. Contêm amostras, conteúdo de demonstração e fonte externa; não importar os fragments nem seus scripts diretamente na aplicação. O arquivo `referencias/tema-escuro-azul.html` é uma referência histórica não selecionada.
- As referências mostram ideias de composição diferentes, mas o produto final deve ter **um único layout e a mesma tipografia nos dois temas**. As amostras servem para cores e direção visual; não são autorização para alternar layouts ou nomes de times ao mudar o tema.
- O histórico local revisado estava em `main`, commit `daa180f` (18/01/2026), com 12 arquivos modificados e um stash separado de conversão HSL → OKLCH. Essa fotografia deve ser reconferida, não presumida atual.

## Objetivo e direção

Evoluir as mudanças locais para uma interface sóbria, legível e consistente. Preservar o trabalho útil de centralização dos estilos; revisar composição, contraste e representação dos participantes. O algoritmo, os pesos dos níveis e os dados persistidos permanecem compatíveis.

Direção: uma única interface de clube esportivo contemporâneo, com hierarquia por tamanho, peso e espaço, disponível em dois temas. No escuro, grafite de tom natural e ação verde-lima; no claro, papel quente, texto carvão e ação terracota. Cores dos times identificam grupos, sem substituir seus nomes. Personalidade vem da cor de assinatura, de títulos marcantes e de detalhes pontuais inspirados na quadra; evitar decoração atrás dos dados.

## Diagnóstico de contraste

Razões calculadas com a luminância relativa sRGB das cores declaradas. Estes cálculos isolam os pares; a validação final precisa conferir estilos computados, transparência, cascata e estados no navegador.

| Par atual | Razão aproximada | Problema |
| --- | ---: | --- |
| Texto secundário / cartão principal | 4,14:1 | Insuficiente para texto comum |
| Texto secundário / linha de participante | 3,03:1 | Textos pequenos perdem legibilidade |
| Ícone secundário / fundo de hover da linha | 1,72:1 | Ações ficam difíceis de distinguir |
| Branco / verde do botão de sorteio | 2,44:1 | Texto do botão insuficientemente contrastado |
| Azul primário / linha de participante | 1,94:1 | Cor prevista para hover de nomes pouco legível |
| Texto efetivo do contador / fundo do banco | 2,59:1 | Classe tipográfica sobrepõe a cor pretendida |

O hover azul dos nomes está parcialmente mascarado pelo conflito entre as classes `ds-text-*` sem camada e as utilidades Tailwind. Corrigir a cascata sem revisar a paleta pode revelar esse problema.

Referências: WCAG 2.2, contraste mínimo de 4,5:1 para texto comum; 3:1 para texto grande e informação visual necessária para reconhecer componentes e estados. Bordas meramente decorativas não precisam atingir 3:1. Não declarar conformidade global a partir da paleta.

- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast

## 1. Consolidar as duas paletas e os estilos — prioridade alta

### Tema escuro: Clube esportivo contemporâneo

Paleta proposta, sujeita à verificação visual dos estados reais:

| Papel | Valor | Aplicação |
| --- | --- | --- |
| Fundo | `#141716` | Página, grafite de tom natural |
| Superfície | `#1D2320` | Cartões, diálogos e menus |
| Superfície elevada | `#29322C` | Campos e linhas de participantes |
| Hover neutro | A definir | Derivar das superfícies e validar texto/ícones |
| Texto principal | `#F4F7ED` | Nomes e títulos, branco suave |
| Texto secundário | `#BCC6B7` | Descrições, metadados e contadores |
| Ícone secundário | `#BCC6B7` | Editar, remover, ajuda e expansão; ponto de partida legível |
| Borda decorativa | `#414D43` | Separação de cartões e seções |
| Borda de controle | `#84917F` | Proposta complementar ao preview; validar sobre todas as superfícies |
| Ação principal | `#C7F34A` | Sortear e salvar, verde-lima |
| Texto sobre ação principal | `#182008` | Texto escuro sobre verde-lima; não usar branco |
| Hover principal | `#B6E339` | Hover de ação principal |
| Link e foco | `#C7F34A` | Links e nomes editáveis sobre superfícies escuras; foco com separação da superfície do botão |
| Time vermelho | `#FB8B78` | Coral para marcador de identificação |
| Time azul | `#7EB8F6` | Azul para marcador de identificação |
| Ação destrutiva confirmada | `#B91C1C` | Botão de confirmação com texto branco |
| Texto de erro | `#FCA5A5` | Erros sobre superfície escura |
| Texto de sucesso | `#86EFAC` | Confirmações sobre superfície escura |

Contrastes calculados desta paleta: texto escuro sobre lima 13,09:1; secundário sobre linha 7,50:1; link lima sobre linha 10,30:1; borda de controle sobre linha 3,99:1. Os pares medidos da proposta anterior com azul não se aplicam a este tema. Validar também os estados reais antes de implementar. Manter o token de texto da ação independente do texto geral. No foco do botão lima, usar contorno com offset ou anel duplo para não fundir o indicador com o próprio botão. O verde-lima é assinatura de ação, não indicação de nível dos jogadores nem mensagem automática de sucesso.

### Tema claro: papel, carvão, terracota e azul-céu

Cinco cores de origem: `#F06449`, `#EDE6E3`, `#DADAD9`, `#36382E`, `#5BC3EB`. Tons derivados são necessários para superfícies, estados e texto; não limitar artificialmente a interface a cinco valores.

| Papel | Valor inicial | Aplicação |
| --- | --- | --- |
| Fundo | `#EDE6E3` | Página, papel quente |
| Superfície | `#F5F0ED` | Cartões, diálogos e menus |
| Superfície elevada/secundária | `#DADAD9` | Áreas secundárias e fundo de controles conforme contraste |
| Hover neutro | A definir | Derivar da base, validando texto, ícones e borda |
| Texto principal | `#36382E` | Nomes e títulos |
| Texto secundário/ícones | `#5E6056` | Descrições, metadados e contadores |
| Borda decorativa | `#C6C3BB` | Separadores |
| Borda de controle | `#8A8B80` | Ponto de partida do preview; medir sobre cada superfície e ajustar se necessário |
| Ação principal | `#F06449` | Sortear e salvar |
| Texto sobre ação principal | `#1C2018` | Tom mais escuro que o carvão da paleta |
| Hover principal | `#F47A63` | Validar com o texto escuro |
| Link | `#26627A` | Derivado escuro do azul-céu, próprio para texto |
| Foco | `#36382E` | Contorno sobre superfícies claras |
| Time vermelho | `#F06449` | Marcador de identificação |
| Time azul | `#5BC3EB` | Marcador de identificação |
| Erro/sucesso/exclusão | A definir | Tons escuros para texto e pares próprios para botões; não reaproveitar automaticamente a ação terracota |

Contrastes calculados: carvão sobre papel 9,66:1; texto escuro `#1C2018` sobre terracota 5,22:1; link derivado sobre papel 5,47:1; secundário sobre cinza 4,57:1. O último par tem pouca margem: testar todas as superfícies e escurecer o secundário se necessário. O carvão original sobre terracota oferece apenas 3,76:1: **não usar esse par para o texto comum do botão**. Também não usar branco sobre terracota ou azul-céu como solução automática.

Azul-céu claro funciona como identificação decorativa junto ao nome do time, não como link textual sobre papel. Se o marcador passar a ser informação indispensável, ajustar seu contraste ou acrescentar outra identificação visível; o nome do time deve permanecer.

### Fundação compartilhada

Implementação:

- Criar tokens por função: superfícies, texto, bordas, ação, foco, erro e sucesso; evitar um mesmo token para fundo de botão e link.
- Resolver a sobreposição entre tokens `--color-*`, `@theme inline` e variáveis legadas dos componentes Radix/shadcn. Escolher uma fonte de verdade e mapear os componentes usados para ela, incluindo elementos renderizados em portal.
- Fazer as classes de tipografia controlarem tamanho, peso e altura de linha; cores ficam em tokens/classes próprios. Colocar estilos nas camadas adequadas para que hover e foco funcionem previsivelmente.
- Trocar `hover:opacity-90` por fundos de hover explícitos. Conferir também as variantes herdadas de Button, que podem manter um fundo de hover antigo.
- Substituir cinzas e cores avulsas nos diálogos de edição/confirmação, seletor de idioma, FAQ, dropdown e tour. Evitar uma tela principal nova com diálogos ainda no estilo antigo.
- Atualizar `DesignSystemPage` com a paleta completa, pares de texto/fundo e estados interativos; remover tokens sem uso, inclusive os de tamanhos de ícones se não forem adotados.
- Completar os valores ainda em aberto na paleta clara durante a etapa de fundação e registrar os pares medidos antes de avançar. Não inventar silenciosamente cores diferentes em cada componente.
- A cor de texto do botão primário deve ser um token por tema: `#182008` sobre lima no escuro e `#1C2018` sobre terracota no claro. O tema não pode herdar `text-white` indiscriminadamente.
- Manter as cores dos times em tokens compartilhados por identificador (vermelho, azul etc.), com valores por tema se necessário. Migrar os usos de `getTeamColors` e `TEAM_COLORS_RAW` com cuidado: nomes, índices, ações “manter time” e dados do sorteio permanecem estáveis. Conferir eventuais usos das cores brutas antes de alterá-las.

## 2. Substituir os símbolos de nível por informação explícita — prioridade alta

Avaliação de design: planta sugere crescimento, mas não comunica necessariamente nível iniciante; medalha pode significar prêmio, classificação ou desempenho. Não há evidência de compreensão desses símbolos pelo público do app. Trocar o desenho por estrelas ou barras manteria a necessidade de interpretar uma escala.

Decisão proposta:

- Usar rótulos de texto discretos: **Iniciante**, **Intermediário**, **Avançado**, traduzidos com as chaves existentes.
- Exibir os três níveis, inclusive o intermediário padrão. A ausência de símbolo deixa de funcionar como informação implícita.
- Usar a mesma cor neutra e o mesmo peso visual nos três níveis. Não associar habilidade a verde/amarelo/vermelho, medalhas ou troféus.
- Separar nome e metadados: nome na primeira linha; nível e posição na segunda, com tipografia secundária de pelo menos 14 px. No desktop, só colocar metadados ao lado do nome se houver espaço suficiente.
- Manter os rótulos legíveis também nos times e no banco; não esconder a informação atrás de hover no celular.
- Substituir `SkillLevelIcon` por um componente de apresentação de nível compartilhado entre lista, resultados e edição. Definir o nível ausente como intermediário, respeitando os limites já usados pelo app.
- Revisar também `RoleIcon`: escudo e seta não são autoexplicativos para líbero e levantador. Preferir texto “Líbero”/“Levantador”; para `any`, omitir a posição nas listas. Não usar abreviações como única informação.
- No diálogo, substituir o slider de três posições por um grupo de opções com os três nomes visíveis. Usar o RadioGroup existente, seleção e foco claros; permitir disposição vertical em telas estreitas e idiomas com palavras longas.
- Preservar o mapeamento 0,5 / 1 / 1,5, eventos de alteração e salvamento. Não expor os pesos internos na interface.

Arquivos principais: `SkillLevelIcon.jsx`, `RoleIcon.jsx`, `ParticipantItem.jsx`, `PlayerDisplay.jsx`, `EditParticipantDialog.jsx`, traduções se algum texto novo for necessário.

## 3. Reorganizar composição e ações — prioridade média

- Adotar espaçamento em múltiplos de 4 px: 8 entre elementos próximos, 12–16 entre grupos internos, 16–24 entre seções. Evitar somar o `gap` padrão do Card com padding e margem adicionais sem intenção.
- Aproximar o formulário do título de participantes e reduzir o espaço abaixo do contador. A nova linha de metadados deve ter espaço suficiente sem inflar o restante do cartão.
- Manter alvos de toque de 44 × 44 px para editar/remover, mesmo com ícones de 16–18 px. Contraste e foco continuam claros sem hover.
- Dar destaque principal a “Sortear Times”/“Refazer Times”. “Adicionar” vira ação secundária com texto visível quando houver espaço; no celular, o botão de mais precisa de nome acessível.
- Tornar “Limpar Todos” uma ação discreta na gestão de participantes; usar vermelho forte no diálogo de confirmação. Manter a ação fácil de encontrar e separada de adicionar para reduzir toques acidentais.
- Usar a mesma família de botões para salvar e sortear, com a cor principal do tema: verde-lima no escuro, terracota no claro. Mensagens de sucesso precisam de texto/ícone e tratamento próprio; não confundir o verde-lima da marca com sucesso.
- No cabeçalho mobile, mostrar um título curto traduzido, como “Sorteio de vôlei”, com seletor de idioma e ajuda organizados sem colisão. Remover o emoji do título e usar tipografia como identificação principal.
- Incluir o seletor de tema no cabeçalho junto às preferências, conforme a seção 5, sem deslocar o sorteio ou criar uma barra de ferramentas dominante.
- Escolher uma só família tipográfica para os dois temas. A fonte condensada das referências pode aparecer em títulos curtos, mas nomes, formulário, instruções e metadados precisam manter leitura natural. Não copiar as diferenças tipográficas entre os previews para cada tema.
- Corrigir os rótulos acessíveis de editar/remover para `participants.edit` e `participants.remove`, preferencialmente incluindo o nome do participante para distinguir controles repetidos.
- Dar foco visível e operação por teclado à edição inline dos nomes, preservando Enter, Escape e validação existentes. Evitar criar um botão dentro de outro controle clicável.

## 4. Refinar resultados, reservas e feedback — prioridade média

- Substituir faixas largas dos times por cabeçalho neutro com marcador ou borda curta colorida, nome do time e quantidade de jogadores.
- Usar texto principal sobre superfície neutra; as cores dos times identificam o time, sem servir de fundo para textos pequenos. Conferir marcadores com contraste suficiente e conservar o nome da cor em texto.
- Remover a quantidade duplicada no rodapé quando ela estiver no cabeçalho. Evitar cartões com bandas vazias e excesso de padding.
- Manter dois times lado a lado quando houver espaço e uma coluna no celular. Alinhar nomes e metadados à esquerda para facilitar a leitura.
- Mostrar reservas como uma seção compacta com título e quantidade, sem laranja, sem texto esmaecido e sem uma hierarquia de cartões redundante.
- Simplificar o destaque de jogadores que mudaram de time: contorno/fundo transitório sutil em vez de brilho branco. Não apagar o hover ou foco com o estado final da animação; respeitar `prefers-reduced-motion`.
- Ajustar FAQ, menus, alertas e confirmação de exclusão à mesma tipografia, superfícies, foco e estados de erro.

## 5. Seletor claro / escuro / sistema — requisito de implementação

### 5.1 Comportamento esperado

Oferecer três preferências, correspondendo a dois temas visuais:

| Preferência | Valor persistido | Aparência efetiva |
| --- | --- | --- |
| Claro | `light` | Sempre papel/terracota, independentemente do sistema |
| Escuro | `dark` | Sempre Clube esportivo contemporâneo, grafite/verde-lima |
| Sistema | `system` | Seguir `prefers-color-scheme`, inclusive mudanças durante o uso |

- Padrão para primeira visita: **Sistema**. Na ausência de preferência escura do navegador, resolver para claro.
- Selecionar tema aplica a mudança imediatamente, sem recarregar nem remontar a aplicação. Não perder participantes, times, reservas, edição em andamento, idioma ou progresso do tour.
- Salvar a preferência explícita, inclusive `system`, em chave dedicada `volleyball-theme`. Reservar `STORAGE_KEYS.THEME` para essa chave; não usar as chaves de participantes/times nem deixar o reset do sorteio apagar a aparência.
- Prioridade: preferência válida salva → preferência do sistema → claro como fallback. Valores desconhecidos/corrompidos devem equivaler a Sistema.
- Diferenciar preferência escolhida de tema resolvido. Com Sistema selecionado, o menu continua indicando Sistema, mesmo quando a aparência efetiva é escura.
- Mudanças do sistema só alteram a aparência quando a preferência é Sistema. Uma escolha explícita deve continuar respeitada após mudança do sistema, troca de idioma e recarregamento.
- Sem acesso a armazenamento: manter a seleção na sessão em memória e seguir funcionando sem exceções; persistência entre visitas pode ficar indisponível. Não mostrar alerta intrusivo por isso.
- Sincronizar mudanças entre abas com o mecanismo da biblioteca, sem reimplementar listeners duplicados. Definir e conferir o comportamento de remoção da chave: voltar a Sistema, sem afetar os demais dados.

### 5.2 Arquitetura

Usar a dependência **`next-themes` já instalada**. A inspeção local confirmou opções `storageKey`, `defaultTheme`, `enableSystem`, `enableColorScheme`, `disableTransitionOnChange` e `resolvedTheme`; conferir a versão instalada na próxima sessão. Não adicionar uma segunda biblioteca nem atualizar dependências como parte necessária desta tarefa.

Estrutura sugerida:

1. `src/constants/theme.ts` (ou `.js`, conforme o padrão adotado): nomes permitidos, preferência padrão, chave de armazenamento e definição dos dois temas. Centralizar contrato para evitar divergência entre seletor e inicialização.
2. Em `src/main.jsx`, um `ThemeProvider` acima de **MainApp e DesignSystemPage**, dentro da árvore existente. Configuração pretendida: `attribute="class"`, `storageKey="volleyball-theme"`, `defaultTheme="system"`, `enableSystem`, `enableColorScheme`, `disableTransitionOnChange`. Evitar `forcedTheme`.
3. Em `src/App.css`, tokens sob `:root`/`.light` e `.dark`, alinhados com a variante Tailwind já existente. O tema base claro deve ter fallback coerente antes da execução do JavaScript. Mover o import global de `App.css` de MainApp para a entrada global, evitando depender do componente principal para carregar estilos do catálogo.
4. Componentes consomem tokens sem verificar o tema individualmente. Não espalhar ternários `resolvedTheme === 'dark'` pelos cartões, textos e botões.
5. Usar `useTheme`/`resolvedTheme` apenas onde há comportamento ou integração imperativa: seletor, cores do navegador, tour e catálogo. Valores CSS aplicados ao elemento `<html>` alcançam body e portais dos componentes Radix.

Contrato mínimo dos tokens por tema:

| Grupo | Tokens semânticos necessários |
| --- | --- |
| Superfícies | Fundo, cartão, superfície elevada, hover neutro, popover, overlay |
| Texto | Principal, secundário, ícone secundário, placeholder, link, link em hover |
| Contornos | Decorativo, controle, foco |
| Ações | Fundo/texto/hover do primário, secundário, destrutivo e estados desabilitados |
| Estados | Texto/fundo/borda de erro e sucesso; seleção; destaque de jogador alterado |
| Identificação | Time vermelho, azul e demais cores ainda usadas |

Mapear também os tokens dos componentes existentes (`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring` e respectivos foregrounds). Evitar colisões com os nomes que `@theme inline` exporta; escolher nomes próprios para os valores de origem e mapear os aliases numa direção, sem referências circulares.

### 5.3 Primeiro carregamento e cores do navegador

- Evitar mostrar uma tela clara antes de aplicar uma preferência escura salva, ou o inverso. O script da biblioteca montado com React pode não cobrir sozinho o intervalo anterior ao carregamento do bundle Vite; verificar em carregamento lento.
- Planejar um bootstrap mínimo no `<head>` de `index.html`, antes da primeira pintura dos estilos: ler a mesma chave com `try/catch`, aceitar apenas os valores previstos, resolver Sistema com `matchMedia` e aplicar classe e `color-scheme` ao `<html>`. Não carregar participantes ou outros dados nesse script.
- Reutilizar o contrato de tema tanto quanto o build permitir; se alguns literais precisarem aparecer no bootstrap, mantê-los mínimos e incluir verificação de correspondência. Não criar um segundo controlador de estado ou listeners persistentes no bootstrap; após inicialização, o provider assume o controle.
- Preservar classes alheias ao tema no `<html>` e não sobrescrever `lang`/`dir`, controlados por `useSEO`. Testar que a troca de idioma não remove o tema.
- CSS deve pintar o fundo de `html` e `body`, inclusive durante o carregamento, com os tokens corretos. Configurar `color-scheme` para campos nativos e demais controles do navegador.
- `index.html` contém hoje três metas `theme-color`, todas fixas em escuro. Consolidar sua estratégia: a cor do navegador deve seguir o **tema efetivo**, inclusive quando a escolha manual contraria o sistema. Não confiar somente em media queries de metas para uma escolha explícita.
- Atualizar a meta pelo bootstrap/integrador após resolver o tema; conferir ausência de metas concorrentes. A preferência de tema não vai para URL, canonical, hreflang, sitemap ou metadados sociais.
- O build multilíngue deve preservar o bootstrap e a estrutura do head em todas as páginas geradas. Conferir root, `/pt/` e uma página RTL; manter `lang` e `dir` corretos no HTML gerado.
- Não adicionar transição global de todas as cores. Preferir troca imediata e sem animações de layout; respeitar movimento reduzido.

### 5.4 Seletor e traduções

- Criar `src/components/ThemeSelector.jsx` usando o Select Radix existente ou menu de seleção única equivalente. Três opções: Claro, Escuro, Sistema. Não usar toggle binário se Sistema continuar sendo uma opção.
- Rótulo acessível explícito “Tema”/“Aparência”, estado selecionado e operação por teclado; sol, lua e monitor são apoios opcionais, acompanhados de texto nas opções.
- No desktop, mostrar a preferência atual por texto. No mobile, permitir trigger compacto com nome acessível localizado, opções sempre escritas e alvo de toque de pelo menos 44 × 44 px.
- Integrar junto a idioma e ajuda no cabeçalho de MainApp e oferecer o mesmo controle no catálogo. Não duplicar estado local; ambas as instâncias usam o mesmo provider.
- No primeiro render sem tema disponível, manter espaço estável para o trigger ou usar o mesmo fallback do bootstrap. Não renderizar um ícone de sol temporário numa preferência escura salva.
- Adicionar chaves como `theme.label`, `theme.light`, `theme.dark`, `theme.system` e, se necessário, `theme.current` nos **19 arquivos de tradução**. Revisar naturalidade, texto longo e RTL; não deixar fallback em português/inglês para todas as opções.
- Tema não depende do idioma. Trocar idioma mantém a preferência e vice-versa; o estado escolhido não deve ser escrito no armazenamento por efeitos de tradução ou a cada renderização.

### 5.5 Componentes e integrações a cobrir

| Arquivo/área | Trabalho esperado |
| --- | --- |
| `src/main.jsx` | Provider e estilos globais para as duas entradas |
| `src/App.css` | Tokens completos dos dois temas, aliases Tailwind e cascata |
| `src/constants/storageKeys.ts`, contrato de tema | Chave dedicada e valores permitidos |
| `src/components/ThemeSelector.jsx` | Novo seletor compartilhado e acessível |
| `MainApp.jsx`, `LanguageSelector.jsx` | Organizar cabeçalho; preservar idioma/ajuda; adaptar tour |
| `ParticipantForm`, `ParticipantItem`, `ParticipantList`, `PlayerDisplay` | Formulário, texto, metadados, ações, edição inline e foco |
| `TeamCard`, `BenchCard`, `teamColors.ts` | Marcadores e contadores por tema; identidade estável dos times |
| `EditParticipantDialog`, `ClearParticipantsDialog`, `FAQDialog` | Superfícies, texto, seleção, erros e botões nos portais |
| Componentes UI efetivamente usados | Button, Input, Select, RadioGroup, Dialog, AlertDialog, Tooltip, DropdownMenu, Badge, Alert e demais estados |
| Tour Joyride | Remover cores hex fixas das opções, seta e botões; reagir à troca de tema sem reiniciar o tour |
| `ui/sonner.jsx` | Se usado, conferir compatibilidade com o provider; não montar toaster novo apenas por existir o arquivo |
| `DesignSystemPage.jsx` | Seletor, tokens resolvidos, exemplos dos dois temas e todos os estados |
| `src/locales/*.json` | Traduções do tema e textos novos |
| `index.html`, `scripts/build-multilang.js` | Bootstrap, meta de navegador e preservação no build |

No Joyride, testar se `var(...)` é aceito nos estilos específicos usados. Se a integração exigir cores resolvidas, ler estilos computados após a mudança de tema por um adaptador pequeno; não manter uma cópia independente das paletas em MainApp.

No catálogo, os valores hoje são lidos com `getComputedStyle` durante render. Garantir que amostras, textos com valores e contrastes sejam atualizados **após** a classe do tema mudar, sem exibir os valores do tema anterior. Não resolver isso com um intervalo de polling.

### 5.6 Matriz mínima de validação do tema

| Cenário | Resultado esperado |
| --- | --- |
| Primeira visita, sistema claro | Aparência clara, opção Sistema selecionada |
| Primeira visita, sistema escuro | Aparência escura, opção Sistema selecionada |
| Salvo Claro, sistema escuro | Claro desde a primeira pintura e após reload |
| Salvo Escuro, sistema claro | Escuro desde a primeira pintura e após reload |
| Sistema ativo, sistema muda | Aparência acompanha; opção continua Sistema |
| Claro/Escuro explícito, sistema muda | Aparência manual não muda |
| Voltar de manual para Sistema | Resolver imediatamente a preferência atual do sistema |
| Chave inválida/removida | Recuperação para Sistema, sem erro e sem apagar dados |
| Armazenamento bloqueado | Aplicação e seletor funcionam na sessão |
| Outra aba altera a preferência | Aba aberta acompanha conforme o contrato |
| Troca de tema com diálogo aberto | Portal, overlay e foco coerentes, edição preservada |
| Troca durante edição inline/tour | Conteúdo, seleção/progresso e ações preservados |
| Troca de idioma e RTL | Tema permanece; rótulos traduzidos e cabeçalho sem colisão |
| Root, página localizada, catálogo | Mesmo tema, chave e comportamento em todos |
| Rede lenta e reload | Sem flash perceptível do tema errado; sem layout saltando |
| Navegador em tema manual contrário ao SO | Meta `theme-color` e controles nativos seguem o tema efetivo |

Adicionar testes pequenos para o contrato que envolve lógica própria (validação de preferência e resolução/fallback do bootstrap). Cobrir a integração visível com verificações de navegador. Não recriar testes internos do `next-themes`; não adicionar framework de testes de UI só para testar classes CSS.

## 6. Sequência de implementação e verificação

1. **Inventário e fundação dos dois temas:** reconferir diff/instruções; completar tokens claros/escuros, pares de ação/texto e cascata. Migrar as bases dos componentes e validar os contrastes. Não finalizar um tema inteiro com cores fixas para só depois adaptar o outro.
2. **Infraestrutura de aparência:** contrato/chave, provider, bootstrap, `color-scheme`, metas do navegador, seletor, traduções e catálogo. Verificar primeira visita, reload, preferência manual e sistema antes de expandir a alteração.
3. **Participantes:** rótulos de nível/posição, seletor de nível e tradução/acessibilidade. Conferir dados antigos com nível/posição ausentes e edição/salvamento nos dois temas.
4. **Composição:** cabeçalho responsivo com aparência/idioma/ajuda, gestão de participantes, hierarquia de ações, times e reservas. Usar estrutura e tipografia idênticas nos temas.
5. **Acabamento e integrações:** diálogos, menus, FAQ, tour, feedback de sorteio, foco e movimento reduzido. Conferir portais e estado aberto durante troca de tema.
6. **Validação final:** testes existentes e novos testes de lógica própria, lint, build multilíngue, matriz de temas e inspeção visual/teclado. Corrigir o parâmetro sem uso em `build-multilang.js` separadamente da mudança visual. Tratar atualização automática de sitemap como artefato de build, sem misturá-la ao refinamento.

Fazer commits por etapa para permitir revisão e reversão independentes. Preservar o stash antigo de OKLCH; sua aplicação não é requisito e conversão de espaço de cor não resolve contraste por si só.

### Cenários de aceitação

- Texto comum ≥ 4,5:1, inclusive placeholders informativos, contadores, botões e metadados; ícones/estados necessários ≥ 3:1 contra suas superfícies. Medir normal, hover, foco, selecionado e erro no navegador. Desabilitado deve ser distinguível de habilitado sem parecer um controle ativo ilegível.
- Sem rolagem horizontal em 320, 390, 768 e 1280 px. Conferir zoom de 200%, nomes longos, metadados em duas linhas e idiomas extensos/RTL.
- Estados: lista vazia, um participante, lista de 12–18 jogadores, dois times sem reservas, times com reservas, nomes duplicados, erro de validação e nova distribuição.
- Iniciante, intermediário e avançado compreensíveis sem cor, tooltip ou legenda. Líbero/levantador legíveis no celular e nos resultados.
- Toda ação funciona com teclado e tem nome acessível; foco visível, nenhum tooltip indispensável para compreender dados. Controles de nível anunciam grupo, opção e seleção.
- Editar nome, nível e posição, cancelar, salvar, sortear, manter um time e limpar continuam funcionando. O modelo de dados e o equilíbrio do sorteio não mudam.
- 369 testes existentes continuam passando; build multilíngue passa; lint sem erros. Os testes atuais não substituem a inspeção visual e de acessibilidade.
- Registrar capturas antes/depois com o mesmo viewport e dados de demonstração equivalentes, em desktop e mobile. Avaliar o conjunto antes de considerar o trabalho concluído.
- Executar os cenários visuais/funcionais em **Claro e Escuro**, além da matriz de Sistema da seção 5.6. Confirmar que resultados, edição, dados persistidos e idioma continuam iguais após alternar.
- Conferir foco/seleção, mensagens de erro e ações destrutivas nos dois temas; não aprovar apenas as amostras de cores e o botão primário.
- Documentar no PR/entrega os valores finais da paleta, preferência padrão, persistência, verificações realizadas e limitações reais. Referenciar este plano e as referências locais; a próxima sessão não deve depender do histórico desta conversa.

## Resumo das decisões

Reaproveitar as mudanças locais. Corrigir primeiro contraste e cascata. Entregar um layout comum com **Claro (papel/terracota), Escuro (Clube esportivo contemporâneo, grafite/verde-lima) e preferência Sistema**; padrão Sistema, escolha persistida e sem flash do tema errado. Trocar símbolos de habilidade e posição por texto explícito. Reduzir destaque de exclusão, preservar identidade dos times e resolver espaços excessivos. Completar o estilo de diálogos, menus, tour e catálogo em ambos os temas antes de encerrar o refinamento. Não implementar temas adicionais, alterar algoritmo ou aplicar o stash antigo como parte deste escopo.
