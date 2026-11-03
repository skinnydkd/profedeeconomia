---
asignatura: eco-4eso
material: ud01-02-concurs
title: "El gran concurs UD1–UD2 · guia docent"
tipo: guia
lang: ca
estado: publicado
slug: "asignaturas/eco-4eso/situaciones/guias/ud01-02-concurs-guia.ca"
---

**No ho compartisques amb l'alumnat.** Acompanya `ud01-02-concurs.html`.
Economia i Emprenedoria · 4t d'ESO.

Mateix motor que el concurs de 1r de Batxillerat; canvien el color de la matèria, les gràfiques i
**totes** les preguntes.

## Com es fa servir

Fitxer HTML autònom per a **projectar**. Doble clic i el navegador a pantalla completa (**F11**).
No necessita internet.

1. **Marca els tipus de prova** que vols jugar. El comptador de baix diu quantes preguntes són i
   quants minuts dura. Venen tres marcades per defecte (**uns 30 minuts**).
2. Tria **quants equips** (de 2 a 6) i polsa **Comença**.
3. Llig la pregunta en veu alta. Els equips la contesten **al paper**, no la criden.
4. **Espai** revela la resposta i el «per què».
5. Dona el punt amb la tecla **1-6** de l'equip, o amb el botó **+**. El **−** el lleva.

| Tecla | Fa |
|---|---|
| `espai` o `→` | Revela la resposta; si ja està revelada, passa a la següent |
| `←` | Torna a la pregunta anterior |
| `1` – `6` | Suma un encert a eixe equip |

## Els vuit tipus de prova

**42 preguntes en total.** Tria les que et caben a la sessió.

| Prova | Preg. | Val | Min. | Què mesura |
|---|---|---|---|---|
| 1 · Relleu | 8 | 1 | 6 | Definicions de memòria: béns, factors, agents, FPP, especialització |
| 2 · Troba l'intrús | 5 | 1 | 8 | Classificar, i saber **per quin criteri** |
| 3 · Ordena-ho | 4 | 2 | 8 | Processos: trams de la FPP, l'ajust del preu, el flux circular |
| 4 · Aposta | 5 | 1-3 | 15 | Casos aplicats. Aposten abans de veure la pregunta |
| 5 · Tres pistes | 5 | 5/3/1 | 13 | Reconéixer el concepte com més prompte millor |
| 6 · El dibuix | 4 | 3 | 16 | **FPP i mercat**: dibuixen tots els equips alhora |
| 7 · Judici a la resposta | 6 | 3 | 18 | Trobar l'error en una resposta mal feta |
| 8 · Subhasta a la baixa | 5 | 10↓ | 10 | Preguntes grans. Val 10 i baixa 1 cada 10 segons |

**Tria per defecte: relleu + el dibuix + la subhasta**, uns 32 minuts. Cobrix el que més pesa a la
prova escrita: record ràpid, la frontera dibuixada i les preguntes de desenvolupar.

Si tens poc de temps, **relleu + intrús** són 14 minuts i ja remouen mitja unitat.

**Cap pregunta del concurs ix al control ni al simulacre.** Els temes sí; els ítems, no.

## Les trampes que hi ha plantades

Són les que decidixen aprovats. Convé no passar de llarg quan hi caiguen.

| Prova | On | El parany |
|---|---|---|
| 2 | Terra · treball · capital · **benefici** | El benefici no és un factor: és la **renda** de qui arrisca |
| 2 | El forn del forner / el pa que sopes | Mateix tipus d'objecte, dues categories. **El criteri és l'ús** |
| 4 | Les 5 hores de dissabte | Només **la millor** alternativa, mai la suma de totes |
| 4 | La farina del forn / la del rebost | El mateix: intermedi o de consum segons qui l'use |
| 7 | «El cost d'oportunitat són 120 €» | Va en **unitats de l'altre bé**. És l'error que més es repetix |
| 7 | «Ara fa més samarretes: ha crescut» | Moure's per la frontera **no és créixer** |
| 7 | «L'oferta és el pa del taulell» | L'oferta és una **llista**, preu a preu; no és l'estoc |
| 7 | «Un punt de dins és inassolible» | És **ineficient**. Dins s'hi està quan sobren recursos sense usar |

## Les sessions abans de la prova

| Sessió | Què | Material |
|---|---|---|
| **1** | Repàs guiat de la unitat 2 amb el dossier: apunts, annex i els exercicis de dibuixar | `apunts-mercat.pdf` |
| **2** | **El concurs**, 30 min. Els últims 15, repassar el que ha fallat mitja classe | `ud01-02-concurs.html` |
| **3** | Correcció del simulacre, fet a classe, cronometrat, en la sessió anterior | — |

El **simulacre** es fa a classe, cronometrat, en la sessió anterior a la correcció, i el solucionari es reté fins a eixa correcció.

## El repartiment d'equips

A 4t l'equip que sempre perd desconnecta a la tercera pregunta. Dues coses que ho eviten:

- **Equips barrejats, no els de sempre.** Val la pena fer-los tu amb la llista a la mà.
- **La subhasta i l'aposta reparteixen sort**: un equip que va darrere pot arriscar 3 punts o
  reclamar la subhasta prompte i capgirar-ho. Deixa'n alguna per al final.

## Si vols canviar preguntes

Totes estan a l'array `RONDES` del `<script>`, al final del fitxer. Cada prova té el seu format
(`q`/`items`/`pistes`/`mal`/`fig`), però dins d'una prova totes les preguntes són iguals: copia'n
una i canvia-li el text. El comptador de minuts i la barra es recalculen sols.