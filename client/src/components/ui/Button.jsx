export function Button({ onClick, children }) {
    return (
        <button
            className="bg-red-500 px-4 py-2 mb-4 rounded-md hover:bg-red-700"
            onClick={onClick}
        >
            {children}
        </button>
    );
}
