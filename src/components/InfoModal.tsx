import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { MOTION_TRANSITION_DURATION } from '../utils/constants';
import { CONTENT } from '../utils/content';
import { useData } from '../contexts/UserData';
import DOMPurify from 'dompurify';

function InfoModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useData();
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <div>
            <button className="cc-button cc-modal-button" onClick={handleOpen}>
                {CONTENT[language].dataHandling.modalButton}
            </button>

            <AnimatePresence> 
            {isOpen && (
                <motion.div layout className="cc-modal--overlay" onClick={handleClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: MOTION_TRANSITION_DURATION, ease: "easeInOut" }}>
                    <motion.div
                        className="cc-modal--content"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0, x: '-50%', y: '-50%' }}
                        animate={{ scale: 1, x: '-50%', y: '-50%' }}
                        exit={{ scale: 0, x: '-50%', y: '-50%' }}
                        transition={{ duration: MOTION_TRANSITION_DURATION, ease: "easeInOut" }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(CONTENT[language].dataHandling.modalContent.html) }} />
                        <h3>Version</h3>
                        <p>1.0.0</p>
                        <h3>Build Date</h3>
                        <p>{import.meta.env.VITE_BUILD_DATE}</p>
                        <button className="cc-button" onClick={handleClose}>
                            {CONTENT[language].dataHandling.modalContent.close}
                        </button>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}

export default InfoModal;