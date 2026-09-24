/* ==========================================================
   Bio link — script principal
   Tudo que você precisa editar está no objeto CONFIG abaixo.
   (Exceção: título/descrição/imagem de preview do link ficam
   nas meta tags do index.html — veja o README.)
   ========================================================== */

const CONFIG = {
  // ---------- Perfil ----------
  nome: "devluisam",
  uid: "UID 0001",
  bio: "código, treino e madrugadas.",
  localizacao: "Manaus, AM",

  // ---------- Arquivos (caminhos relativos ao index.html) ----------
  avatar: "assets/avatar.webp",
  // Vídeo de fundo do YouTube: cole o link ou só o ID do vídeo.
  // Tem prioridade sobre o "video" abaixo. Deixe "" para usar o .mp4 local.
  videoYoutube: "",
  video: "assets/background.mp4",     // deixe "" para usar só a imagem
  fundoImagem: "assets/background.webp", // fallback do vídeo (e poster)
  musica: "assets/sweater-weather.mp3",
  // Dados mostrados no player de música
  musicaTitulo: "Sweater Weather",
  musicaArtista: "The Neighbourhood",
  musicaCapa: "assets/capa-musica.webp",
  volumeInicial: 30,                   // 0 a 100

  // ---------- Discord (Lanyard) ----------
  // Seu ID de usuário do Discord (só números). Você também precisa entrar
  // no servidor do Lanyard: https://discord.gg/lanyard — veja o README.
  discordId: "1168072175589281865",
  discordNome: "Toshiba", // mostrado enquanto o Lanyard não responde

  // ---------- Redes (deixe "" para esconder o ícone) ----------
  links: {
    instagram: "https://instagram.com/luixss__",
    tiktok: "https://www.tiktok.com/@luixs.exe_",
    twitch: "",
    discord: "https://discord.com/users/1168072175589281865",
    github: "https://github.com/devluisam",
    linkedin: "https://www.linkedin.com/in/luis-henrique-94a6183b3",
    spotify: "https://open.spotify.com/user/31k2rgfsc5dj4cqoaobr3q4s3xc4",
  },

  // ---------- Contador de visualizações ----------
  // Troque "namespace" por algo único seu (ex.: "seunome-biolink-2026").
  contador: {
    ativo: true,
    namespace: "biolink-n7q4x2",
    chave: "visitas",
  },

  // ---------- Visual ----------
  corDestaque: "#3b82f6",   // cor principal do glow (azul)
  corDestaque2: "#60a5fa",  // cor secundária (azul claro)

  // ---------- Efeitos ----------
  ativarNeve: true,
  ativarCursor: true,
  ativarTilt: false, // sem o card, a inclinação deixava o conteúdo torto
};

/* ==========================================================
   Utilitários
   ========================================================== */
const $ = (id) => document.getElementById(id);

