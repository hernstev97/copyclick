export type Language = 'en' | 'de';

export const CONTENT = {
    en: {
        languageSwitchIcon: '🇩🇪',
        title: 'copyclick.',
        description: 'Just paste it for later and copy with one click.',
        dataHandling: {
            modalButton: 'Information',
            modalContent: {
                close: 'Close',
            },
        },
    },
    de: {
        languageSwitchIcon: '🇬🇧',
        title: 'copyclick.',
        description:
            'Einfach einen Text einfügen und mit einem Klick kopieren.',
        dataHandling: {
            modalButton: 'Information',
            modalContent: {
                close: 'Schließen',
            },
        },
    },
};

export const INTERFACE_CONTENT = {
    en: {
        exportData: 'EXPORT',
        importData: 'IMPORT',
        clearAll: 'CLEAR ALL',
        edit: 'Edit',
        clear: 'Clear',
        delete: 'Close',
        copied: 'Text copied!',
        theme: 'Change Theme',
        add: 'Add snippet',
        paste: 'Paste text here...',
        copyLabel: 'Copy snippet',
        copyError:
            'Copy failed. Select the text and copy it manually, or check clipboard permissions.',
        reorder: 'Reorder snippet (Arrow Up / Arrow Down)',
        importError:
            'Import failed. Choose valid CopyClick JSON (up to 10 MiB / 1000 snippets). Nothing was imported.',
        recoverData: 'Download stored backup',
        retryStorage: 'Save current snippets instead',
        replaceStoredConfirm:
            'Replace the existing browser data with the snippets currently shown? Download any backup you need first.',
        storageErrors: {
            invalid:
                'The saved data could not be read. The original remains untouched. Changes are only kept for this session; export them before closing.',
            unavailable:
                'Browser storage is unavailable or full. Changes are only kept for this session; export them before closing.',
            conflict:
                'Another tab changed the saved data. Your current edits are only kept in this tab. Export them, then reload to load the other tab’s data.',
        },
    },
    de: {
        exportData: 'EXPORTIEREN',
        importData: 'IMPORTIEREN',
        clearAll: 'ALLE LÖSCHEN',
        edit: 'Bearbeiten',
        clear: 'Leeren',
        delete: 'Schließen',
        copied: 'Text kopiert!',
        theme: 'Theme ändern',
        add: 'Snippet hinzufügen',
        paste: 'Text hier einfügen...',
        copyLabel: 'Snippet kopieren',
        copyError:
            'Kopieren fehlgeschlagen. Text markieren und manuell kopieren oder die Zwischenablage-Berechtigung prüfen.',
        reorder: 'Snippet verschieben (Pfeil hoch / Pfeil runter)',
        importError:
            'Import fehlgeschlagen. Gültige CopyClick-JSON wählen (bis 10 MiB / 1000 Snippets). Es wurde nichts importiert.',
        recoverData: 'Gespeicherte Sicherung herunterladen',
        retryStorage: 'Stattdessen aktuelle Snippets speichern',
        replaceStoredConfirm:
            'Vorhandene Browserdaten durch die aktuell angezeigten Snippets ersetzen? Benötigte Sicherungen vorher herunterladen.',
        storageErrors: {
            invalid:
                'Die gespeicherten Daten konnten nicht gelesen werden und bleiben unverändert. Änderungen gelten nur für diese Sitzung; vor dem Schließen exportieren.',
            unavailable:
                'Der Browserspeicher ist nicht verfügbar oder voll. Änderungen gelten nur für diese Sitzung; vor dem Schließen exportieren.',
            conflict:
                'Ein anderer Tab hat die gespeicherten Daten geändert. Deine aktuellen Änderungen gelten nur in diesem Tab. Exportiere sie und lade dann neu, um die Daten des anderen Tabs zu laden.',
        },
    },
};
