import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "code"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "code",
];

const TextEditor = ({ value, onChange, placeholder, style }) => {
    return (
        <>
            <ReactQuill
                theme="snow"
                style={style}
                modules={modules}
                formats={formats}
                value={value || ""}
                onChange={onChange}
                placeholder={placeholder}
                bounds="#scrolling-container"
                scrollingContainer=".parent-scroll"
            />
        </>
    );
};

export default TextEditor;