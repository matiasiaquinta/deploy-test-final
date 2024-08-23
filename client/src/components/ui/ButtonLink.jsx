import { Link } from "react-router-dom";

export const ButtonLink = ({ to, children }) => (
    <Link to={to} className="bg-blue-500 p-4 rounded-md mb-3 hover:bg-blue-700">
        {children}
    </Link>
);
