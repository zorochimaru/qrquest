import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core'
import React, { useState } from 'react'

const NewTag = (props: any) => {
    const [state, setState] = useState('');
    const handleChange = (event: any) => { setState(event.target.value); }
    const handleClose = () => {
        if (state) {
            props.onClose(state)
            setState('');
        } else {
            props.onClose()
        }
    }
    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle id="form-dialog-title">New Tag</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="tagName"
                    label="Tag name"
                    type="text"
                    fullWidth
                    value={state} onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleClose} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewTag
