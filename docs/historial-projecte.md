# Historial del projecte

Seccions retirades de CLAUDE.md el 2026-11-23 perquè descriuen fases ja passades. Es conserven com a registre de les decisions inicials.

## Prioritat: mockups abans de codi de producció

**LA PRIMERA SESSIÓ DE CLAUDE CODE** en aquest projecte ha de ser **exclusivament de mockups visuals**, no de setup tècnic. L'estètica és tan important que mereix una sessió sencera per validar direcció abans de tocar codi de producció.

Sessions previstes:
1. **Mockups visuals** (5 pàgines clau, 2-3 variants estètiques)
2. **Setup tècnic** (Astro + integracions + i18n + estructura)
3. **Migració dels 8 índexs antics** distribuits a les assignatures
4. **Llibre 1 EDMN 2BACH** (sessions múltiples)
5. **Llibres 2, 3, 4** (sessions múltiples cada un)

## Migració del webpde

El repo `webpde` actual conté el contingut antic. La migració es fa per fases:

### Fase 0 (post-mockups, setup) - Maig 2026
- Setup tècnic
- Estructura completa de les 4 assignatures (placeholders)

### Fase 1 (Juny 2026) - Llibre 1
- Migració de `empresa.html` distribuit dins d'EDMN 2BACH
- Llibre 1 (EDMN 2BACH) complet
- Diapositives derivades del Llibre 1

### Fase 2 (Setembre 2026) - Llibre 2 + llançament
- Migració d'`economia.html`, `ferramentes.html`, `recerca.html` distribuit dins d'Eco 1BACH
- Llibre 2 (Eco 1BACH) complet
- Llançament suau

### Fase 3 (Octubre-Desembre 2026) - Llibre 3
- Migració parcial de `vidapractica.html` per a Eco 4ESO
- Llibre 3 (Eco 4ESO) complet

### Fase 4 (Gener-Febrer 2027) - Llibre 4 + primer joc
- Migració de la resta de `vidapractica.html` per a FOPP 4ESO
- Llibre 4 (FOPP 4ESO) complet
- Primer joc refet: `stonks` a `/juegos/stonks/`

### Fase 5 (Abril-Setembre 2027)
- Resta de jocs refets (insider, communist, econopoly, econrisk)
- Migració de Playground i Concurs
- Eines docents migrades
- Català/valencià activat

### Fase 6 (Setembre 2027+)
- webpde antic deprecat
- Tots els enllaços externs ja redirigits

## Pròxims passos immediats

1. Crear repo nou (`profedeeconomia` o similar) a GitHub
2. **Sessió 1 de Claude Code: MOCKUPS VISUALS** (veure `profedeeconomia-claude-code-mockups-prompt.md`)
3. Validació de la direcció estètica amb Pau
4. Sessió 2: setup tècnic complet
5. Sessions 3+: migració, llibres, etc.
