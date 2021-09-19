import { IconButton } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useRef, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

const FileInput = (props: any) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null);
    useEffect(() => {
        if (file) {
            props.onFileSelect(file)
        }
    }, [props, file]);
    const handleOpenFileInput = () => {
        inputRef.current?.click();
    };
    const handleClearFile = () => {
        setFile(null);
        props.onDeleteFile();
    };
    return (
        <div>
            <input hidden ref={inputRef} type="file" onChange={e => {
                setFile(e.target.files && e.target.files[0]);
            }} />
            <IconButton
                color={file || props.hasFileUrl ? 'secondary' : 'primary'}
                onClick={handleOpenFileInput}
                aria-label="upload"
                size="large">
                <CloudUploadIcon />
            </IconButton>
            {file || props.hasFileUrl ? (
                <>
                    {file ? <span style={{ maxWidth: 300 }}>{file.name.substr(0, 10)}{file!.name.length > 10 ? '...' : null}</span> : null}
                    <IconButton onClick={handleClearFile} aria-label="upload" size="large">
                        <DeleteIcon />
                    </IconButton>
                </>) : null
            }
        </div >
    );
}

export default FileInput
