<!-- Contrato v1 para clipes de luz criados no laboratório ou por outras IAs. -->
# Contrato do efeito (v1)

Ferramenta local. Não publica no catálogo e não escreve no Bling. A simulação é gráfica: não calcula lúmens nem Kelvin físico.

Cole JSON no editor, importe um arquivo ou peça a outra IA para gerar um objeto neste formato.

```json
{
  "contrato": "1",
  "id": "respirar-quente",
  "nome": "Respirar quente",
  "laco": true,
  "duracaoMs": 4200,
  "preset": "quente",
  "padrao": "respirar",
  "brilho": { "minimo": 16, "maximo": 74 },
  "mistura": { "de": "ambar", "para": "quente" },
  "fontes": [
    { "id": "ambiente", "tipo": "ambiente", "padrao": "respirar", "peso": 1, "fase": 0 },
    { "id": "foco", "tipo": "pontual", "padrao": "pulso", "peso": 0.8, "fase": 0.08, "posicao": [0.52, 0.2, 0] },
    { "id": "faixa", "tipo": "linear", "padrao": "varredura", "peso": 0.4, "fase": 0.35, "posicao": [0.5, 0.1, 0] }
  ]
}
```

## Campos

| Campo | Regra |
|---|---|
| `id` | `a-z`, `0-9` e hífen, 2 a 64 caracteres |
| `laco` | `true` ou `false` |
| `duracaoMs` | 200 a 120000 |
| `preset` | `quente`, `neutro`, `frio`, `ambar`, `ciano`, `magenta` |
| `padrao` | `constante`, `suave`, `respirar`, `pulso`, `varredura`, `onda` |
| `brilho` | `minimo` e `maximo` em 0–100, minimo ≤ maximo |
| `mistura` | dois presets; o padrão do clipe interpola a cor |
| `fontes` | ao menos uma; `tipo` é `ambiente`, `linear` ou `pontual` |
| `peso` | 0–1 |
| `fase` | número (desloca a curva) |
| `posicao` | três números; o renderizador CSS usa x e y em 0–1 |

Campos extras são ignorados com aviso. JSON inválido é recusado com mensagem no painel.

## Qualidade e movimento

- `padrao`: interpola em `requestAnimationFrame` só enquanto reproduz.
- `economico`: um quadro estático, sem laço.
- `desligado`: apaga as camadas.
- `prefers-reduced-motion`: vai a um quadro parado.

## O que a IA não deve fazer

- Não referenciar SKU, estoque ou Bling.
- Não inventar presets ou padrões fora desta lista.
- Não pedir loop contínuo com a aba oculta: o laboratório suspende sozinho.
