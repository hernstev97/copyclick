# CopyClick – Wartungs- und Sicherheitsprüfung vom 06.09.2026

## Ergebnis und Umfang

Lokale Auffrischung auf Basis von `6cae37e0a60816544edfee21b9c1c2b03c57ab6f` aus `https://github.com/hernstev97/copyclick`. Arbeitsbranch: `maintenance/refresh-2026-09-06`. Kein Push, Pull Request, Deployment oder Merge durchgeführt. Das vorhandene Produkt und dessen Gestaltung wurden beibehalten.

Der ursprüngliche Build scheiterte an einer ungenutzten Versionsvariablen und fehlenden Node-Typen. ESLint meldete fünf Fehler und drei Warnungen. Es gab keine Tests. `npm audit` meldete 15 betroffene Pakete: zehn high, vier moderate und eines low. Die Zahl zählt betroffene Pakete im Dependency-Baum, nicht nachgewiesene Angriffe auf die laufende Anwendung.

Der aktualisierte Dependency-Baum hat zum Prüfzeitpunkt **0 bekannte npm-Audit-Funde**, sowohl insgesamt als auch mit `--omit=dev`. Das ist keine Garantie gegen unbekannte Schwachstellen oder spätere Advisories.

## Aktualisierungen

| Bereich                           | Installierter Ausgangsstand | Neuer Stand                |
| --------------------------------- | --------------------------- | -------------------------- |
| React / React DOM                 | 19.1.0                      | 19.2.8                     |
| Vite                              | 6.3.5                       | 8.2.2                      |
| React-Vite-Plugin                 | react-swc 3.9.0             | plugin-react 6.1.1 mit Oxc |
| Motion                            | 12.12.2                     | 13.2.0                     |
| TypeScript                        | 5.8.3                       | 6.0.3                      |
| ESLint                            | 9.27.0                      | 10.10.0                    |
| TypeScript-ESLint                 | 8.32.1                      | 8.69.0                     |
| Sass                              | 1.89.0                      | 1.104.0                    |
| Vercel Analytics / Speed Insights | 1.5.0 / 1.2.0               | 2.0.1 / 2.0.0              |

Weitere Typ-, Lint- und Formatierungsabhängigkeiten wurden aktualisiert. Neu hinzugekommen sind Vitest 5, Playwright 1.63 und axe 4.13 für reproduzierbare Prüfungen. Alle beibehaltenen direkten Pakete liegen auf den bei npm abgefragten stabilen neuesten Versionen, mit zwei begründeten Ausnahmen:

- TypeScript 6.0.3 statt 7.0.2: `typescript-eslint@8.69.0` deklariert `>=4.8.4 <6.1.0`. Kein erzwungener Peer-Dependency-Bypass.
- `@types/node` 24.13.3 statt 26.4.1: passend zum gewählten Node-24-LTS-Laufzeitzweig. Lokal geprüft mit Node 24.20.0 / npm 11.19.0.

DOMPurify und dessen separate Typen entfallen: Snippets sind Klartext, und der Informationstext wird jetzt als statisches JSX gerendert. UUID entfällt zugunsten von `crypto.randomUUID()` auf HTTPS/localhost. Der Lockfile wurde vollständig erneuert; npm bleibt Paketmanager. Die deklarierte Anwendungsversion 1.1.0 wird konsistent aus `package.json` gelesen. Sass-`@import` wurde auf `@use` umgestellt, ohne CSS-Werte oder die Reihenfolge der Gestaltung zu verändern.

Die neue lokale CI-Datei verwendet fest gepinnte Commit-SHAs von `actions/checkout` 7.0.1 und `actions/setup-node` 7.0.0 sowie minimale Leseberechtigungen. GitHub Actions selbst wurde nicht ausgeführt, da nichts gepusht wurde.

## Belegte Probleme und Reparaturen

