import React, { useState, useLayoutEffect, useRef } from 'react';
import { COPY_TOAST_DURATION, PASTE_TIMEOUT, TEXTAREA_BUFFER } from '../utils/constants';
import { motion, Reorder } from 'motion/react';
import type { SnippetDataType } from '../types/SnippetDataType';
import { INTERFACE_CONTENT } from '../utils/content';
import { useData } from '../contexts/UserData';

// Component to display a single snippet item
const CopyClickItem = React.forwardRef<HTMLDivElement, {
    item: SnippetDataType;
    onRemove: (id: string) => void;
    onUpdateContents: (item: SnippetDataType) => void;
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
}>(({
    item,
    onRemove,
    onUpdateContents,
    initial,
    animate,
    exit,
    transition,
}, ref) => {
    const { id, title, text, editState } = item;
    const { language } = useData();
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Call adjustTextareaHeight on text change
    useLayoutEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    // Call adjustTextareaHeight on mount
    useLayoutEffect(() => {
        adjustTextareaHeight();
    }, []);

    // Update local state on change event
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdateContents({ ...item, text: e.target.value });
    };

    // Adjust textarea height based on content
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + TEXTAREA_BUFFER + 'px';
        }
    };

    // Update local state on paste event
    const handlePaste = () => {
        setTimeout(() => {
            onUpdateContents({
                ...item,
                text: textareaRef.current?.value || '',
                editState: false,
            });
        }, PASTE_TIMEOUT);
    };

    // Copy text to clipboard
    const handleCopy = async () => {
        try {
            if (!navigator.clipboard) {
                throw new Error('Your browser does not support copying to clipboard');
            }

            await navigator.clipboard.writeText(text);
            setCopied(true);
            setCopyError(null);
            setTimeout(() => setCopied(false), COPY_TOAST_DURATION);
        } catch (error) {
            console.error('Failed to copy text:', error);
            setCopyError('Failed to copy text. Please try again.');
            setTimeout(() => setCopyError(null), COPY_TOAST_DURATION * 2);
        }
    };

    // Clear textarea
    const handleClear = () => {
        onUpdateContents({ ...item, text: '', editState: true });
    };

    // Remove item
    const handleRemove = () => {
        onRemove(id);
    };

    return (
        <Reorder.Item
            as="div"
            value={item}
            ref={ref}
            className={`cc-area ${dragging ? 'cc-area--dragging' : ''}`}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            onDragStart={() => {
                setDragging(true);
            }}
            onDragEnd={() => {
                setDragging(false);
            }}
        >
            <motion.div
                className="cc-area__content"
                layout
            >
                <div 
                    className="cc-area__title-wrapper"
                >
                    <p className="cc-area__title">{title}</p>
                    <button
                        className="cc-area__close-button"
                        type="button"
                        title="Remove"
                        onClick={handleRemove}
                        aria-label="Close"
                    >
                        {INTERFACE_CONTENT[language].delete}
                    </button>
                </div>

                <p 
                    className={`cc-area__toast ${copied ? 'visible' : ''}`}
                >
                    {INTERFACE_CONTENT[language].copied}
                </p>

                {copyError && (
                    <p 
                        className="cc-area__toast cc-area__toast--error visible"
                    >
                        {copyError}
                    </p>
                )}

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextChange}
                    onPaste={handlePaste}
                    onClick={!editState ? handleCopy : undefined}
                    placeholder={editState ? 'Paste text here...' : ''}
                    name="pastearea"
                    className={`cc-area__textbox ${editState ? 'cc-area__textbox--edit' : 'cc-area__textbox--copy'}`}
                    readOnly={!editState}
                ></textarea>

                <div 
                    className="cc-area__controls"
                >
                    <label htmlFor={`editmode-${id}`}>
                        <input
                            type="checkbox"
                            name={`editmode-${id}`}
                            id={`editmode-${id}`}
                            checked={editState}
                            onChange={() =>
                                onUpdateContents({
                                    id,
                                    title,
                                    text,
                                    editState: !editState,
                                })
                            }
                        />
                        <span>{INTERFACE_CONTENT[language].edit}</span>
                    </label>
                    <div
                        className="cc-area__reorder-handle"
                    >
                    <svg viewBox="0 0 534 334" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M66.9997 200.334C103.818 200.334 133.666 230.18 133.667 267C133.667 303.82 103.818 333.667 66.9997 333.667C30.1814 333.667 0.333664 303.82 0.333664 267C0.333837 230.18 30.1815 200.334 66.9997 200.334ZM267 200.334C303.819 200.334 333.666 230.18 333.667 267C333.667 303.819 303.819 333.667 267 333.667C230.18 333.667 200.334 303.819 200.334 267C200.334 230.18 230.18 200.334 267 200.334ZM467 200.334C503.819 200.334 533.666 230.18 533.667 267C533.667 303.819 503.819 333.667 467 333.667C430.18 333.667 400.334 303.819 400.334 267C400.334 230.18 430.18 200.334 467 200.334ZM66.9997 0.333679C103.818 0.333679 133.666 30.181 133.667 66.9997C133.667 103.819 103.819 133.667 66.9997 133.667C30.181 133.667 0.333664 103.818 0.333664 66.9997C0.333839 30.1811 30.1811 0.333854 66.9997 0.333679ZM267 0.333679C303.819 0.333679 333.666 30.1815 333.667 66.9997C333.667 103.818 303.82 133.667 267 133.667C230.18 133.667 200.334 103.818 200.334 66.9997C200.334 30.1816 230.18 0.333852 267 0.333679ZM467 0.333679C503.819 0.333679 533.666 30.1814 533.667 66.9997C533.667 103.818 503.82 133.667 467 133.667C430.18 133.667 400.334 103.818 400.334 66.9997C400.334 30.1816 430.18 0.333844 467 0.333679Z" fill="currentColor"/>
                    </svg>
                    </div>
                    <button
                        onClick={handleClear}
                        className="cc-area__controls--clear"
                    >
                        {INTERFACE_CONTENT[language].clear}
                    </button>
                </div>
            </motion.div>
        </Reorder.Item>
    );
});

export default CopyClickItem;
