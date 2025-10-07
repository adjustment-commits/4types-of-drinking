// ====== アルコール換算テーブル ======
const alcoholTable = { beer: 20, chu: 20, high: 20, sake: 22, whisky: 19 };

// ====== 診断処理 ======
function showResult() {
  const answered = document.querySelectorAll('input[name^="q"]:checked').length;
  if (answered < 10) {
    alert("すべての質問に答えてください。");
    return;
  }

  // スコア集計
  let score = { slow: 0, fast: 0, emo: 0, cool: 0 };
  document.querySelectorAll('input[name^="q"]:checked').forEach(a => score[a.value]++);
  const axis1 = score.slow > score.fast ? "slow" : "fast";
  const axis2 = score.emo > score.cool ? "emo" : "cool";
  const type = axis1 + "-" + axis2;

  // ベース耐性値
  const baseDose = {
    "slow-emo": 30,
    "fast-emo": 40,
    "fast-cool": 45,
    "slow-cool": 35
  };

  let grams = baseDose[type];
  const cond = parseFloat(document.querySelector('input[name="condition"]:checked').value);
  const party = document.getElementById("partyMode").checked ? 1.5 : 1.0;
  grams = Math.round(grams * cond * party);

  // 各タイプ情報
  const data = {
    "slow-emo": {
      name: "🔥Slow-Emo（感情ジェット型）",
      img: "image/slow-emo.png",
      desc: "感情が燃えやすく、ペースを見失いやすいタイプ。",
      bg: "linear-gradient(135deg,#b34700,#3d1f00)"
    },
    "fast-emo": {
      name: "⚡Fast-Emo（社交ターボ型）",
      img: "image/fast-emo.png",
      desc: "ノリの良さが魅力の瞬発型。",
      bg: "linear-gradient(135deg,#9b4227,#3c1f1f)"
    },
    "fast-cool": {
      name: "❄️Fast-Cool（理性スプリント型）",
      img: "image/fast-cool.png",
      desc: "代謝が速く、冷静さを保てる理性タイプ。",
      bg: "linear-gradient(135deg,#455a64,#1c313a)"
    },
    "slow-cool": {
      name: "🌿Slow-Cool（慎重ハイブリッド型）",
      img: "image/slow-cool.png",
      desc: "穏やかで安定感のあるバランスタイプ。",
      bg: "linear-gradient(135deg,#2e7d32,#0d5302)"
    }
  };

  // 結果表示
  const info = data[type];
  document.body.style.background = info.bg;
  document.getElementById("typeName").textContent = info.name;
  document.getElementById("typeImg").src = info.img;
  document.getElementById("typeDesc").textContent = info.desc;

  const beer = Math.round(grams / 20),
        chu = Math.round(grams / 20),
        high = Math.round(grams / 20),
        sake = Math.round(grams / 22),
        whisky = Math.round(grams / 19);

  document.getElementById("doseResult").innerHTML =
    `推奨：純アルコール ${grams}g／日 程度<br>
    🍺ビール:${beer}本 🍹酎ハイ:${chu}缶 🥃ハイボール:${high}杯<br>
    🍶日本酒:${sake}合 🟤ウイスキー:${whisky}杯`;

  // 表示切替
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("intakeInput").style.display = "block";
  window.lastDose = { grams, type };
}

// ====== 飲酒量計算 ======
function calcTotalIntake() {
  let total = 0;
  for (let key in alcoholTable) {
    const val = parseFloat(document.getElementById(key).value) || 0;
    total += alcoholTable[key] * val;
  }

  const safe = window.lastDose ? window.lastDose.grams : 40;
  const type = window.lastDose ? window.lastDose.type : "fast-cool";

  let msg = "", color = "", advice = "";
  if (total <= safe) {
    msg = `🍀 合計 ${total}g。理想的なペースです。`;
    color = "#2e7d32";
    advice = type.includes("emo") ? "水を多めにとって余韻を楽しもう。" : "軽い食事と一緒にリラックスを。";
  } else if (total <= safe * 1.5) {
    msg = `⚠️ ${total}g（やや超過）。少しペースを落とそう。`;
    color = "#f9a825";
    advice = type.includes("emo") ? "途中でノンアルを挟もう！" : "油ものを控えて胃を守ろう。";
  } else {
    msg = `🚫 ${total}g（危険域）。今日はブレーキを。`;
    color = "#c62828";
    advice = type.includes("emo") ? "一度深呼吸してペースダウン。" : "水分をしっかり取って早めの休息を。";
  }

  const out = document.getElementById("intakeResult");
  out.style.color = color;
  out.innerHTML = msg;
  document.getElementById("advice").textContent = advice;
}

// ====== 再スタート ======
function restart() {
  document.body.style.background = "linear-gradient(135deg,#0f2027,#203a43,#2c5364)";
  document.getElementById("result").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  document.querySelectorAll('input[type=radio],input[type=checkbox]').forEach(el => el.checked = false);
  ['beer', 'chu', 'high', 'sake', 'whisky'].forEach(id => document.getElementById(id).value = 0);
  document.getElementById("intakeInput").style.display = "none";
}

// ====== モーダル制御 ======
const modal = document.getElementById("typeModal");
const openBtn = document.getElementById("toggleTypeCards");
const closeBtn = document.getElementById("closeModal");

openBtn.addEventListener("click", () => { modal.style.display = "flex"; });
closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

// ====== PWA登録 ======
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('✅ ServiceWorker registered:', reg))
      .catch(err => console.log('❌ SW registration failed:', err));
  });
}
