import { motion } from 'motion/react';
import { useData } from '../contexts/UserData';
import type { SnippetDataType } from '../types/SnippetDataType';
import { MOTION_TRANSITION_DURATION } from '../utils/constants';

function ImportDataButton() {
    const { addItem } = useData();

    const importData = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = JSON.parse(e.target?.result as string);
                    data.forEach((item: SnippetDataType) => {
                        addItem(item);
                    });
                };
                reader.readAsText(file);
            }
        };
        fileInput.click();
    };

    return (
        <motion.button onClick={importData} className="cc-app--button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: MOTION_TRANSITION_DURATION }}
        >Import Data</motion.button>
    );
}

export default ImportDataButton;