& 'C:\Users\estoque\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -X utf8 'work\catalogo\build_similar.py'
New-Item -ItemType Directory -Force -Path 'work\catalogo\similar\qa' | Out-Null
$word=New-Object -ComObject Word.Application
try {
$word.Visible=$false
$word.DisplayAlerts=0
$word.AutomationSecurity=3
$d=$word.Documents.Open('C:\Users\estoque\Documents\Codex\2026-10-08\erifique-se-o-mcp-do-bling\outputs\catalogo-produtos-ilustrado.docx',$false,$true)
$d.ExportAsFixedFormat('C:\Users\estoque\Documents\ChatGPT\AGENTE BLING\work\catalogo\similar\qa\catalogo.pdf',17)
$d.Close(0)
} finally {$word.Quit()}
& 'C:\Users\estoque\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe' -scale-to 1100 -png 'work\catalogo\similar\qa\catalogo.pdf' 'work\catalogo\similar\qa\page'

