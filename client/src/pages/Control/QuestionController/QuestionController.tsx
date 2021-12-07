import { Paper, TableRow, TableBody, TableContainer, Table, TableHead, TableCell, Button, Autocomplete, TextField, CircularProgress, Stack } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import { RouteComponentProps } from "@reach/router";
import QuestionEditor from "./QuestionEditor/QuestionEditor";
import { getQuestionsByQuestId, Question, questActions, Quest } from "../../../redux/Quest";
import axios from 'axios';
import { debounce } from 'lodash';
import Moment from 'react-moment';

interface Column {
    id: 'text' | 'quest.name';
    label: string;
    minWidth?: number;
}

const columns: Column[] = [
    { id: 'text', label: 'Question', minWidth: 170 },
    { id: 'quest.name', label: 'Quest', minWidth: 170 },
];

const QuestionController: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
    const questionsList = useSelector((state: RootState) => state.quest.questionList);
    const currentQuestId = useSelector((state: RootState) => state.quest.currentQuestId);
    const [openDialog, setOpenDialog] = useState(false);
    const [questText, setQuestText] = useState('');
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(false);

    const handleEdit = (item: Question) => {
        setActiveQuestion(item);
        handleClickOpen();
    }

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setActiveQuestion(null);
        setOpenDialog(false);
        handleSearchQuest(questText);
    };

    const handleSearchQuest = async (text: string) => {
        const res = await axios.get(`quests?name=${text.toLowerCase()}`)
        if (res && res.data) {
            setQuests(res.data);
        }
    }

    const debouncedEventHandler = useMemo(
        () => debounce(handleSearchQuest, 1000)
        , []);

    const handleFetchQuestionsByQuestId = (id: string | undefined) => {
        if (id) {
            dispatch(getQuestionsByQuestId(id))
        } else {
            dispatch(questActions.clearQuestId())
        }
    }
    const handleQuestChange = (val: string) => {
        setQuestText(val);
        debouncedEventHandler(val);
    }
    return (
        <>
            <QuestionEditor
                activeQuestion={activeQuestion}
                currentQuestId={currentQuestId}
                open={openDialog}
                handleClose={handleClose}
            />
            <Stack direction="row" spacing={2} alignItems="center">
                <Autocomplete
                    id="asynchronous-demo"
                    sx={{ width: 300, mb: 2 }}
                    getOptionLabel={(option) => option.name}
                    options={quests}
                    onChange={(e, value) => handleFetchQuestionsByQuestId(value?.id)}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            value={questText}
                            onChange={(e) => handleQuestChange(e.target.value)}
                            label="Asynchronous"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />

                <Button disabled={!currentQuestId}
                    style={{ marginBottom: 20 }}
                    color="primary"
                    variant="contained"
                    onClick={handleClickOpen}>Create new question</Button>
            </Stack>
            <Paper>
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell >
                                    Question
                                </TableCell>
                                <TableCell >
                                    Quest
                                </TableCell>
                                <TableCell >
                                    Date
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questionsList.map((row) => {
                                return (
                                    <TableRow hover onClick={() => handleEdit(row)} role="checkbox" tabIndex={-1} key={row.id}>
                                        <TableCell>{row.text}</TableCell>
                                        <TableCell>{row.quest?.name}</TableCell>
                                        <TableCell>
                                            <Moment format="YYYY/MM/DD">
                                                {row.quest?.date}
                                            </Moment>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )

}
export default QuestionController;