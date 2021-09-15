import React, { useEffect, useState } from "react";
import {
    Typography,
    Button,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Slide,
    createStyles,
    makeStyles,
    Theme,
    TextField,
    Container,
    Box,
} from "@material-ui/core"
import { TransitionProps } from "@material-ui/core/transitions";
import CloseIcon from '@material-ui/icons/Close';
import { createNews, deleteNews, editNews, News } from "../../../../redux/News";
import { useDispatch, useSelector } from "react-redux";
import FileInput from "../../../../components/FileInput";


import { fetchTags } from "../../../../redux/Library";
import { RootState } from "../../../../redux/store";
import Autocomplete from '@material-ui/lab/Autocomplete';


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
        tags: {
            width: 200
        },
        formWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20
        },
        note: {
            width: '100%'
        }
    }),
);
const QuestionEditor = (props: any) => {
    const classes = useStyles();
    const activeNews: News = props?.activeNews;
    const [imgUrl, setImgUrl] = useState<string | undefined>('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tagIds, setTagIds] = useState<string[]>([]);
    const tags = useSelector((state: RootState) => state.library.tags);
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTags())
    }, [dispatch]);
    useEffect(() => {

        setTitle(activeNews?.title || '');
        setText(activeNews?.text || '');
        setTagIds(activeNews?.tags?.map(x => x.id) || []);
        setImgUrl(activeNews?.imgUrl || '');

    }, [activeNews])
    const handleFileSelect = (file: File) => {
        setImgUrl('');
        setFile(file);
    }
    const handleSave = async () => {
        if (activeNews) {
            const fdata = new FormData();
            fdata.append('title', title);
            fdata.append('text', text);
            fdata.append('tagIds', JSON.stringify(tagIds));
            if (file) {
                fdata.append('mainPic', file);
            }
            dispatch(editNews({ id: activeNews.id!, fData: fdata, page: props.page, perPage: props.perPage }));
        } else {
            const fdata = new FormData();
            fdata.append('title', title);
            fdata.append('text', text);
            fdata.append('tagIds', JSON.stringify(tagIds));
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

        <Dialog fullScreen open={props.open} onClose={() => props.handleClose()} TransitionComponent={Transition}>
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
                            className={classes.tags}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            id="outlined-basic"
                            label="Title"
                            variant="outlined" />
                        <Autocomplete
                            multiple
                            id="combo-box-demo"
                            options={tags}
                            value={tags.filter(tag => tagIds.includes(tag.id))}
                            getOptionLabel={option => option.value}
                            style={{ width: 300 }}
                            renderInput={params => (
                                <TextField {...params} label="Tags" variant="outlined" />
                            )}
                            onChange={(event, newValue) => {
                                setTagIds(newValue.map(x => x.id));
                            }}
                        />
                        <FileInput onDeleteFile={() => setImgUrl(undefined)} hasFileUrl={imgUrl} onFileSelect={handleFileSelect} />
                        {imgUrl ? <img style={{ width: 300, objectFit: 'contain' }} src={imgUrl} alt={activeNews?.title} /> : null}
                        <TextField
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            id="outlined-multiline-static"
                            label="Text"
                            multiline
                            rows={4}
                            variant="outlined"
                            className={classes.note}
                        />

                    </form>

                </Box>


            </Container>
        </Dialog>

    )
}

export default QuestionEditor
