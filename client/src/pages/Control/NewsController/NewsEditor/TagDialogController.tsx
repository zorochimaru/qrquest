import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { Autocomplete } from '@mui/material';
import { ChangeEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createTag, deleteTag, editTag, Tag } from '../../../../redux/Library';
import { RootState } from '../../../../redux/store';

const TagDialogController = (props: any) => {
    const tags = useSelector((state: RootState) => state.library.tags);
    const [oldTag, setOldTag] = useState<Tag | null>(null);
    const [newTag, setNewTag] = useState('');
    const [editMode, setEditMode] = useState(false);
    const handleNewTagChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => { setNewTag(event.target.value.toLocaleLowerCase()); }
    const dispatch = useDispatch();
    const handleClose = () => {
        setNewTag('');
        setOldTag(null);
        setEditMode(false);
        props.onClose()
    }
    const handleDelete = () => {
        if (editMode && oldTag) {
            dispatch(deleteTag(oldTag.id));
        }
        handleClose();
    }
    const handleSubmit = () => {
        if (editMode && oldTag) {
            dispatch(editTag({ id: oldTag.id, value: newTag }));
        } else {
            dispatch(createTag(newTag));
        }
        handleClose();
    }
    const handleSelectTag = (tag: Tag | null) => {
        if (tag) {
            setEditMode(true);
            setNewTag(tag.value);
        } else {
            setEditMode(false);
            setNewTag('');
        }
    }
    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle id="form-dialog-title">Tag Controller</DialogTitle>
            <DialogContent>
                <Autocomplete
                    id="combo-box-demo"
                    options={tags}
                    getOptionLabel={(option) => option.value}
                    value={oldTag}
                    onChange={(event, value) => {
                        handleSelectTag(value);
                        setOldTag(value);
                    }}
                    style={{ width: 400 }}
                    renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" />}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="tagName"
                    label="Tag name"
                    type="text"
                    fullWidth
                    value={newTag} onChange={handleNewTagChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                {editMode ? <Button onClick={handleDelete} color="primary">
                    Delete
                </Button> : null}

                <Button onClick={handleSubmit} color="primary">
                    {editMode ? 'Edit' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TagDialogController
