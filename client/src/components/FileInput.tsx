import { IconButton } from "@material-ui/core"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useEffect, useRef, useState } from "react";
import DeleteIcon from '@material-ui/icons/Delete';

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
    };
    return (
        <div>
            <input hidden ref={inputRef} type="file" onChange={e => {
                setFile(e.target.files && e.target.files[0]);
            }} />
            <IconButton color={file ? 'secondary' : 'primary'} onClick={handleOpenFileInput} aria-label="upload">
                <CloudUploadIcon />
            </IconButton>
            {file ? (
                <>
                    <span style={{ maxWidth: 300 }}>{file.name.substr(0, 10)}{file.name.length > 10 ? '...' : null}</span>
                    < IconButton onClick={handleClearFile} aria-label="upload">
                        <DeleteIcon />
                    </IconButton>
                </>) : null
            }
        </div >
    )
}

export default FileInput
