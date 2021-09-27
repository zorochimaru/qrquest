import { IconButton, Paper, Stack } from '@mui/material';
import { FieldAttributes, useField } from 'formik';
import ImageIcon from '@mui/icons-material/Image';
import React, { FC, useEffect, useRef, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

const CustomFileField: FC<string & FieldAttributes<any>> = (props) => {
    const [field] = useField<{}>(props);
    const [imgPreview, setImgPreview] = useState<any>();
    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
    useEffect(() => {
        if (field.value === null) {
            setImgPreview(null);
        }
    }, [field.value])

    useEffect(() => {
        if (props) {
            setImgPreview(props.imgUrl)
        }
    }, [props]);

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
    const clearImage = () => {
        props.onChange(null);
        setImgPreview(null);
    }
    return (
        <Stack direction="column" justifyContent="space-between" width="100%" alignItems="flex-start"  >
            <input hidden ref={inputRef} type="file" name="file" onChange={(event: any) => {
                props.onChange(event);
                generatePreview(event.currentTarget.files[0]);
            }} />
            <div>
                <IconButton
                    color={field.value || imgPreview ? 'secondary' : 'primary'}
                    onClick={handleOpenFileInput}
                    aria-label="upload"
                    size="large">
                    <ImageIcon />
                </IconButton>
                {field.value || props.imgUrl ? <IconButton onClick={clearImage}>
                    <DeleteIcon />
                </IconButton> : null}
            </div>
            {imgPreview ? <Paper elevation={3} sx={{ my: 2 }} style={{ display: "flex", alignSelf: 'center', overflow: 'hidden' }}>
                <img style={{ width: '100%', maxHeight: 500, objectFit: 'cover' }} src={imgPreview} alt="preview" />
            </Paper> : null}
        </Stack>)
}

export default CustomFileField
