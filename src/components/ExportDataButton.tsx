import { motion } from 'motion/react';
import { useData } from '../contexts/UserData';
import { MOTION_TRANSITION_DURATION } from '../utils/constants';
import { INTERFACE_CONTENT } from '../utils/content';

function ExportDataButton() {
    const { items, language } = useData();

    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
          JSON.stringify(items)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "data.json";
    
        link.click();
    };

    return (
        <motion.button
            onClick={exportData}
            className="cc-app--button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: MOTION_TRANSITION_DURATION }}
        >{INTERFACE_CONTENT[language].exportData}</motion.button>
    );
}

export default ExportDataButton;