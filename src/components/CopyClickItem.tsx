import React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { CopyClickItemProps } from '../types/CopyClickItemProps';

function CopyClickItem({ id, onRemove }: CopyClickItemProps) {
    const [text, setText] = useState('');
    const [isEditMode, setIsEditMode] = useState(true);
    const [copied, setCopied] = useState(false);
    const [height, setHeight] = useState(0);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    useEffect(() => {
        adjustTextareaHeight();
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        adjustTextareaHeight();
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            const scrollTop = textareaRef.current.scrollTop;

            textareaRef.current.style.height = 'auto';

            const newHeight = textareaRef.current.scrollHeight + 10;
            textareaRef.current.style.height = `${newHeight}px`;
            setHeight(newHeight);

            textareaRef.current.scrollTop = scrollTop;
        }
    };

    const handlePaste = () => {
        setTimeout(() => {
            setIsEditMode(false);
            adjustTextareaHeight();
        }, 0);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText('');
        setIsEditMode(true);
        setTimeout(adjustTextareaHeight, 0);
    };

    const handleRemove = () => {
        onRemove(id);
    };

    return (
        <>
            <div className="cc-area">
                <button
                    className="cc-area--close-button"
                    type="button"
                    title="Remove"
                    onClick={handleRemove}
                    aria-label="Close"
                >
                    ×
                </button>
                <p className={`cc-area--toast ${copied ? 'visible' : ''}`}>
                    copied!
                </p>

                {isEditMode && (
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={handleTextChange}
                        onPaste={handlePaste}
                        placeholder="Paste text here..."
                        name="pastearea"
                        className="cc-area--textbox cc-area--textbox__edit"
                        style={{ height: `${height}px` }}
                    ></textarea>
                )}

                {!isEditMode && (
                    <div
                        className="cc-area--textbox cc-area--textbox__copy"
                        onClick={handleCopy}
                        style={{ height: `${height}px` }}
                    >
                        {text}
                    </div>
                )}

                <div className="cc-area--controls">
                    <label htmlFor={`editmode-${id}`}>
                        <input
                            type="checkbox"
                            name={`editmode-${id}`}
                            id={`editmode-${id}`}
                            checked={isEditMode}
                            onChange={() => setIsEditMode(!isEditMode)}
                        />
                        <span>Edit</span>
                    </label>
                    <button
                        onClick={handleClear}
                        className="cc-area--controls__clear"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </>
    );
}

export default CopyClickItem;
