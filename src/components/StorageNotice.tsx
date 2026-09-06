import { useData } from '../hooks/useData';
import { downloadJson } from '../utils/data';
import { INTERFACE_CONTENT } from '../utils/content';

export default function StorageNotice() {
    const { language, storageStatus, storedBackup, replaceStoredData } =
        useData();
    const content = INTERFACE_CONTENT[language];
    if (storageStatus === 'ok') return null;
    return (
        <div className="cc-area" role="alert">
            <p>{content.storageErrors[storageStatus]}</p>
            {storedBackup !== null && (
                <button
                    className="cc-app--button"
                    onClick={() =>
                        downloadJson(storedBackup, 'copyclick-recovery.json')
                    }
                >
                    {content.recoverData}
                </button>
            )}
            <button
                className="cc-app--button"
                onClick={() => {
                    if (window.confirm(content.replaceStoredConfirm))
                        replaceStoredData();
                }}
            >
                {content.retryStorage}
            </button>
        </div>
    );
}
