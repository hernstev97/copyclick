import { useRef, useState, type ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { useData } from '../hooks/useData';
import { MOTION_TRANSITION_DURATION } from '../utils/constants';
import { INTERFACE_CONTENT } from '../utils/content';
import { MAX_IMPORT_BYTES, parseSnippets } from '../utils/data';

function ImportDataButton() {
    const { importItems, language } = useData();
    const fileInput = useRef<HTMLInputElement>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const importData = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        setError(false);
        setLoading(true);
        try {
            if (file.size > MAX_IMPORT_BYTES) throw new Error('File too large');
            const items = parseSnippets(await file.text(), true);
            // Validate the entire file first; a bad row must not partially import data.
            importItems(items);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <input
                hidden
                type="file"
                accept=".json,application/json"
                ref={fileInput}
                onChange={importData}
                aria-label={INTERFACE_CONTENT[language].importData}
            />
            <motion.button
                onClick={() => fileInput.current?.click()}
                className="cc-app--button"
                disabled={loading}
                aria-busy={loading}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: MOTION_TRANSITION_DURATION }}
            >
                {INTERFACE_CONTENT[language].importData}
            </motion.button>
            {error && (
                <p role="alert">{INTERFACE_CONTENT[language].importError}</p>
            )}
        </>
    );
}
export default ImportDataButton;
