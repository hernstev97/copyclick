import './styles/main.scss';
import { getVersionString } from './utils/version';
import CopyClickItem from './components/CopyClickItem';
import { v4 as uuidv4 } from 'uuid';
import AddItemSkeleton from './components/AddItemSkeleton';
import ThemeToggle from './components/ThemeToggle';
import { useData } from './contexts/UserData';
import InfoModal from './components/InfoModal';
import { AnimatePresence, LayoutGroup, motion, Reorder } from 'motion/react';
import { MOTION_TRANSITION, MOTION_TRANSITION_DURATION } from './utils/constants';
import ExportDataButton from './components/ExportDataButton';
import ImportDataButton from './components/ImportDataButton';
import { CONTENT, INTERFACE_CONTENT, type Language } from './utils/content';
import { useEffect } from 'react';
import { LANGUAGE_KEY } from './utils/constants';
import type { SnippetDataType } from './types/SnippetDataType';
import { Analytics } from "@vercel/analytics/react"

function App() {
    const versionString = getVersionString();
    const { items, addItem, removeItem, updateItem, reorderItems, clearItems, language, setLanguage } = useData();

    useEffect(() => {
        const language = localStorage.getItem(LANGUAGE_KEY);
        if (language) {
            setLanguage(language as Language);
        }
    }, []);

    const handleSetLanguage = () => {
        const newLanguage = language === 'en' ? 'de' : 'en';
        setLanguage(newLanguage);
        localStorage.setItem(LANGUAGE_KEY, newLanguage);
    };

    return (
        <>
            <Analytics/>
            <div className="cc-app">
                <InfoModal />
                <div className="cc-app--userconfig">
                    <button className="cc-button cc-button--language" onClick={() => handleSetLanguage()}>{CONTENT[language].languageSwitchIcon}</button>
                    <ThemeToggle />
                </div>  
                <header>
                    <div>
                        <h1>{CONTENT[language].title}</h1>
                        <h3>
                            {CONTENT[language].description}
                        </h3>
                    </div>
                </header>
                <main>
                    <div className="cc-app--functional-buttons">
                        {items.length > 0 && (
                            <ExportDataButton />
                        )}
                        {items.length === 0 && (
                            <ImportDataButton />
                        )}
                        <AnimatePresence>
                            {items.length > 0 && (
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: MOTION_TRANSITION_DURATION }}
                                    className="cc-app--clearAll cc-app--button"
                                    onClick={clearItems}
                                >
                                    {INTERFACE_CONTENT[language].clearAll}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                    <LayoutGroup>
                        <Reorder.Group 
                            as="div" 
                            axis="y" 
                            values={items as SnippetDataType[]} 
                            onReorder={reorderItems} 
                            className="cc-app--items"
                        >    
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <CopyClickItem
                                        key={item.id}
                                        item={item}
                                        onRemove={removeItem}
                                        onUpdateContents={updateItem}
                                        initial={{ scaleY: 0, opacity: 0, transformOrigin: 'top' }}
                                        animate={{ scaleY: 1, opacity: 1, transformOrigin: 'top' }}
                                        exit={{ scaleY: 0, opacity: 0, transformOrigin: 'top' }}
                                        transition={MOTION_TRANSITION}
                                    />
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>
                        <AddItemSkeleton onClick={() => addItem({
                                id: uuidv4(),
                                title: `Snippet ${items.length + 1}`,
                                text: '',
                                editState: true,
                            })}
                        />
                    </LayoutGroup>
                </main>
                <footer>
                <p
                    className="cc-app--footer cc-app--footer__left"
                >
                    (c) Steven Hernandez
                </p>
                <p
                    className="cc-app--footer cc-app--footer__right"
                >
                        {versionString}
                    </p>
                </footer>
            </div>
        </>
    );
}

export default App;
