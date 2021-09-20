import { IconButton, Paper, Stack } from '@mui/material';
import { FieldAttributes, useField } from 'formik';
import ImageIcon from '@mui/icons-material/Image';
import React, { FC, useEffect, useRef, useState } from 'react'

const CustomFileField: FC<FieldAttributes<any>> = (props) => {
    const [field] = useField<{}>(props);
    const [imgPreview, setImgPreview] = useState<any>();
    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
    useEffect(() => {
        if (field.value === null) {
            setImgPreview(null);
        }
    }, [field.value])
    const handleOpenFileInput = () => {
        inputRef.current?.click();
    };
    const generatePreview = async (file: File) => {
        const imgURI = await toBase64(file);
        setImgPreview(imgURI);
    }
    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    return (
        <Stack direction="column" justifyContent="space-between" alignItems="flex-start"  >
            <input hidden ref={inputRef} type="file" name="file" onChange={(event: any) => {
                props.onChange(event);
                generatePreview(event.currentTarget.files[0]);
            }} />
            <IconButton
                color={field.value ? 'secondary' : 'primary'}
                onClick={handleOpenFileInput}
                aria-label="upload"
                size="large">
                <ImageIcon />
            </IconButton>

            {imgPreview ? <Paper elevation={3} sx={{ my: 2 }} style={{ display: "flex", overflow: 'hidden' }}>
                <img style={{ width: '100%', maxHeight: 500, objectFit: 'cover' }} src={imgPreview} alt="preview" />
            </Paper> : null}
        </Stack>)
}

export default CustomFileField
