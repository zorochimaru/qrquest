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
    InputAdornment,
    Stack,
} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';
import { Field, FieldArray, Form, Formik } from "formik";
import { Question } from "../../../../redux/Quest";
import ClearIcon from '@mui/icons-material/Clear';
import CustomFileField from "../../../../components/CustomFileField";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { Refresh } from '@mui/icons-material';
import { httpClient } from '../../../../api/httpClient';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
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
interface QuestionEditorProps {
    nextQuestionOrder: number;
    activeQuestion: Question | null;
    currentQuestId: string;
    open: boolean;
    handleClose: () => void;
}
const QuestionEditor = (props: QuestionEditorProps) => {
    const classes = useStyles();
    const activeQuestion = props?.activeQuestion;
    const currentQuestId = props?.currentQuestId;
    const initialValues: Question = {
        text: activeQuestion?.text || '',
        locationLink: activeQuestion?.locationLink || '',
        answers: activeQuestion?.answers || [],
        order: activeQuestion && activeQuestion.order >= 0 ? activeQuestion?.order : props?.nextQuestionOrder,
        file: activeQuestion?.file || null,
        imgUrl: activeQuestion?.imgUrl || '',
        questId: currentQuestId
    }

    const handleDelete = async () => {
        if (activeQuestion && activeQuestion.id) {
            const response = await httpClient.delete(`/questions/${activeQuestion.id}/${activeQuestion.questId}`);
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
                fData.append('questId', data.questId);
                fData.append('text', data.text);
                fData.append('order', String(data.order));
                fData.append('locationLink', data.locationLink);
                fData.append('answers', JSON.stringify(data.answers));
                let response: AxiosResponse<any>;
                if (activeQuestion) {
                    response = await httpClient.put(`/questions/${activeQuestion.id}`, fData);
                } else {
                    response = await httpClient.post(`/questions`, fData);
                }
                if (response?.status === 200) {
                    toast.success(response.data.message);
                }
                setSubmitting(false);
                resetForm();
                props.handleClose();
            }}
        >{({ values, errors, isSubmitting, setFieldValue, handleReset }) => (
            <Dialog TransitionComponent={Transition} fullScreen open={props.open} onClose={() => props.handleClose()} >
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
                                {activeQuestion?.text}
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
                            <Stack spacing={2} sx={{ mt: 3 }}>
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
                                        <Refresh />
                                    </IconButton>
                                </Stack>

                                <Field fullWidth placeholder="Question" name="text" as={TextField} />
                                <Field fullWidth placeholder="Location link" name="locationLink" as={TextField} />
                                <FieldArray name="answers">
                                    {arrayHelpers => (
                                        <div>
                                            <Box>
                                                <Button disabled={values.answers.length > 3} onClick={() => arrayHelpers.push({
                                                    value: '',
                                                    isRight: false
                                                })}>Add answer</Button>
                                            </Box>

                                            {values.answers.map((answer, index) => {
                                                return (
                                                    <Stack direction="row" sx={{ my: 3 }} key={index} alignItems="center">
                                                        <IconButton onClick={() => {
                                                            values.answers.forEach((answer, i) => {
                                                                if (answer.isRight) {
                                                                    setFieldValue(`answers.${i}.isRight`, false);
                                                                }
                                                            });
                                                            setFieldValue(`answers.${index}.isRight`, true);
                                                        }}>
                                                            {values.answers[index].isRight ? <CheckBoxOutlinedIcon color="success" /> : <CheckBoxOutlineBlankIcon />}
                                                        </IconButton>
                                                        <Field
                                                            fullWidth
                                                            placeholder={`Answer-${index + 1}`}
                                                            name={`answers.${index}.value`}
                                                            type="input"
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="end">
                                                                    <IconButton onClick={() => arrayHelpers.remove(index)}>
                                                                        <ClearIcon />
                                                                    </IconButton>
                                                                </InputAdornment>,
                                                            }}
                                                            as={TextField}
                                                        />
                                                    </Stack>
                                                )
                                            })}
                                        </div>

                                    )}
                                </FieldArray>


                            </Stack>

                        </Container>

                    </Container>
                </Form>
            </Dialog >
        )}


        </Formik >
    );
}

export default QuestionEditor