| Befund                                                                                               | Änderung und Prüfung                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTML-Bereinigung veränderte Klartext/Code beim Speichern und Laden                                   | Keine HTML-Interpretation von Nutzerdaten; React-Textausgabe und Textarea-Werte. Script-/HTML-Testtexte bleiben beim Einfügen, Kopieren, Speichern und Exportieren erhalten und werden nicht ausgeführt.                                             |
| Import nutzte ungeprüftes JSON und fügte Zeilen einzeln ein                                          | Gesamte Datei vorab prüfen: Format, Version, Feldtypen, eindeutige IDs, höchstens 10 MiB/1000 Einträge. Fehler führen zu keiner Teilübernahme. Alte Array-Exporte und versionierte Daten funktionieren. Fremde Zusatzfelder werden nicht übernommen. |
| Versionsabweichungen löschten Daten; kaputtes JSON wurde anschließend mit leerer Liste überschrieben | Keine Schreiboperation beim Start. Ursprünglicher Speicherinhalt bleibt bei Fehlern unverändert und herunterladbar; ausdrückliches Ersetzen erfordert eine Bestätigung. Gültige alte Arrays werden beim nächsten Bearbeiten migriert.                |
| Blockierter/voller localStorage konnte die App unterbrechen                                          | Abgefangene Speicherfehler, sichtbarer Hinweis, weiter nutzbare Sitzungsdaten und Export. Präferenzen funktionieren in der Sitzung weiter.                                                                                                           |
| Ein bereits geänderter Stand eines zweiten Tabs wurde still überschrieben                            | Vor dem Schreiben Vergleich mit dem zuletzt gelesenen/geschriebenen Rohstand. Konflikt sperrt automatisches Überschreiben; Export, Neuladen oder bewusstes Ersetzen bleiben möglich.                                                                 |
| Ungültige Sprache im Speicher konnte die Oberfläche abstürzen lassen                                 | Initialisierung auf validiertes `en`/`de`, Dokumentensprache wird synchronisiert.                                                                                                                                                                    |
| Expliziter heller Modus wurde beim ersten Rendern von dunkler Systempräferenz überstimmt             | Frühes externes Theme-Script und React verwenden dieselbe Priorität; Speicherzugriffe sind abgesichert.                                                                                                                                              |
| Kopieren nur per Maus; nicht verständliche Fehler und verwaiste Timer                                | Enter/Space, lokalisierter Fehlerhinweis, Statusansage und Timer-Aufräumen. Echte Clipboard-Tests unter Chromium und Fehlerpfad unter allen getesteten Browsern.                                                                                     |
| Paste-Timer konnte mit überholten Daten arbeiten                                                     | Synchrone Verarbeitung des Klartext-Paste-Events und der aktuellen Auswahl. Nichttext-Paste löscht keine Auswahl.                                                                                                                                    |
| Drag-Handle war nicht per Tastatur bedienbar und unter Touch von Scrollgesten abhängig               | Arrow Up/Down am vorhandenen Handle, `touch-action: none` nur am Handle; Maus- und emulierte Touch-Sortierung geprüft.                                                                                                                               |
| Fehlende Namen/Fokusführung                                                                          | Zugängliche Namen für Snippets/Schaltflächen, semantische Überschriftenebene ohne optische Änderung, Escape/Fokusfalle/Fokusrückgabe im bestehenden Informationsmodal.                                                                               |
| Fehlender Favicon-Pfad und widersprüchliche Versionen                                                | Korrekte Public-Asset-URL, einheitliche Versionsquelle, entfernte Platzhalter-URLs und überflüssige Semikolon-Ausgabe.                                                                                                                               |
| Unklare Telemetriegrenze                                                                             | Vercel-Telemetrie nur bei explizitem Build-Flag; standardmäßig aus, im Entwicklungsmodus ebenfalls aus. Hinweise benennen Google Fonts, optionale Telemetrie und unverschlüsselten Browserspeicher.                                                  |
| Keine expliziten Sicherheits-Header                                                                  | CSP ohne Inline-Scripts/eval, Framing-/MIME-Schutz, Referrer- und Permissions-Policy in `vercel.json`; gegen den lokalen Produktionsbuild angewendet und im Browser geprüft.                                                                         |

Die Ausgangsfunde betrafen unter anderem DOMPurify, UUID, Vite, Rollup, PostCSS und mehrere transitive Entwicklungswerkzeuge. Ihre konkrete Ausnutzbarkeit hing von API-Nutzung und Bereitstellung ab. Ein erfolgreicher Angriff auf die gehostete Anwendung wurde weder behauptet noch versucht. Eine Quellcode-Suche nach üblichen privaten Schlüssel-/Tokenformaten lieferte keine Treffer; das ist kein vollständiger historischer Secret-Scan.

## Prüfungen und visuelle Erhaltung

