function escapeCsvValue(value) {
  const normalized = value == null ? '' : String(value);
  const escaped = normalized.replace(/"/g, '""');

  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }

  return escaped;
}

export function buildCsvRow(values = []) {
  return values.map((value) => escapeCsvValue(value)).join(',');
}

export function buildSectionedCsv(sections = []) {
  return sections
    .filter((section) => Array.isArray(section.columns) && Array.isArray(section.rows))
    .flatMap((section, index) => {
      const lines = [
        buildCsvRow([section.title || 'Seccion']),
        buildCsvRow(section.columns.map((column) => column.label)),
        ...section.rows.map((row) => (
          buildCsvRow(section.columns.map((column) => row?.[column.key] ?? ''))
        )),
      ];

      return index === sections.length - 1 ? lines : [...lines, ''];
    })
    .join('\r\n');
}

export function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