// Preferências do usuário/dispositivo
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Só aceita links http(s) — evita "javascript:" e erros de digitação
function urlValida(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

// Aviso rápido no rodapé ("Copiado!")
let timerToast;
function mostrarToast(texto) {
  const toast = $("toast");
  toast.textContent = texto;
  toast.classList.add("mostrar");
  clearTimeout(timerToast);
  timerToast = setTimeout(() => toast.classList.remove("mostrar"), 1600);
}

/* ==========================================================
   1. Aplicar o CONFIG na página
   ========================================================== */
function aplicarConfig() {
  const raiz = document.documentElement.style;
  raiz.setProperty("--accent", CONFIG.corDestaque);
  raiz.setProperty("--accent-2", CONFIG.corDestaque2 || CONFIG.corDestaque);

  document.title = `${CONFIG.nome} · links`;
  document.body.style.backgroundImage = `url("${CONFIG.fundoImagem}")`;

  const avatar = $("avatar");
  avatar.src = CONFIG.avatar;
  avatar.alt = `Foto de perfil de ${CONFIG.nome}`;

  $("nome").setAttribute("aria-label", CONFIG.nome);
  $("uid").textContent = CONFIG.uid;
  $("bio").textContent = CONFIG.bio;
  $("local-texto").textContent = CONFIG.localizacao;
  $("local").hidden = !CONFIG.localizacao;

  montarRedes();
}

/* ==========================================================
   2. Redes sociais
   ========================================================== */
const REDES = [
  { chave: "instagram", rotulo: "Instagram" },
  { chave: "tiktok", rotulo: "TikTok" },
  { chave: "twitch", rotulo: "Twitch" },
  { chave: "discord", rotulo: "Discord" },
  { chave: "github", rotulo: "GitHub" },
  { chave: "linkedin", rotulo: "LinkedIn" },
  { chave: "spotify", rotulo: "Spotify", copiavel: true },
];

function montarRedes() {
  const lista = $("redes");
  lista.textContent = "";

  for (const rede of REDES) {
    const url = CONFIG.links[rede.chave];
    if (!url || !urlValida(url)) continue;

    const li = document.createElement("li");
    li.className = "redes__item";

    const a = document.createElement("a");
    a.className = "rede";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", `${rede.rotulo} (abre em nova aba)`);
    a.title = rede.rotulo;
    a.innerHTML = `<span class="icone icone--${rede.chave}" aria-hidden="true"></span>`;
    // Entra em sequência depois do resto do perfil (ver [data-entrada] no CSS)
    a.dataset.entrada = "";
    a.style.setProperty("--i", 6 + lista.children.length);
    li.append(a);

    // Spotify ganha o botão de copiar link
    if (rede.copiavel) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "copiar";
      botao.title = `Copiar link do ${rede.rotulo}`;
      botao.setAttribute("aria-label", `Copiar link do ${rede.rotulo}`);
      botao.innerHTML = '<span class="icone icone--copiar" aria-hidden="true"></span>';
      botao.addEventListener("click", () => copiarTexto(url));
      li.append(botao);
    }

    lista.append(li);
  }
}

// Copia para a área de transferência (com plano B para navegadores antigos / http)
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.cssText = "position:fixed;opacity:0";
    document.body.append(campo);
    campo.select();
    const ok = document.execCommand("copy");
    campo.remove();
    if (!ok) return mostrarToast("Não foi possível copiar");
  }
  mostrarToast("Copiado!");
}

/* ==========================================================
   3. Vídeo de fundo (com fallback para imagem)
   ========================================================== */
// Aceita link completo (watch?v=, youtu.be/, shorts/) ou só o ID
function idDoYoutube(valor) {
  if (!valor) return "";
  if (/^[\w-]{11}$/.test(valor)) return valor;
  const achou = valor.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return achou ? achou[1] : "";
}

function iniciarYoutube(id) {
  // Enquanto o vídeo carrega (ou se falhar) fica a imagem de fundo do CONFIG.
  // (A capa do YouTube não é usada: muitas vêm com selos tipo "4K".)
  if (reduzMovimento) return; // movimento reduzido: só a imagem

  const alvo = document.createElement("div");
  alvo.id = "yt-fundo";
  $("video-fundo").replaceWith(alvo);

  // API oficial do player do YouTube
  window.onYouTubeIframeAPIReady = () => {
    const player = new YT.Player("yt-fundo", {
      videoId: id,
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        // Sem "loop/playlist" do YouTube: eles fazem aparecer os botões
        // de anterior/próximo. O loop é feito abaixo, voltando antes do fim.
        autoplay: 1, mute: 1, controls: 0, playsinline: 1,
        disablekb: 1, fs: 0, rel: 0, iv_load_policy: 3, modestbranding: 1,
      },
      events: {
        onReady: (e) => { e.target.mute(); e.target.playVideo(); },
        onStateChange: (e) => {
          // Só aparece quando está tocando (esconde título/capa do YouTube)
          if (e.data === YT.PlayerState.PLAYING) player.getIframe().classList.add("pronto");
          // Se pausar ou acabar por qualquer motivo, volta a tocar
          if (e.data === YT.PlayerState.ENDED || e.data === YT.PlayerState.PAUSED) {
            player.seekTo(0);
            player.playVideo();
          }
        },
        onError: () => player.getIframe().remove(), // fica a imagem de fundo
      },
    });
    // Volta ao início meio segundo antes do fim (evita a tela final do YouTube)
    setInterval(() => {
      const dur = player.getDuration ? player.getDuration() : 0;
      if (dur && player.getCurrentTime() > dur - 0.6) player.seekTo(0);
    }, 250);

    const iframe = player.getIframe();
    iframe.className = "fundo__yt";
    iframe.setAttribute("tabindex", "-1");
    iframe.setAttribute("title", "Vídeo de fundo (decorativo)");
  };

  const api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api";
  document.head.append(api);
}

