import { useState } from 'react';
import './App.scss';

function App() {
    const [text, setText] = useState('');
    const [isEditMode, setIsEditMode] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const handlePaste = () => {
        setTimeout(() => setIsEditMode(false), 0);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText('');
        setIsEditMode(true);
    };

    return (
        <>
            <div className="site-wrapper">
                <header>
                    <h1>copyclick.</h1>
                    <h3>Just paste it for later and copy with one click.</h3>
                </header>

                <main>
                    <p className={`copy-feedback ${copied ? 'copied' : ''}`}>
                        copied!
                    </p>

                    {isEditMode && (
                        <textarea
                            value={text}
                            onChange={handleTextChange}
                            onPaste={handlePaste}
                            placeholder="Paste text here..."
                            name="pastearea"
                            className="pastearea paste-enabled"
                        ></textarea>
                    )}

                    {!isEditMode && (
                        <div className="pastearea copybox" onClick={handleCopy}>
                            {text}
                        </div>
                    )}

                    <div className="copy-area-control-button-wrapper">
                        <label htmlFor="editmode">
                            <input
                                type="checkbox"
                                name="editmode"
                                id="editmode"
                                checked={isEditMode}
                                onChange={() => setIsEditMode(!isEditMode)}
                            />
                            <span>Edit</span>
                        </label>
                        <button onClick={handleClear}>Clear</button>
                    </div>
                </main>

                <footer>
                    <p>(c) Steven Hernandez</p>
                </footer>
                <p
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        fontSize: '.8rem',
                    }}
                >
                    v0.1
                </p>
            </div>
        </>
    );
}

export default App;
