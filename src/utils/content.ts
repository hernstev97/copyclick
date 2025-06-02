export type Language = 'en' | 'de';

export const CONTENT = {
    "en": {
        "languageSwitchIcon": "🇩🇪",
        "title": "copyclick.",
        "description": "Just paste it for later and copy with one click.",
        "dataHandling": {
            "modalButton": "Information",
            "modalContent": {
                "close": "Close",
                "html": `<h2>About CopyClick & Data Handling</h2>
                        <h3>What is CopyClick?</h3>
                        <p>
                            CopyClick is a browser-based utility designed to help you efficiently save, manage, and quickly copy frequently used text snippets. It allows users to create, edit, and organize pieces of text for easy retrieval and use, directly within their web browser.
                        </p>
                        <h3>How Your Data is Handled:</h3>
                        <p>
                            We prioritize straightforward and secure data management. Please review the following key points regarding how CopyClick handles your information:
                        </p>
                        <ul>
                            <li>
                                <b>Local Storage Only: </b>All text snippets and any associated details (like item names or edit states) that you create and save within the CopyClick application are stored exclusively in your web browser's local storage (localStorage).
                            </li>
                            <li>
                                <b>No Server Interaction for Data Storage: </b>Your data, including the content of your text snippets, is not transmitted to, stored on, or processed by any external servers or cloud services. All data operations for storing and managing your snippets occur locally on your computer, within your browser.
                            </li>
                            <li>
                                <b>Data Content: </b>The application stores the text you input for your snippets, an internal identifier for each item, and its current status (e.g., whether it's in an editable state).
                            </li>
                            <li>
                                <b>Browser-Specific and User-Controlled: </b>
                                The data saved is specific to the web browser and user profile you are using on your computer. This means snippets saved in one browser (e.g., Chrome) will not be accessible in another (e.g., Firefox) or on different devices. You have control over this data; clearing your browser's site data for this application will permanently delete all your stored CopyClick snippets.
                            </li>
                        </ul>
                        <p>Contact: <a href="mailto:contact@hellofrom.sh">contact@hellofrom.sh</a></p>`,
            }
        }
    },
    "de": {
        "languageSwitchIcon": "🇬🇧",
        "title": "copyclick.",
        "description": "Einfach einen Text einfügen und mit einem Klick kopieren.",
        "dataHandling": {
            "modalButton": "Information",
            "modalContent": {
                "close": "Schließen",
                "html": `<h2>Über CopyClick & Datenhandhabung</h2>
                        <h3>Was ist CopyClick?</h3>
                        <p>
                            CopyClick ist eine kleine WebApp, die dabei hilft,
                            Textsnippets, die man oft braucht, einfach zu
                            zwischenzuspeichern, zu bearbeiten und schnell zu
                            kopieren. Je nach Workflow kann dies den
                            Arbeitsablauf erheblich verbessern.
                        </p>
                        <h3>Wie Daten gehandhabt werden</h3>
                        <p>
                            Die Datenhandhabung ist einfach und sicher gehalten.
                            Hier die wichtigsten Punkte dazu:
                        </p>
                        <ul>
                            <li>
                                <b>Ausschließlich lokale Speicherung: </b>Alle
                                Daten (wie Textinhalt, Bearbeitungsstatus oder
                                Präferenz zum Dark-/Lightmodus), die mit
                                CopyClick erstellt und gespeichert werden,
                                landen ausschließlich im lokalen Speicher des
                                Webbrowsers (genannt localStorage).
                            </li>
                            <li>
                                <b>Keine Datenübertragung an Server: </b>Die
                                gespeicherten Daten werden nicht an Server
                                übermittelt. Jegliche Verarbeitung findet lokal
                                statt.
                            </li>
                            <li>
                                <b>Was wird gespeichert?: </b>Gespeichert wird
                                der Text selbst, eine ID für jedes Element und
                                der aktuelle Zustand (z.B. ob er gerade
                                bearbeitet werden kann). Außerdem wird die
                                Präferenz für den Dark-/Lightmodus gespeichert.
                            </li>
                            <li>
                                <b>Browserabhängig und nutzerkontrolliert: </b>
                                Die gespeicherten Texte sind an den jeweiligen
                                Browser auf dem Computer gebunden. Das heißt,
                                Texte, die z.B. in Chrome gespeichert wurden,
                                sind nicht in Firefox oder auf anderen Geräten
                                verfügbar. Die Kontrolle über diese Daten liegt
                                beim Nutzer. Werden die Browserdaten für diese
                                Seite gelöscht, sind auch alle mit CopyClick
                                gespeicherten Texte dauerhaft entfernt.
                            </li>
                        </ul>
                        <p>Kontakt: <a href="mailto:contact@hellofrom.sh">contact@hellofrom.sh</a></p>
                        `,
            }
        }
    }
}

export const INTERFACE_CONTENT = {
    "en": {
        "exportData": "EXPORT",
        "importData": "IMPORT",
        "clearAll": "CLEAR ALL",
        "edit": "Edit",
        "clear": "Clear",
        "delete": "Close",
        "copied": "Text copied!",
        "theme": "Change Theme",
    },
    "de": {
        "exportData": "EXPORTIEREN",
        "importData": "IMPORTIEREN",
        "clearAll": "ALLE LÖSCHEN",
        "edit": "Bearbeiten",
        "clear": "Leeren",
        "delete": "Schließen",
        "copied": "Text kopiert!",
        "theme": "Theme ändern",
    }
}