function iniciarVideo() {
  const video = $("video-fundo");
  video.poster = CONFIG.fundoImagem;

  const idYoutube = idDoYoutube(CONFIG.videoYoutube);
  if (idYoutube) {
    iniciarYoutube(idYoutube);
    return;
  }

  // Sem vídeo configurado, ou movimento reduzido: fica só a imagem estática
  if (!CONFIG.video || reduzMovimento) {
    video.remove();
    return;
  }

  // Se o vídeo falhar, remove o elemento e a imagem do body aparece
  video.addEventListener("error", () => video.remove(), { once: true });
  video.addEventListener("canplay", () => {
    video.classList.add("pronto");
    video.play().catch(() => {}); // alguns navegadores só tocam após interação
  }, { once: true });

  video.src = CONFIG.video;
}

/* ==========================================================
   4. Música + controle de volume
   ========================================================== */
const audio = $("musica");
const btnMudo = $("btn-mudo");
const slider = $("slider-volume");

// No iPhone/iPad o audio.volume é ignorado (sempre 100%). Por isso o volume
// passa por um GainNode do Web Audio, que funciona em todos os navegadores.
// Se o Web Audio não existir, cai no audio.volume normal.
let ganho = null;
let volumeAtual = 0.3;

function criarGanho() {
  const Contexto = window.AudioContext || window.webkitAudioContext;
  if (!Contexto || ganho) return;
  try {
    const ctx = new Contexto();
    ganho = ctx.createGain();
    ctx.createMediaElementSource(audio).connect(ganho).connect(ctx.destination);
    audio.volume = 1;
    ganho.gain.value = volumeAtual;
    if (ctx.state === "suspended") ctx.resume();
  } catch {
    ganho = null;
  }
}

function definirVolume(v) {
  volumeAtual = v;
  if (ganho) {
    // Cancela o fade-in se a pessoa mexer no volume no meio dele
    const agora = ganho.context.currentTime;
    ganho.gain.cancelScheduledValues(agora);
    ganho.gain.setValueAtTime(v, agora);
  } else {
    audio.volume = v;
  }
}

// Música começa baixinho e sobe até o volume escolhido
function fadeInMusica(segundos) {
  if (!ganho) return;
  const agora = ganho.context.currentTime;
  ganho.gain.cancelScheduledValues(agora);
  ganho.gain.setValueAtTime(0, agora);
  ganho.gain.linearRampToValueAtTime(volumeAtual, agora + segundos);
}

function atualizarIconeVolume() {
  const mudo = audio.muted || volumeAtual === 0;
  const icone = btnMudo.querySelector(".icone");
  icone.classList.toggle("icone--volume", !mudo);
  icone.classList.toggle("icone--mudo", mudo);
  btnMudo.setAttribute("aria-pressed", String(mudo));
  btnMudo.setAttribute("aria-label", mudo ? "Ativar música" : "Silenciar música");
  slider.style.setProperty("--preenchido", `${audio.muted ? 0 : slider.value}%`);
}

function iniciarControleVolume() {
  const inicial = Math.min(100, Math.max(0, CONFIG.volumeInicial));
  slider.value = inicial;
  definirVolume(inicial / 100);

  slider.addEventListener("input", () => {
    definirVolume(slider.value / 100);
    // Mexer no slider tira do mudo automaticamente
    if (audio.muted && slider.value > 0) audio.muted = false;
    atualizarIconeVolume();
  });

  btnMudo.addEventListener("click", () => {
    audio.muted = !audio.muted;
    // Se estava em 0 e desmutou, volta para um volume audível
    if (!audio.muted && volumeAtual === 0) {
      slider.value = 30;
      definirVolume(0.3);
    }
    atualizarIconeVolume();
  });

  // Sem música configurada (ou arquivo não encontrado): esconde o controle
  audio.addEventListener("error", () => { $("volume").hidden = true; });
  if (!CONFIG.musica) $("volume").hidden = true;

  atualizarIconeVolume();
}

