import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { MOTION_TRANSITION_DURATION } from '../utils/constants';
import { CONTENT } from '../utils/content';
import { useData } from '../hooks/useData';
import InfoContent from './InfoContent';

function InfoModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useData();
    const dialog = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!isOpen) return;
        const container = dialog.current;
        if (!container) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        container.focus();
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setIsOpen(false);
            }
            if (event.key !== 'Tab') return;
            const targets = container.querySelectorAll<HTMLElement>(
                'a[href], button, [tabindex="0"]'
            );
            const first = targets[0];
            const last = targets[targets.length - 1];
            if (
                event.shiftKey &&
                (document.activeElement === first ||
                    document.activeElement === container)
            ) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        const onFocus = (event: FocusEvent) => {
            if (!container.contains(event.target as Node)) container.focus();
        };
        const triggerElement = trigger.current;
        document.addEventListener('keydown', onKey);
        document.addEventListener('focusin', onFocus);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('focusin', onFocus);
            triggerElement?.focus();
        };
    }, [isOpen]);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <div>
            <button
                ref={trigger}
                aria-haspopup="dialog"
                className="cc-button cc-modal-button"
                onClick={handleOpen}
            >
                {CONTENT[language].dataHandling.modalButton}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        layout
                        className="cc-modal--overlay"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: MOTION_TRANSITION_DURATION,
                            ease: 'easeInOut',
                        }}
                    >
                        <motion.div
                            ref={dialog}
                            role="dialog"
                            aria-modal="true"
                            aria-label={
                                CONTENT[language].dataHandling.modalButton
                            }
                            tabIndex={-1}
                            className="cc-modal--content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0, x: '-50%', y: '-50%' }}
                            animate={{ scale: 1, x: '-50%', y: '-50%' }}
                            exit={{ scale: 0, x: '-50%', y: '-50%' }}
                            transition={{
                                duration: MOTION_TRANSITION_DURATION,
                                ease: 'easeInOut',
                            }}
                        >
                            <div>
                                <InfoContent language={language} />
                            </div>
                            <h3>Version</h3>
                            <p>{import.meta.env.VITE_APP_VERSION}</p>
                            <h3>Build Date</h3>
                            <p>{import.meta.env.VITE_BUILD_DATE}</p>
                            <button className="cc-button" onClick={handleClose}>
                                {
                                    CONTENT[language].dataHandling.modalContent
                                        .close
                                }
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default InfoModal;
