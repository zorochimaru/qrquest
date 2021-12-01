import React from "react";
import {
    Typography,
    Button,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Slide,
    Theme,
    TextField,
    Container,
    Box,
    Stack,
} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';
import { Field, Form, Formik } from "formik";
import { Quest, Question } from "../../../../redux/Quest";
import ClearIcon from '@mui/icons-material/Clear';
import CustomFileField from "../../../../components/CustomFileField";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { DatePicker } from 'formik-mui-lab';

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
        question: {
        },
        answer: {},
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
const QuestEditor = (props: any) => {
    const classes = useStyles();
    const activeQuestion = props?.activeQuestion;
    const initialValues: Quest = {
        name: activeQuestion?.name || '',
        date: activeQuestion?.date || '',
        file: activeQuestion?.file || null,
        imgUrl: activeQuestion?.imgUrl || ''
    }

    const handleDelete = async () => {
        if (activeQuestion && activeQuestion.id) {
            const response = await axios.delete(`/questions/${activeQuestion.id}`);
            if (response?.status === 200) {
                toast.success(response.data);
                props.handleClose();
            }

        }
    }

    return (
        <Formik enableReinitialize={true} initialValues={initialValues}
            onSubmit={async (data, { setSubmitting, resetForm }) => {
                const fData = new FormData();
                if (data.file) {
                    fData.append('file', data.file)
                }
                fData.append('name', data.name);
                fData.append('date', data.date.toString());
                let response: AxiosResponse<any>;
                if (activeQuestion) {
                    response = await axios.put(`/quests/${activeQuestion.id}`, fData);
                } else {
                    response = await axios.post(`/quests`, fData);
                }
                if (response?.status === 200) {
                    toast.success(response.data.message);
                }
                setSubmitting(false);
                resetForm();
                props.handleClose();
            }}
        >{({ values, errors, isSubmitting, setFieldValue, handleReset }) => (
            <Dialog fullScreen open={props.open} onClose={() => props.handleClose()} TransitionComponent={Transition}>
                <Form>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => props.handleClose()}
                                aria-label="close"
                                size="large">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {activeQuestion?.title}
                            </Typography>
                            {activeQuestion ? <Button color="secondary" variant="contained" style={{ marginRight: 15 }} onClick={handleDelete}>
                                Delete
                            </Button> : null}
                            <Button type="submit" disabled={isSubmitting} autoFocus color="inherit">
                                Save
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Container>
                        <Container maxWidth="sm">
                            <Box sx={{ mt: 3 }}>

                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>

                                        <Field
                                            name="file"
                                            imgUrl={values.imgUrl}
                                            onChange={(event: any) => {
                                                if (event) {
                                                    setFieldValue("file", event.currentTarget.files[0])
                                                } else {
                                                    setFieldValue("file", null);
                                                    setFieldValue("imgUrl", null);
                                                }
                                            }}
                                            as={CustomFileField} />
                                        <IconButton onClick={handleReset}>
                                            <ClearIcon />
                                        </IconButton>
                                    </Stack>

                                    <Field fullWidth placeholder="Quest name" name="name" as={TextField} />
                                    <Field
                                        component={DatePicker}
                                        name="date"
                                    />
                                </Stack>

                            </Box>

                        </Container>

                    </Container>
                </Form>
            </Dialog >
        )}


        </Formik >
    );
}

export default QuestEditor