function tocarMusica() {
  if (!CONFIG.musica) return;
  audio.src = CONFIG.musica;
  criarGanho(); // precisa acontecer dentro do clique (exigência do iOS)
  fadeInMusica(reduzMovimento ? 0.01 : 2.5);
  audio.play().catch(() => {
    // Autoplay bloqueado mesmo após o clique (raro): o botão de volume ainda funciona
  });
}

/* ==========================================================
   4b. Player da música (capa, progresso, tocar/pausar)
   ========================================================== */
function formatarTempo(seg) {
  if (!isFinite(seg)) return "0:00";
  const m = Math.floor(seg / 60);
  const s = Math.floor(seg % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function iniciarPlayer() {
  const player = $("player");
  if (!CONFIG.musica) {
    player.hidden = true;
    return;
  }

  const botao = $("player-play");
  const barra = $("player-progresso");
  const capa = $("player-capa");

  $("player-titulo").textContent = CONFIG.musicaTitulo || "Música";
  $("player-artista").textContent = CONFIG.musicaArtista || "";
  capa.src = CONFIG.musicaCapa || CONFIG.avatar;
  capa.alt = `Capa de ${CONFIG.musicaTitulo || "música"}`;

  // Controles na tela de bloqueio / central de mídia do celular
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: CONFIG.musicaTitulo || "",
      artist: CONFIG.musicaArtista || "",
      artwork: [{ src: new URL(capa.src, location.href).href, sizes: "300x300", type: "image/webp" }],
    });
  }

  let arrastando = false;

  const atualizarEstado = () => {
    const tocando = !audio.paused;
    player.classList.toggle("tocando", tocando);
    botao.setAttribute("aria-label", tocando ? "Pausar música" : "Tocar música");
  };

  const atualizarBarra = () => {
    if (arrastando || !audio.duration) return;
    const fracao = audio.currentTime / audio.duration;
    barra.value = Math.round(fracao * 1000);
    barra.style.setProperty("--progresso", `${fracao * 100}%`);
    $("player-atual").textContent = formatarTempo(audio.currentTime);
  };

  botao.addEventListener("click", () => {
    if (audio.paused) {
      if (!audio.src) audio.src = CONFIG.musica;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  // Arrastar a barra: mostra o tempo ao vivo e pula quando solta
  barra.addEventListener("input", () => {
    arrastando = true;
    const fracao = barra.value / 1000;
    barra.style.setProperty("--progresso", `${fracao * 100}%`);
    $("player-atual").textContent = formatarTempo(fracao * (audio.duration || 0));
  });
  barra.addEventListener("change", () => {
    if (audio.duration) audio.currentTime = (barra.value / 1000) * audio.duration;
    arrastando = false;
  });

  audio.addEventListener("play", atualizarEstado);
  audio.addEventListener("pause", atualizarEstado);
  audio.addEventListener("timeupdate", atualizarBarra);
  audio.addEventListener("loadedmetadata", () => {
    $("player-total").textContent = formatarTempo(audio.duration);
  });
  audio.addEventListener("error", () => { player.hidden = true; });

  atualizarEstado();
}

/* ==========================================================
   5. Splash (tela de entrada)
   ========================================================== */
function iniciarSplash() {
  const splash = $("splash");
  const conteudo = $("conteudo");

  $("splash-avatar").src = CONFIG.avatar;
  // Celular/tablet: "toque"; computador: "clique"
  if (window.matchMedia("(hover: none)").matches) {
    $("splash-texto").textContent = "toque para entrar";
  }
  if (!CONFIG.musica) splash.querySelector(".splash__dica").hidden = true;

  splash.addEventListener("click", () => {
    splash.classList.add("saindo");
    tocarMusica();
    // O perfil começa a surgir enquanto o véu ainda está sumindo
    setTimeout(() => {
      conteudo.inert = false;
      conteudo.classList.add("visivel");
      efeitoDigitacao();
    }, reduzMovimento ? 0 : 250);
    // Remove o splash do DOM depois do fade-out
    setTimeout(() => splash.remove(), 1100);
  }, { once: true });

  // Enter ou espaço também entram (sem precisar focar o botão antes)
  const porTeclado = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    document.removeEventListener("keydown", porTeclado);
    if (splash.isConnected && !splash.classList.contains("saindo")) splash.click();
  };
  document.addEventListener("keydown", porTeclado);
}

/* ==========================================================
   6. Nome com efeito "typewriter"
   ========================================================== */
function efeitoDigitacao() {
  const alvo = $("nome-texto");
  const nome = CONFIG.nome;

  if (reduzMovimento) {
    alvo.textContent = nome;
    $("nome").classList.add("digitado");
    return;
  }

  let i = 0;
  const passo = () => {
    alvo.textContent = nome.slice(0, ++i);
    if (i < nome.length) setTimeout(passo, 70 + Math.random() * 80);
    else $("nome").classList.add("digitado");
  };
  setTimeout(passo, 500);
}

/* ==========================================================
   7. Neve (canvas leve)
   - Um único floco é desenhado uma vez num canvas fora da tela e
     depois só é "carimbado" (drawImage), o que é bem barato.
   - A quantidade se adapta ao tamanho da tela.
   ========================================================== */
function iniciarNeve() {
  const canvas = $("neve");
  if (!CONFIG.ativarNeve || reduzMovimento) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let largura = 0;
  let altura = 0;
  let flocos = [];

  // Floco pré-renderizado (64px, depois escalado)
  const base = document.createElement("canvas");
  base.width = base.height = 64;
  const bctx = base.getContext("2d");
  bctx.fillStyle = "#fff";
  bctx.shadowColor = "rgba(255,255,255,0.8)";
  bctx.shadowBlur = 6;
  bctx.font = "44px 'Segoe UI Symbol', 'Noto Sans Symbols', sans-serif";
  bctx.textAlign = "center";
  bctx.textBaseline = "middle";
  bctx.fillText("❅", 32, 34);

  const novoFloco = (topo) => ({
    x: Math.random() * largura,
    y: topo ? -20 : Math.random() * altura,
    tamanho: 8 + Math.random() * 16,
    velocidade: 0.35 + Math.random() * 1.1,
    opacidade: 0.25 + Math.random() * 0.6,
    balanco: Math.random() * Math.PI * 2,
    giro: Math.random() * Math.PI,
    velGiro: (Math.random() - 0.5) * 0.02,
  });

  function redimensionar() {
    largura = window.innerWidth;
    altura = window.innerHeight;
    canvas.width = largura * dpr;
    canvas.height = altura * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ~1 floco a cada 16 mil px², entre 20 e 90
    const total = Math.max(20, Math.min(90, Math.round((largura * altura) / 16000)));
    while (flocos.length < total) flocos.push(novoFloco(false));
    flocos.length = total;
  }

  let anterior = performance.now();
  function quadro(agora) {
    // Normaliza pelo tempo para ter a mesma velocidade em 60 Hz ou 120 Hz
    const dt = Math.min((agora - anterior) / 16.67, 3);
    anterior = agora;

    ctx.clearRect(0, 0, largura, altura);
    for (const f of flocos) {
      f.y += f.velocidade * dt;
      f.balanco += 0.012 * dt;
      f.giro += f.velGiro * dt;
      const x = f.x + Math.sin(f.balanco) * 18;

      if (f.y > altura + 20) Object.assign(f, novoFloco(true));

      ctx.globalAlpha = f.opacidade;
      ctx.save();
      ctx.translate(x, f.y);
      ctx.rotate(f.giro);
      ctx.drawImage(base, -f.tamanho / 2, -f.tamanho / 2, f.tamanho, f.tamanho);
      ctx.restore();
    }
    requestAnimationFrame(quadro);
  }

  redimensionar();
  window.addEventListener("resize", redimensionar, { passive: true });
  requestAnimationFrame(quadro);
}

/* ==========================================================
   8. Tilt 3D no card (só com mouse)
   ========================================================== */
function iniciarTilt() {
  if (!CONFIG.ativarTilt || reduzMovimento || !temMouse) return;

  const card = $("card");
  const MAX = 7; // graus
  let pendente = false;

  card.addEventListener("pointermove", (e) => {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5 .. 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${(-py * MAX * 2).toFixed(2)}deg) rotateY(${(px * MAX * 2).toFixed(2)}deg)`;
      pendente = false;
    });
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
}

/* ==========================================================
   9. Cursor personalizado com rastro sutil (só com mouse)
   ========================================================== */
function iniciarCursor() {
  const anel = $("cursor");
  if (!CONFIG.ativarCursor || reduzMovimento || !temMouse) {
    anel.remove();
    return;
  }

  const QTD_RASTRO = 6;
  const rastro = Array.from({ length: QTD_RASTRO }, (_, i) => {
    const el = document.createElement("div");
    el.className = "rastro";
    el.setAttribute("aria-hidden", "true");
    el.style.opacity = String(0.45 * (1 - i / QTD_RASTRO));
    document.body.append(el);
    return { el, x: -100, y: -100 };
  });

  const mouse = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };

  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    anel.classList.add("ativo");
    anel.classList.toggle("sobre-link", !!e.target.closest("a, button, input"));
  }, { passive: true });
  document.addEventListener("pointerleave", () => anel.classList.remove("ativo"));

  function quadro() {
    // Anel segue o mouse com suavização
    pos.x += (mouse.x - pos.x) * 0.22;
    pos.y += (mouse.y - pos.y) * 0.22;
    anel.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

    // Cada ponto do rastro segue o anterior
    let alvoX = mouse.x;
    let alvoY = mouse.y;
    for (const p of rastro) {
      p.x += (alvoX - p.x) * 0.35;
      p.y += (alvoY - p.y) * 0.35;
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      alvoX = p.x;
      alvoY = p.y;
    }
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
}

/* ==========================================================
   10. Status do Discord via Lanyard
   Docs: https://github.com/Phineas/lanyard
   ========================================================== */
const TEXTO_STATUS = {
  online: "online",
  idle: "ausente",
  dnd: "não perturbe",
  offline: "offline",
};

let discordCarregado = false;

// Card neutro: usado quando não há ID ou a API falha
function discordNeutro(motivo) {
  $("dc-nome").textContent = CONFIG.discordNome || "Discord";
  $("dc-status").textContent = motivo;
  $("dc-bolinha").dataset.status = "offline";
  $("dc-avatar").src = CONFIG.avatar;
  $("dc-atividade").hidden = true;
  $("dc-arte").hidden = true;
}

function avatarDiscord(usuario) {
  if (usuario.avatar) {
    const ext = usuario.avatar.startsWith("a_") ? "gif" : "webp";
    return `https://cdn.discordapp.com/avatars/${usuario.id}/${usuario.avatar}.${ext}?size=128`;
  }
  // Avatar padrão do Discord (usuários sem foto)
  const indice = Number((BigInt(usuario.id) >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${indice}.png`;
}

function arteDaAtividade(atv) {
  const img = atv.assets && atv.assets.large_image;
  if (!img) return "";
  if (img.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${img.slice("mp:external/".length)}`;
  }
  if (atv.application_id) {
    return `https://cdn.discordapp.com/app-assets/${atv.application_id}/${img}.png`;
  }
  return "";
}

function renderizarDiscord(d) {
  const usuario = d.discord_user;
  $("dc-nome").textContent = usuario.global_name || usuario.display_name || usuario.username;
  $("dc-avatar").src = avatarDiscord(usuario);
  $("dc-avatar").alt = "";
  $("dc-bolinha").dataset.status = d.discord_status;

  // Status personalizado (tipo 4) vira o texto do status
  const custom = d.activities.find((a) => a.type === 4);
  const status = TEXTO_STATUS[d.discord_status] || "offline";
  $("dc-status").textContent = custom && custom.state ? `${status} · ${custom.state}` : status;

  const atividade = $("dc-atividade");
  const arte = $("dc-arte");
  let texto = "";
  let imagem = "";

  if (d.listening_to_spotify && d.spotify) {
    // Música do Spotify
    texto = `🎧 ${d.spotify.song} — ${d.spotify.artist}`;
    imagem = d.spotify.album_art_url || "";
  } else {
    // Jogo / app (ignora o status personalizado)
    const atv = d.activities.find((a) => a.type !== 4);
    if (atv) {
      const verbo = { 0: "jogando", 1: "transmitindo", 2: "ouvindo", 3: "assistindo", 5: "competindo em" }[atv.type] || "em";
      texto = `${verbo} ${atv.name}${atv.details ? ` · ${atv.details}` : ""}`;
      imagem = arteDaAtividade(atv);
    }
  }

  atividade.textContent = texto;
  atividade.hidden = !texto;
  atividade.title = texto;
  if (imagem) {
    arte.src = imagem;
    arte.alt = texto;
    arte.hidden = false;
    arte.onerror = () => { arte.hidden = true; };
  } else {
    arte.hidden = true;
  }
}

async function atualizarDiscord() {
  if (document.hidden && discordCarregado) return; // aba em segundo plano: não gasta requisição
  try {
    const resposta = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.discordId}`, { cache: "no-store" });
    const json = await resposta.json();
    if (!json.success) throw new Error(json.error && json.error.message);
    renderizarDiscord(json.data);
    discordCarregado = true;
  } catch {
    // Se já mostrou dados antes, mantém os últimos; senão, card neutro
    if (!discordCarregado) discordNeutro("status indisponível");
  }
}

function iniciarDiscord() {
  if (!/^\d{15,21}$/.test(CONFIG.discordId)) {
    discordNeutro("status não configurado");
    return;
  }
  discordNeutro("carregando status…"); // enquanto a API responde
  atualizarDiscord();
  setInterval(atualizarDiscord, 30_000);
}

/* ==========================================================
   11. Contador de visualizações
   Provedor atual: Abacus (gratuito, sem cadastro)
   https://abacus.jasoncameron.dev
     /hit/{namespace}/{chave} → soma 1 e retorna { value }
     /get/{namespace}/{chave} → só lê e retorna { value }

   Para TROCAR de provedor, reescreva apenas buscarContagem():
   ela recebe `incrementar` (true/false) e deve retornar um número.
   Se der erro, o contador fica escondido (nada de número inventado).
   ========================================================== */
async function buscarContagem(incrementar) {
  const { namespace, chave } = CONFIG.contador;
  const acao = incrementar ? "hit" : "get";
  const url = `https://abacus.jasoncameron.dev/${acao}/${encodeURIComponent(namespace)}/${encodeURIComponent(chave)}`;
  const resposta = await fetch(url, { cache: "no-store" });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const json = await resposta.json();
  if (typeof json.value !== "number") throw new Error("resposta inesperada");
  return json.value;
}

async function iniciarContador() {
  if (!CONFIG.contador.ativo) return;

  // Conta uma vez por sessão (recarregar a página não soma de novo).
  // Testes no seu computador (localhost) só leem o número, nunca somam.
  const local = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  let jaContou = local;
  try { jaContou = jaContou || sessionStorage.getItem("bio-visita") === "1"; } catch {}

  try {
    const total = await buscarContagem(!jaContou);
    try { sessionStorage.setItem("bio-visita", "1"); } catch {}
    $("views-numero").textContent = total.toLocaleString("pt-BR");
    $("views").hidden = false;
  } catch {
    $("views").hidden = true;
  }
}

/* ==========================================================
   Início
   ========================================================== */
aplicarConfig();
iniciarVideo();
iniciarControleVolume();
iniciarPlayer();
iniciarSplash();
iniciarNeve();
iniciarTilt();
iniciarCursor();
iniciarDiscord();
iniciarContador();
