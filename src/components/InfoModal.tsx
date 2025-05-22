import { useState } from 'react';

function InfoModal() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <div>
            <button className="cc-button cc-modal-button" onClick={handleOpen}>
                Information
            </button>

            {isOpen && (
                <div className="cc-modal--overlay" onClick={handleClose}>
                    <div
                        className="cc-modal--content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Über CopyClick & Datenhandhabung</h2>
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
                        <h3>Version</h3>
                        <p>{import.meta.env.VITE_APP_VERSION}</p>
                        <h3>Build Date</h3>
                        <p>{import.meta.env.VITE_BUILD_DATE}</p>
                        <button className="cc-button" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InfoModal;

// About CopyClick & Data Handling

// What is CopyClick? CopyClick is a browser-based utility designed to help you efficiently save, manage, and quickly copy frequently used text snippets. It allows users to create, edit, and organize pieces of text for easy retrieval and use, directly within their web browser.

// How Your Data is Handled: We prioritize straightforward and secure data management. Please review the following key points regarding how CopyClick handles your information:

// Local Storage Only: All text snippets and any associated details (like item names or edit states) that you create and save within the CopyClick application are stored exclusively in your web browser's local storage (localStorage).
// No Server Interaction for Data Storage: Your data, including the content of your text snippets, is not transmitted to, stored on, or processed by any external servers or cloud services. All data operations for storing and managing your snippets occur locally on your computer, within your browser.
// Data Content: The application stores the text you input for your snippets, an internal identifier for each item, and its current status (e.g., whether it's in an editable state).
// Browser-Specific and User-Controlled: The data saved is specific to the web browser and user profile you are using on your computer. This means snippets saved in one browser (e.g., Chrome) will not be accessible in another (e.g., Firefox) or on different devices. You have control over this data; clearing your browser's site data for this application will permanently delete all your stored CopyClick snippets.
// Information for the Tech Department: CopyClick operates as a purely client-side application. Data persistence for user-created text snippets is achieved using the standard Web Storage API, specifically localStorage. There is no backend server component, database, or server-side processing involved for the core functionality of storing, retrieving, or managing these snippets.
