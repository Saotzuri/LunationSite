# Lunation Guild Roster

Ein Roster-Management-Tool für WoW-Gilden mit Drag-and-Drop, Wunsch-Roster und Rekrutierungs-Tracking.

## Features

- **Roster-Verwaltung**: Spieler mit Name, Spec, Role und Notes verwalten
- **Drag-and-Drop**: Spieler per Drag & Drop in Gruppen verschieben
- **Wunsch-Roster**: Offene Stellen als Wunsch-Specs eintragen
- **Rekrutierte Spieler**: Tracking wer rekrutiert wurde
- **Officer-Login**: Geschützter Bereich für Officers zum Bearbeiten
- **Utility-Übersicht**: Buffs und Utility der Raid-Composition anzeigen

## Tech Stack

- React 19 + Vite
- Express Backend mit PostgreSQL
- @dnd-kit für Drag & Drop
- React Router für Navigation

## Setup

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production build
npm run build

# Server starten (nach build)
npm start
```

## Umgebungsvariablen

```env
VITE_OFFICER_PASSWORD=dein_passwort
DATABASE_URL=postgresql://...
```

## Struktur

```
src/
  components/     # Wiederverwendbare UI-Komponenten
  pages/          # Seiten-Komponenten
  utils/          # Helper-Funktionen (auth, classColors)
  App.jsx         # Hauptkomponente
  index.css       # Styles
server.js         # Express Backend
```

## Deployment

Das Backend erwartet eine PostgreSQL-Datenbank und stellt die API unter `/api/data` bereit. Die statischen Dateien werden aus dem `dist/`-Ordner serviert.