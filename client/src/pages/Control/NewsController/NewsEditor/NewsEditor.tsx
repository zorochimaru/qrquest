import React, { useEffect, useState } from "react";
import { Typography, Button, Dialog, AppBar, Toolbar, IconButton, Slide, createStyles, makeStyles, Theme, TextField, Container, Box } from "@material-ui/core"
import { TransitionProps } from "@material-ui/core/transitions";
import CloseIcon from '@material-ui/icons/Close';
import { createNews, deleteNews, editNews, News } from "../../../../redux/News";
import { useDispatch } from "react-redux";
import FileInput from "../../../../components/FileInput";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        formWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20
        }
    }),
);
const NewsEditor = (props: any) => {
    const classes = useStyles();
    const activeNews: News = props?.activeNews;
    const [title, setTitle] = useState(activeNews?.title || '');
    const [text, setText] = useState(activeNews?.text || '');
    const [file, setFile] = useState<File | null>(activeNews?.file || null);
    const dispatch = useDispatch();
    useEffect(() => {
        setTitle(activeNews?.title);
        setText(activeNews?.text);
    }, [activeNews])
    const handleFileSelect = (file: File) => {
        setFile(file);
    }
    const handleSave = async () => {
        if (activeNews) {
            const formObj: News = {
                id: activeNews.id,
                text,
                title,
                file
            };
            // getBase64();
            dispatch(editNews({ item: formObj, page: props.page, perPage: props.perPage }));
        } else {
            const fdata = new FormData();
            fdata.append('title', title);
            fdata.append('text', text);
            if (file) {
                fdata.append('mainPic', file);
            }
            dispatch(createNews({ fData: fdata, page: props.page, perPage: props.perPage }));
        }
        props.handleClose();
    }
    const handleDelete = async () => {
        if (activeNews && activeNews.id) {
            dispatch(deleteNews({ id: activeNews.id, page: props.page, perPage: props.perPage }));
            props.handleClose();
        }
    }
    return (

        <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => props.handleClose()} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {activeNews?.title}
                    </Typography>
                    {activeNews ? <Button color="secondary" variant="contained" style={{ marginRight: 15 }} onClick={handleDelete}>
                        Delete
                    </Button> : null}
                    <Button autoFocus color="inherit" onClick={handleSave}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Box component="span" m={1}>
                    <form noValidate className={classes.formWrapper} autoComplete="off">
                        <TextField
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            id="outlined-basic"
                            label="Outlined"
                            variant="outlined" />
                        <TextField
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            id="outlined-multiline-static"
                            label="Multiline"
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                        <FileInput onFileSelect={handleFileSelect} />
                    </form>

                </Box>


            </Container>
        </Dialog>

    )
}

export default NewsEditor
