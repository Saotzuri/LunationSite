# Deployment auf Railway

## Voraussetzungen
- [Railway Account](https://railway.app)
- GitHub Repository mit diesem Code

## Schritte

### 1. Auf Railway verbinden
1. Gehe zu [railway.app](https://railway.app)
2. Klicke "New Project"
3. Wähle "Deploy from GitHub repo"
4. Wähle dieses Repository aus

### 2. Umgebungsvariable setzen
1. Im Railway Dashboard: Variables tab
2. Füge neue Variable hinzu:
   - Key: `VITE_OFFICER_PASSWORD`
   - Value: Dein gewünschtes Passwort

### 3. Deploy
- Railway erkennt自动 Vite und deployt die App
- Nach dem Deployment erhältst du eine URL

## Lokal entwickeln

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build
npm run build
```

## Passwort ändern
Das Passwort wird in Railway unter Variables gesetzt als `VITE_OFFICER_PASSWORD`.
Standard-Passwort (falls nicht gesetzt): `lunation2024`