- 22 Unit-Tests: Schema, Klartext-Roundtrip, Importgrenzen, ungültige/alte Daten, Speicherfehler und Konflikte.
- Abschließender Browserlauf: **41 bestanden, 1 gezielt ausgelassen**. Browser-Prüfmatrix: Desktop-Chromium, Pixel-7-Emulation in Chromium und Desktop-Firefox. Geprüft werden Erstellen/Bearbeiten/Löschen, Reload-Persistenz, Maus/Touch/Tastatursortierung, reale Clipboard-Operationen in Chromium, Kopierfehler, Export/Import, defekte/zu große Importe, defekter/blockierter Speicher, Konflikte, Sprache/Theme, Modalfokus und CSP.
- Eine Firefox-Clipboard-Prüfung wird ausdrücklich ausgelassen, weil der Chromium-Berechtigungsweg dort nicht verfügbar ist. Firefox prüft die übrigen Abläufe einschließlich simuliertem Paste-Payload und verweigertem Clipboard-Zugriff.
- Produktionsbuild, TypeScript, strenges ESLint, Formatierungsprüfung und Dependency-Baum geprüft. Der Testserver wendet die vorgesehenen Header auf `dist/` an.
- Vorher/Nachher-Vergleich des Originalcommits und der aktualisierten App bei **1280×900 und 390×844**, jeweils hell/dunkel, mit identischen zwei Beispielsnippets und geladenem Google-Font: Bounding-Boxes, Farben, Hintergründe, Schriften, Rahmen und Padding stimmen überein. Die Screenshots des App-Bereichs sind in diesen vier Fällen pixelgleich. Nur die dynamische Versions-/Datumsanzeige wurde zur Vergleichbarkeit auf denselben Platzhalter gesetzt.
- Die Farbwerte, Layoutmaße, Schriftfamilie und sichtbaren Steuerelemente der normalen Ansicht wurden nicht neu gestaltet. Die einzigen neuen sichtbaren Elemente erscheinen bei Speicher-/Importfehlern; die Informationstexte wurden sachlich ergänzt.

## Verbleibende Grenzen

1. Kein Deployment und keine Prüfung des tatsächlich gehosteten Servers. Andere Hosts müssen die Header aus `vercel.json` selbst übernehmen. Eingeschaltete echte Vercel-Telemetrie wurde nicht gegen ein Vercel-Konto geprüft.
2. Kein reales Smartphone, kein Safari/WebKit und keine Screenreader-Sitzung. Chromium-Mobil ist eine Emulation. Automatische Accessibility-Prüfungen ersetzen keine vollständige Prüfung; Kontrast über Textarea-/Gradientenhintergründen bleibt teilweise manuell zu beurteilen. Die bestehende Gestaltung, kleine Bedienelemente, der fixe Footer und die bestehende Modalgröße wurden nicht umgestaltet.
3. localStorage ist unverschlüsselt und ohne atomare Compare-and-swap-Transaktionen. Die Konflikterkennung ist keine Garantie für gleichzeitig schreibende Tabs. Große Datenmengen bleiben durch Browserquote/Arbeitsspeicher begrenzt; Importlimits gelten auch für sehr große selbst erstellte Backups.
4. Bereits von der alten HTML-Bereinigung entfernte Inhalte sind ohne ältere Sicherung nicht wiederherstellbar. Unbekannte Datenversionen werden geschützt, nicht geraten oder automatisch konvertiert.
5. Clipboard und native UUID-Erzeugung setzen HTTPS/localhost voraus. Browserrechte, Erweiterungen, Betriebssystem und Zwischenablage bleiben externe Abhängigkeiten.
6. Google Fonts wird zur unveränderten Typografie weiterhin extern geladen. Die CSP erlaubt notwendige Inline-Styles für Motion und Textarea-Höhen, aber keine Inline-Scripts. Eine kompromittierte Same-Origin-Ressource oder Erweiterung bleibt eine Vertrauensgrenze.
7. Keine absolute Sicherheitsgarantie und kein vollständiger Penetrationstest. npm-Audit ist eine zeitgebundene Datenbankprüfung.

## Herangezogene Primärquellen

Aktuelle installierte Versionen und Peer-Ranges wurden direkt über npm abgefragt; der Lockfile enthält die aufgelösten Versionen und Integritätswerte.

- [Vite: Migration von v6](https://v7.vite.dev/guide/migration) und [Migration auf Vite 8](https://vite.dev/guide/migration)
- [Motion: React Upgrade Guide](https://motion.dev/docs/react-upgrade-guide)
- [ESLint: Migration auf v10](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [TypeScript-ESLint: unterstützte Versionen](https://typescript-eslint.io/users/dependency-versions/)
- [Vercel: Projektkonfiguration und Header](https://vercel.com/docs/project-configuration#headers)
- [MDN: crypto.randomUUID und Secure Context](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- [GitHub Actions Checkout Releases](https://github.com/actions/checkout/releases) und [Setup Node Releases](https://github.com/actions/setup-node/releases)
