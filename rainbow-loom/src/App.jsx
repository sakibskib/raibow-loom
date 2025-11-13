import { useState, useMemo } from "react";
import "./App.css";

const PALETTE_COLORS = [
  { name: "Hot Pink", value: "#ff4f9a" },
  { name: "Bubblegum", value: "#ff8ad9" },
  { name: "Sunshine", value: "#ffd54a" },
  { name: "Peach", value: "#ffb26b" },
  { name: "Lime", value: "#a8e676" },
  { name: "Mint", value: "#74e0c4" },
  { name: "Sky", value: "#7ecbff" },
  { name: "Lilac", value: "#b39dff" },
  { name: "Purple", value: "#9b5bff" },
  { name: "Midnight", value: "#2c3e50" },
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" }
];

function App() {
  const [patternColors, setPatternColors] = useState([]);
  const [beadMessage, setBeadMessage] = useState("");
  const [notes, setNotes] = useState("");

  const hasColors = patternColors.length > 0;
  const totalSegments = 28;

  const segments = useMemo(() => {
    const msg = beadMessage.trim();
    const msgChars = msg.split("");
    const beadPositions = [];

    if (msgChars.length > 0) {
      const spacing = Math.max(
        2,
        Math.floor(totalSegments / (msgChars.length + 1))
      );
      for (let i = 0; i < msgChars.length; i++) {
        beadPositions.push((i + 1) * spacing);
      }
    }

    const result = [];
    for (let i = 0; i < totalSegments; i++) {
      const beadIndex = beadPositions.indexOf(i);
      if (beadIndex !== -1 && msgChars[beadIndex]) {
        result.push({
          type: "bead",
          label: msgChars[beadIndex],
          key: `bead-${i}`
        });
      } else {
        const colorObj = hasColors
          ? patternColors[i % patternColors.length]
          : null;
        result.push({
          type: "band",
          color: colorObj ? colorObj.value : "#ddd",
          key: `band-${i}`
        });
      }
    }

    return result;
  }, [beadMessage, patternColors, hasColors]);

  const instructionsText = useMemo(() => {
    const msg = beadMessage.trim();
    const n = notes.trim();

    if (patternColors.length === 0 && msg === "" && n === "") {
      return "Add some colors and a bead message to see easy loom instructions here.";
    }

    let text = "";

    if (patternColors.length > 0) {
      const names = patternColors.map((c) => c.name);
      text += `1. Make your band pattern by repeating: ${names.join(" → ")}.\n`;
    } else {
      text += "1. Choose some band colors above to create your pattern.\n";
    }

    if (msg !== "") {
      text += `2. Spell out the bead message "${msg}" using letter beads.\n`;
      text +=
        "3. Space the beads evenly along the bracelet so the word is centered on the wrist.\n";
    } else {
      text += "2. Add letter beads if you want to spell a name or message.\n";
    }

    if (n !== "") {
      text += `\nExtra Notes:\n${n}`;
    }

    return text;
  }, [patternColors, beadMessage, notes]);

  const addColor = (color) => {
    setPatternColors((prev) => [...prev, color]);
  };

  const removeColorAt = (indexToRemove) => {
    setPatternColors((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const undoLastColor = () => {
    setPatternColors((prev) => prev.slice(0, -1));
  };

  const clearColors = () => {
    setPatternColors([]);
  };

  return (
    <div className="app">
      <header>
        <h1>Rainbow Loom Bracelet Maker 💖</h1>
        <p>For you Ashton 💕</p>
      </header>

      <div className="card">
        <h2>
          <span>🎨</span> Band Colors
        </h2>
        <div className="label">
          Choose band colors (click to add to the pattern):
        </div>

        <div className="color-palette">
          {PALETTE_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              className="color-swatch"
              style={{ background: c.value }}
              title={c.name}
              onClick={() => addColor(c)}
            />
          ))}
        </div>

        <div className="label" style={{ marginTop: "0.5rem" }}>
          Current pattern:
        </div>
        <div className="chosen-colors">
          {patternColors.length === 0 ? (
            <span>
              No colors yet. Click a color above to start your pattern.
            </span>
          ) : (
            patternColors.map((c, index) => (
              <div className="color-pill" key={`${c.name}-${index}`}>
                <div
                  className="color-dot"
                  style={{ background: c.value }}
                />
                <span>{c.name}</span>
                <button
                  type="button"
                  className="tiny-button"
                  title="Remove this color from pattern"
                  onClick={() => removeColorAt(index)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pill-info">
          {patternColors.length > 0
            ? `Pattern length: ${patternColors.length} colors (they'll just repeat along the bracelet).`
            : ""}
        </div>

        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={undoLastColor}
            disabled={patternColors.length === 0}
          >
            Undo last color
          </button>
          <button
            type="button"
            className="secondary"
            onClick={clearColors}
            disabled={patternColors.length === 0}
          >
            Clear pattern
          </button>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <div className="half">
            <h2>
              <span>🔤</span> Bead Message
            </h2>
            <div className="label">Special word / name / message:</div>
            <input
              type="text"
              maxLength={20}
              placeholder="e.g. Ashton 💕"
              value={beadMessage}
              onChange={(e) => setBeadMessage(e.target.value)}
            />

            {/* <div className="label" style={{ marginTop: "0.7rem" }}>
              Notes (optional):
            </div>
            <textarea
              placeholder="Write little instructions for how to place beads, or a cute note for her..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            /> */}
          </div>

          <div className="half">
            <h2>
              <span>👀</span> Preview
            </h2>
            <div className="preview-container">
              <div className="bracelet">
                {patternColors.length === 0 &&
                beadMessage.trim() === "" ? (
                  <span>
                    Add colors and a message to see your bracelet!
                  </span>
                ) : (
                  segments.map((seg) =>
                    seg.type === "bead" ? (
                      <div
                        key={seg.key}
                        className="segment bead"
                      >
                        {seg.label}
                      </div>
                    ) : (
                      <div
                        key={seg.key}
                        className="segment band"
                        style={{ background: seg.color }}
                      />
                    )
                  )
                )}
              </div>
            </div>
            <div className="preview-caption">
              Bands repeat in your color order. Beads with letters are spaced
              along the bracelet. But you already knew that, right? 😄
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>
          <span>🧵</span> Now you can make me one without hurting your hand
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            lineHeight: 1.4,
            whiteSpace: "pre-line"
          }}
        >
          {instructionsText}
        </p>
      </div>
    </div>
  );
}

export default App;
