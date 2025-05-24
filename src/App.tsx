import './styles/main.scss';
import { getVersionString } from './utils/version';
import CopyClickItem from './components/CopyClickItem';
import { v4 as uuidv4 } from 'uuid';
import AddItemSkeleton from './components/AddItemSkeleton';
import ThemeToggle from './components/ThemeToggle';
import { useData } from './contexts/UserData';
import InfoModal from './components/InfoModal';

function App() {
    const versionString = getVersionString();
    const { items, addItem, removeItem, updateItem, clearItems } = useData();

    return (
        <>
            <div className="cc-app">
                <InfoModal />
                <ThemeToggle />
                <header>
                    <div>
                        <h1>copyclick.</h1>
                        <h3>
                            Just paste it for later and copy with one click.
                        </h3>
                    </div>
                </header>
                <main>
                    {items.length > 0 && (
                        <button
                            className="cc-app--clearAll"
                            onClick={clearItems}
                        >
                            CLEAR ALL
                        </button>
                    )}

                    {items.map((item) => (
                        <CopyClickItem
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            text={item.text}
                            editState={item.editState}
                            onRemove={removeItem}
                            onUpdate={updateItem}
                        />
                    ))}
                    <AddItemSkeleton onClick={() => addItem({
                            id: uuidv4(),
                            title: `Snippet ${items.length + 1}`,
                            text: '',
                            editState: true,
                        })
                    }
                />
                </main>
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
            </div>
        </>
    );
}

export default App;
