#!/usr/bin/env python3
"""Regenerate src/data/*.json from glossary source files."""

from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    raise SystemExit("Install pypdf: pip install pypdf")

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data"

MIDTERM_SRC = Path.home() / "Downloads/midterm_Sociology_Glossary_B1_English(1).docx"
ENDTERM_SRC = Path.home() / "Downloads/endterm_glossary_B1B2.pdf"


def docx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    paras = []
    for p in root.iter(
        "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"
    ):
        texts = [
            t.text or ""
            for t in p.iter(
                "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"
            )
        ]
        line = "".join(texts).strip()
        if line:
            paras.append(line)
    return "\n".join(paras)


def parse_midterm(text: str) -> list[dict]:
    m = re.search(r"\n(?=\d+\.\s)", text)
    if m:
        text = text[m.start() :].lstrip()
    blocks = re.split(r"\n(?=\d+\.\s)", text)
    terms = []
    for block in blocks:
        block = block.strip()
        if not block or not re.match(r"\d+\.", block):
            continue
        header = block.split("\n", 1)[0]
        hm = re.match(r"(\d+)\.\s+(.+)", header)
        if not hm:
            continue
        num, term = hm.group(1), hm.group(2).strip()
        body = block[len(header) :].strip()
        def_m = re.search(r"Definition:\s*(.*?)(?=\nExample:|\Z)", body, re.S | re.I)
        ex_m = re.search(r"Example:\s*(.*)", body, re.S | re.I)
        terms.append(
            {
                "id": f"midterm-{num}",
                "deck": "midterm",
                "number": int(num),
                "term": term,
                "definition": def_m.group(1).strip() if def_m else body,
                "example": ex_m.group(1).strip() if ex_m else "",
            }
        )
    return terms


def parse_endterm(text: str) -> list[dict]:
    text = re.sub(r"\r\n", "\n", text)
    text = re.sub(r"^Endterm Glossary.*?\n", "", text, flags=re.I)
    text = re.sub(r"^ Sociology Terms.*?\n", "", text, flags=re.I)
    blocks = re.split(r"\n(?=\d+\.\s)", text)
    terms = []
    for block in blocks:
        block = block.strip()
        if not block or not re.match(r"\d+\.", block):
            continue
        header = block.split("\n", 1)[0]
        hm = re.match(r"(\d+)\.\s+(.+)", header)
        if not hm:
            continue
        num, term = hm.group(1), hm.group(2).strip()
        body = block[len(header) :].strip()
        def_m = re.search(r"DEFINITION\s*(.*?)(?=\nEXAMPLE|\Z)", body, re.S | re.I)
        ex_m = re.search(r"EXAMPLE\s*(.*)", body, re.S | re.I)
        terms.append(
            {
                "id": f"endterm-{num}",
                "deck": "endterm",
                "number": int(num),
                "term": term,
                "definition": re.sub(r"\s+", " ", def_m.group(1).strip())
                if def_m
                else "",
                "example": re.sub(r"\s+", " ", ex_m.group(1).strip()) if ex_m else "",
            }
        )
    return terms


def main() -> None:
    mid = parse_midterm(docx_text(MIDTERM_SRC))
    pdf_text = "\n".join(
        (p.extract_text() or "") for p in PdfReader(str(ENDTERM_SRC)).pages
    )
    end = parse_endterm(pdf_text)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "midterm.json").write_text(
        json.dumps(mid, ensure_ascii=False, indent=2) + "\n"
    )
    (OUT / "endterm.json").write_text(
        json.dumps(end, ensure_ascii=False, indent=2) + "\n"
    )
    print(f"Wrote {len(mid)} midterm + {len(end)} endterm terms to {OUT}")


if __name__ == "__main__":
    main()
