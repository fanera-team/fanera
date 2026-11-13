#!/usr/bin/env bash
# Перегенерирует все SVG-схемы документации из исходников .puml.
# Нужен PlantUML (brew install plantuml — подтянет Graphviz и Java).
# Запуск из корня репозитория: bash docs/system-design/scripts/render.sh
set -euo pipefail

DOCS="$(cd "$(dirname "$0")/.." && pwd)"

command -v plantuml >/dev/null || { echo "plantuml не найден: brew install plantuml" >&2; exit 1; }

# Обзорные, C4 и sequence-диаграммы (простые и подробные): SVG рядом с исходником
plantuml -tsvg -charset UTF-8 "$DOCS"/architecture/*.puml "$DOCS"/database/*.puml "$DOCS"/frontend/*.puml
plantuml -tsvg -charset UTF-8 "$DOCS"/sequences/[0-9]*.puml "$DOCS"/sequences/detailed/[0-9]*.puml

echo "Готово:"
find "$DOCS" -name '*.svg' | sed "s#^$DOCS/#  #" | sort
