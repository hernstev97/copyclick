import React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { CopyClickItemProps } from '../types/CopyClickItemProps';

function CopyClickItem({ id }: CopyClickItemProps) {
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

    return (
        <>
            <div className="copy-area-wrapper">
                <p className={`copy-feedback ${copied ? 'copied' : ''}`}>
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
                        className="pastearea paste-enabled"
                        style={{ height: `${height}px` }}
                    ></textarea>
                )}

                {!isEditMode && (
                    <div
                        className="pastearea copybox"
                        onClick={handleCopy}
                        style={{ height: `${height}px` }}
                    >
                        {text}
                    </div>
                )}

                <div className="copy-area-control-button-wrapper">
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
                    <button onClick={handleClear}>Clear</button>
                </div>
            </div>
        </>
    );
}

export default CopyClickItem;
