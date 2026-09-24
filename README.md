# Bio link

Página única de perfil (bio link), dark/aesthetic, em HTML + CSS + JavaScript puros.
Estática: funciona em HostGator, GitHub Pages, Vercel, Netlify ou qualquer servidor.

```
bio-link/
├── index.html      ← estrutura + meta tags de SEO/preview
├── style.css       ← visual
├── script.js       ← CONFIG (seus dados) + toda a lógica
└── assets/
    ├── avatar.webp, background.mp4, background.webp, og-image.jpg
    ├── capa-musica.webp, sweater-weather.mp3
    ├── favicon.svg, favicon.ico, favicon-32.png, favicon-192.png, apple-touch-icon.png
    └── icons/      ← ícones SVG (redes, volume, olho, pino, copiar)
```

## 1. Testar no seu computador

O site precisa rodar num servidor (abrir o `index.html` direto com dois cliques não funciona direito).

```bash
cd C:\Users\luisa\Documents\bio-link
python -m http.server 8088
```

Depois abra <http://localhost:8088>.

## 2. Editar seus dados: objeto `CONFIG`

Tudo fica no topo do `script.js`. Nada precisa ser mudado no HTML, **exceto as meta tags** (veja o passo 4).

| Campo | O que é |
|---|---|
| `nome`, `uid`, `bio`, `localizacao` | Textos do card (deixe `localizacao: ""` para esconder) |
| `videoYoutube` | Link (ou ID) de um vídeo do YouTube para o fundo. Tem prioridade sobre `video`. Deixe `""` para usar o .mp4 local |
| `avatar`, `video`, `fundoImagem`, `musica` | Caminhos dos arquivos |
| `volumeInicial` | 0–100 (padrão 30) |
| `musicaTitulo`, `musicaArtista`, `musicaCapa` | O que aparece no player (a capa é uma imagem quadrada, ~300×300) |
| `discordId` | Seu ID do Discord (veja abaixo) |
| `links.instagram` … `links.spotify` | URLs completas com `https://`. Deixe `""` para esconder o ícone |
| `contador.namespace` | **Troque** por algo único (ex.: `seunome-biolink-2026`) |
| `corDestaque`, `corDestaque2` | Cores do glow (padrão azul `#3b82f6` e azul claro `#60a5fa`) |
| `ativarNeve`, `ativarCursor`, `ativarTilt` | `true` / `false` |

### Status do Discord (Lanyard)
1. No Discord: **Configurações → Avançado → Modo desenvolvedor** (ativar).
2. Clique com o botão direito no seu perfil → **Copiar ID do usuário**. Cole em `discordId`.
3. Entre no servidor do Lanyard: <https://discord.gg/lanyard>. Sem isso a API não enxerga você.
4. Para aparecer a música, conecte o Spotify ao Discord e deixe "Exibir no perfil" ligado.

Sem ID, ou com a API fora do ar, aparece um card neutro ("status não configurado" / "status indisponível").

