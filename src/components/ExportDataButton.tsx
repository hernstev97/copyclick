import { downloadJson, serializeSnippets } from '../utils/data';
import { motion } from 'motion/react';
import { useData } from '../hooks/useData';
import { MOTION_TRANSITION_DURATION } from '../utils/constants';
import { INTERFACE_CONTENT } from '../utils/content';

function ExportDataButton() {
    const { items, language } = useData();

    const exportData = () => {
        downloadJson(serializeSnippets(items), 'copyclick.json');
    };

    return (
        <motion.button
            onClick={exportData}
            className="cc-app--button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: MOTION_TRANSITION_DURATION }}
        >
            {INTERFACE_CONTENT[language].exportData}
        </motion.button>
    );
}

export default ExportDataButton;
