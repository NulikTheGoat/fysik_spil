# Fysik Spil - Kastet Bolde

Et interaktivt 2D-spil designet til at hjælpe med at forstå fysik gennem praktisk eksperimenteren.

## Spillets Målgruppe
- Fysik-elever der skal forstå gravitation, kollisioner og kastbevægelser
- Alle der interesserer sig for praktisk fysik

## Kernemekanikker

### 1. Gravitation
- Bolde påvirkes af konstant nedadgående tyngdekraft
- Realistische gravitationsberegninger gør spillet troværdigt

### 2. Bolde
- Røde bolde kan kastes fra startpunktet (nederst til venstre)
- Hver bold har masse, hastighed og elasticitet
- Bolde reflekteres elastisk når de rammer hindringer

### 3. Kastesystem
- **Kastekraft**: Justérbar fra 0-100 (påvirker boldens fart)
- **Vinkel**: Justérbar fra 0-90 grader (påvirker retning)
- Brugeren kan se indflydelsen af disse faktorer på boldens bane

### 4. Hindringsegning
- Tegn hindringslinjer ved at klikke og trække på spilfeltet
- Hindringer påvirker boldens bevægelse ved kollision
- Brugerne kan eksperimentere med forskellige obstakelformer

### 5. Mål
- 4 grønne målpunkter placeret rundt på spilfeltet
- Ramte mål bliver gule
- Tæller viser hvor mange mål der er ramt

## Fysisk Læringsindhold
- **Projektilbevægelse**: Hvordan kraft og vinkel påvirker kastebanen
- **Gravitation**: Konstant påvirkning på alle objekter
- **Kollisioner**: Elastisk refleksion når bolde rammer hindringer
- **Energi**: Energitab gennem friktion og ikke-perfekt elastisk genspringning

## Styring

### Forberedelse
1. Åbn `index.html` i en webbrowser
2. Tegn mindst en hindring ved at klikke og trække på det lysblå canvas-område
3. Dine tegninger vises som sorte linjer

### Kastning
1. Justér "Kastekraft" slider (højere værdi = mere fart)
2. Justér "Vinkel" slider (højere værdi = mere opadrettet)
3. Klik "Kast Bold!" for at kaste bolden
4. Observér boldens bane og hvordan den påvirkes af hindringer

### Reset
- Klik "Reset Spil" for at nulstille og prøve igen

## Spillets Interface

```
┌─────────────────────────────────┐
│     Kastekraft | Vinkel | Knap  │  ← Kontrolpanel
├─────────────────────────────────┤
│                                 │
│        Spilfeltet (Canvas)       │  ← Tegn hindringer her
│     Kast bolde mod målene       │
│                                 │
├─────────────────────────────────┤
│  Tilstand | Bolde | Mål Ramt    │  ← Statistik
└─────────────────────────────────┘
```

## Eksperimentidéer

1. **Konstant vinkel, variabel kraft**: Hvordan påvirker kraft kastdistancen?
2. **Konstant kraft, variabel vinkel**: Hvilken vinkel når længst?
3. **Hindringsdesign**: Hvad sker der med forskellige obstakelformer?
4. **Energi**: Hvordan påvirker friktion boldens bevægelse?
5. **Præcision**: Kan du ramme alle 4 mål med mindst kastninger?