### Contador de visualizações
Usa o [Abacus](https://abacus.jasoncameron.dev), gratuito e sem cadastro. Conta 1 visita por sessão do navegador. Abrindo em `localhost` ele só **lê** o número, sem somar, então seus testes não inflam a contagem. Enquanto o site não recebe a 1ª visita publicada, o contador fica oculto no teste local.
Se o serviço falhar, o contador some (nenhum número é inventado).
Para trocar de provedor, reescreva só a função `buscarContagem()` no `script.js`. O comentário acima dela explica como.

> O `namespace` padrão (`biolink-n7q4x2`) está zerado e é só seu. Troque se quiser um nome próprio. Trocar o nome recomeça a contagem do zero.

## 3. Arquivos para substituir

| Arquivo | Para quê | Tamanho recomendado |
|---|---|---|
| `assets/avatar.webp` | Foto de perfil | 512×512 px, quadrada, < 100 KB |
| `assets/background.mp4` | Vídeo de fundo em loop (atual: carro com fumaça azul, 7,7 s, 720p60, sem áudio) | 1280×720 ou 1920×1080, 10–20 s, sem áudio, **< 5 MB** (H.264) |
| `assets/background.webp` | Imagem de fundo (fallback do vídeo e poster) | Mesma proporção do vídeo, < 300 KB. **Use o 1º frame do vídeo** para a troca imagem→vídeo ser invisível |
| `assets/sweater-weather.mp3` | Música de fundo (atual: Sweater Weather, 4 min, 160 kbps, 4,8 MB) | .mp3 128–160 kbps, < 5 MB. Troque o arquivo e atualize `musica` no CONFIG |
| `assets/capa-musica.webp` | Capa mostrada no player | 300×300, quadrada |
| `assets/og-image.jpg` | Imagem da prévia no WhatsApp/Instagram | **1200×630 px, JPG**, < 300 KB |
| `assets/favicon.svg`, `favicon.ico`, `favicon-32.png`, `favicon-192.png` | Ícone da aba: monograma "LD" em French Script, azul, sem fundo | SVG + 16/32/48, 32 e 192 px |
| `assets/apple-touch-icon.png` | Ícone ao salvar na tela inicial do iPhone | 180×180 px |

**Vídeo do YouTube no fundo:** o player oficial é incorporado mudo, em loop e sem controles. Ele só aparece quando começa a tocar, e antes disso fica a imagem de fundo. O vídeo precisa permitir incorporação (a maioria permite).

Se o vídeo faltar ou falhar, o site mostra só a imagem de fundo, sem erro visível. Para não usar vídeo, deixe `video: ""`.

Para tirar o 1º frame do seu vídeo como imagem: `ffmpeg -i background.mp4 -frames:v 1 background.webp`.

Para converter imagens em .webp: <https://squoosh.app> (grátis, no navegador).
Para comprimir o vídeo: HandBrake, preset "Web", sem faixa de áudio.

## 4. Meta tags (prévia do link)

WhatsApp e Instagram não rodam JavaScript, então título, descrição e imagem da prévia ficam no `<head>` do `index.html`.
Troque:
- `devluisam · links` (aparece 3×) se quiser outro título
- a descrição (aparece 3×)
- `https://seudominio.com/` (aparece 4×) pelo endereço real do site. A `og:image` **precisa ser URL completa**.

Depois de publicar, teste a prévia em <https://www.opengraph.xyz>. O WhatsApp guarda a prévia em cache, então para ver mudanças compartilhe com `?v=2` no final da URL.

## 5. Publicar

### Netlify (mais fácil)
1. Entre em <https://app.netlify.com/drop>.
2. Arraste a pasta `bio-link` inteira. Pronto, ele gera a URL.

### Vercel
```bash
npm i -g vercel
cd bio-link
vercel --prod
```
(Framework: "Other". Não tem build.)

### GitHub Pages
1. Crie um repositório e envie os arquivos (o `index.html` na raiz).
2. **Settings → Pages → Branch: main / root → Save**.
3. A URL fica `https://seuusuario.github.io/nome-do-repo/`.

### HostGator
1. cPanel → **Gerenciador de Arquivos** → `public_html` (ou a pasta do subdomínio).
2. Envie `index.html`, `style.css`, `script.js` e a pasta `assets` (pode enviar um .zip e usar "Extrair").
3. Ative o SSL (AutoSSL) para ter `https://`. A cópia para a área de transferência exige https.

## Acessibilidade e desempenho

- `prefers-reduced-motion`: desliga neve, vídeo, cursor, tilt, digitação e animações contínuas.
- Cursor e tilt só ativam com mouse; em telas touch ficam desligados.
- A neve usa um único floco pré-desenhado e ajusta a quantidade ao tamanho da tela (20 a 90 flocos).
- Navegação por teclado com foco visível. A tela de entrada abre com Enter.
- O vídeo usa `preload="metadata"`; a música só é baixada depois do clique.
- O volume passa por Web Audio, então o slider funciona também no iPhone (onde o volume normal do `<audio>` é ignorado).
