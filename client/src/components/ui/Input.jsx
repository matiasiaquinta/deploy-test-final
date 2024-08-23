import { forwardRef } from "react";

export const Input = forwardRef((props, ref) => (
    <input
        {...props}
        ref={ref}
        className="inputFocus w-full bg-white text-xl text-black border-2 border-slate-800 px-4 py-2 rounded-md"
    />
));
