
// MS2/Extra Tune Generator – XML exporter **with VE / AFR / Spark mapping**
// =========================================================================
// This augments the previously‑shared MSQXmlExporter so it can take normal
// JavaScript arrays for VE1, AFR1 and Spark Advance tables and place them
// into the correct byte positions for MS2/Extra 3.4.x (fileFormat 5.0).
//
// ────────── DISCLAIMER ──────────
// Offsets below are valid for the *standard* MS2/Extra 3.4.x INI (20230101).
// If you run a custom or future firmware, verify the byte map in
// ms2Extra.ini → [PageX] → variables = …
//
// Page layout used (16 × 2048‑byte pages):
//   • Page 3  (index 3) : VE table 1 (16×16 at offset 0x0000, uint8)
//   • Page 9  (index 9) : AFR target table 1 (16×16 at offset 0x0000, uint8,
//                         value = AFR × 10; e.g. 14.7 → 147)
//   • Page 11 (index 11): Spark advance table 1 (16×16 at offset 0x0000, uint8,
//                         value = deg BTDC)
// =========================================================================

class MSQXmlExporter {
  static generate(tuneData, opts = {}) {
    const exp = new MSQXmlExporter(tuneData, opts);
    return exp.buildXml();
  }

  constructor(tuneData = {}, opts = {}) {
    this.tune  = tuneData || {};
    this.signature = this.tune.signature || opts.signature || 'MS2Extra comms342hP';
    this.revision  = opts.revision || '20240609';
    this.fileFormat = '5.0';
    this.author   = opts.author || 'MS2/Extra Tune Generator';
    this.comment  = opts.comment || 'Generated Baseline Tune';
    // If caller hands us raw page buffers, use them; otherwise compose:
    this.pages   = Array.isArray(this.tune.pages) && this.tune.pages.length
                   ? this.tune.pages
                   : this._composePages(this.tune);
  }

  // -----------------------------------------------------------------------
  // Compose page buffers from provided high‑level tables
  // -----------------------------------------------------------------------
  _composePages(tune) {
    // Start with 16 zero‑filled pages
    const pages = Array.from({length: 16}, () => new Uint8Array(2048));

    // --- helper to write 16×16 tables ---
    const writeTable16x16 = (array2D, pageIdx, offset, scale = 1) => {
      if (!Array.isArray(array2D) || array2D.length !== 16) return;
      const buf = pages[pageIdx];
      let ptr = offset;
      for (let r = 0; r < 16; r++) {
        if (!Array.isArray(array2D[r]) || array2D[r].length !== 16) return;
        for (let c = 0; c < 16; c++) {
          let val = Math.round(array2D[r][c] * scale);
          val = Math.max(0, Math.min(255, val));
          buf[ptr++] = val;
        }
      }
    };

    // VE1 – no scaling, stored 0‑255
    if (tune.veTable1) {
      writeTable16x16(tune.veTable1, 3, 0x0000, 1);
    }

    // AFR target 1 – multiply by 10 (14.7 -> 147)
    if (tune.afrTable1) {
      writeTable16x16(tune.afrTable1, 9, 0x0000, 10);
    }

    // Spark advance 1 – degrees BTDC as uint8
    if (tune.sparkTable1) {
      writeTable16x16(tune.sparkTable1, 11, 0x0000, 1);
    }

    return pages;
  }

  // -----------------------------------------------------------------------
  // XML construction
  // -----------------------------------------------------------------------
  buildXml() {
    let xml = this._headerBlock();
    xml += this._pagesBlock();
    xml += '</msq>\n';
    return xml;
  }

  _headerBlock() {
    const dateUTC = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    return \`<?xml version="1.0" encoding="UTF-8"?>
<msq xmlns="http://www.msefi.com/">
<bibliography author="\${this.author}" tuneComment="\${this.comment}" writeDate="\${dateUTC}"/>
<versionInfo signature="\${this.signature}" revision="\${this.revision}" fileFormat="\${this.fileFormat}">\n\`;
  }

  _pagesBlock() {
    let xml = '';
    this.pages.forEach((buf, idx) => {
      if (!(buf instanceof Uint8Array) || buf.length !== 2048) {
        console.warn('[MSQXmlExporter] Page', idx + 1, 'is invalid – replaced with zeros');
        buf = new Uint8Array(2048);
      }
      xml += \`<page number="\${idx + 1}" size="2048">
  <data>\${this._base64(buf)}</data>
</page>\n\`;
    });
    return xml;
  }

  _base64(uint8arr) {
    let binary = '';
    for (let i = 0; i < uint8arr.length; i++) binary += String.fromCharCode(uint8arr[i]);
    return btoa(binary);
  }
}

// Expose
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MSQXmlExporter;
} else {
  window.MSQXmlExporter = MSQXmlExporter;
}

// ---------------------------------------------------------------------------
// EXAMPLE (remove in production):
// ---------------------------------------------------------------------------
// // 1) Build dummy flat VE table 60 everywhere:
// const ve = Array.from({length:16}, () => Array(16).fill(60));
// // 2) AFR 14.7 everywhere:
// const afr = Array.from({length:16}, () => Array(16).fill(14.7));
// // 3) Spark 28° everywhere:
// const spark = Array.from({length:16}, () => Array(16).fill(28));
// const xmlStr = MSQXmlExporter.generate({ veTable1: ve, afrTable1: afr, sparkTable1: spark });
// console.log(xmlStr.slice(0, 400) + '…');
// ---------------------------------------------------------------------------
