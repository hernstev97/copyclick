import type { AddItemSkeletonProps } from '../types/props/AddItemSkeletonProps';
import { motion } from 'motion/react';
import { INTERFACE_CONTENT } from '../utils/content';
import { useData } from '../hooks/useData';

function AddItemSkeleton({ onClick }: AddItemSkeletonProps) {
    const { language } = useData();
    return (
        <>
            <motion.button
                aria-label={INTERFACE_CONTENT[language].add}
                className="cc-area cc-area--skeleton"
                onClick={onClick}
                layout
            >
                <div className="cc-area__title-wrapper">
                    <div className="cc-area__title-skeleton"></div>
                    <div className="cc-area__close-button">
                        <span>{INTERFACE_CONTENT[language].delete}</span>
                    </div>
                </div>
                <div className="cc-area__textbox cc-area__textbox--edit">
                    {/* Updated SVG that works with fill */}
                    <svg
                        className="cc-area__plus-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                    >
                        {/* This creates a plus sign using filled rectangles */}
                        <rect x="11" y="4" width="2" height="16" />
                        <rect x="4" y="11" width="16" height="2" />
                    </svg>
                </div>
                <div className="cc-area__controls">
                    <div className="cc-area__controls--editSkeleton"></div>
                    <div className="cc-area__controls--clear">
                        <span>Clear</span>
                    </div>
                </div>
            </motion.button>
        </>
    );
}

export default AddItemSkeleton;
