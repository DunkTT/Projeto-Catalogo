"""Cria uma cópia portátil do projeto para armazenamento privado no Drive.

Não acessa Bling, não executa testes e não modifica o catálogo ou o banco.
"""

from __future__ import annotations

import hashlib
import json
import sqlite3
import tempfile
import zipfile
from datetime import date, datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
OUTPUT_DIR = ROOT / "exportacoes"
DATABASE = ROOT / "work" / "ferramentas" / "gestao-local" / "dados-locais" / "gestao.sqlite"
DB_ARCNAME = "work/ferramentas/gestao-local/dados-locais/gestao.sqlite"
SKIP_DIRS = {".git", ".codex", ".aws", "exportacoes", "__pycache__", "node_modules"}
SKIP_NAMES = {"auth.json", ".env", ".env.local", ".env.production"}
SQLITE_RUNTIME = {"gestao.sqlite", "gestao.sqlite-wal", "gestao.sqlite-shm"}


def files_to_pack():
    for source in ROOT.rglob("*"):
        if not source.is_file() or source.is_symlink():
            continue
        relative = source.relative_to(ROOT)
        if any(part in SKIP_DIRS for part in relative.parts[:-1]):
            continue
        if source.name in SKIP_NAMES or source.name.startswith(".env"):
            continue
        if relative.as_posix().startswith("work/ferramentas/gestao-local/dados-locais/") and source.name in SQLITE_RUNTIME:
            continue
        yield source, relative.as_posix()


def add_file(archive, source: Path, name: str):
    digest = hashlib.sha256()
    size = 0
    with source.open("rb") as original, archive.open(name, "w") as destination:
        while chunk := original.read(1024 * 1024):
            destination.write(chunk)
            digest.update(chunk)
            size += len(chunk)
    return {"path": name, "bytes": size, "sha256": digest.hexdigest()}


def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    filename = "projeto-catalago-" + date.today().isoformat() + ".zip"
    target = OUTPUT_DIR / filename
    if target.exists():
        raise SystemExit(f"Pacote já existe: {target}. Preserve-o ou renomeie antes de gerar outro.")

    with tempfile.TemporaryDirectory(prefix="backup-catalago-") as temp_dir:
        snapshot = Path(temp_dir) / "gestao.sqlite"
        if DATABASE.exists():
            source = sqlite3.connect(DATABASE.as_uri() + "?mode=ro", uri=True)
            try:
                destination = sqlite3.connect(snapshot)
                try:
                    source.backup(destination)
                finally:
                    destination.close()
            finally:
                source.close()

        manifest = []
        try:
            with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6, allowZip64=True) as archive:
                for source, name in sorted(files_to_pack(), key=lambda item: item[1]):
                    manifest.append(add_file(archive, source, name))
                if snapshot.exists():
                    manifest.append(add_file(archive, snapshot, DB_ARCNAME))
                payload = {
                    "project": "ULTRALED catálogo",
                    "created_at_utc": datetime.now(timezone.utc).isoformat(),
                    "database": "SQLite consistente no momento da cópia" if snapshot.exists() else "não encontrado",
                    "excluded": [".git", "exportacoes", "credenciais e arquivos temporários SQLite WAL/SHM"],
                    "files": manifest,
                }
                archive.writestr("MANIFESTO-BACKUP.json", json.dumps(payload, ensure_ascii=False, indent=2))
        except BaseException:
            target.unlink(missing_ok=True)
            raise

    digest = hashlib.sha256()
    with target.open("rb") as package:
        while chunk := package.read(1024 * 1024):
            digest.update(chunk)
    print(f"Pacote: {target}")
    print(f"Arquivos: {len(manifest)}")
    print(f"Tamanho: {target.stat().st_size} bytes")
    print(f"SHA-256: {digest.hexdigest()}")


if __name__ == "__main__":
    main()
