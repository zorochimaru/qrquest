import { Paper, TableRow, TableBody, TableContainer, Table, TableHead, TableCell, Button, Autocomplete, TextField, CircularProgress, Stack, Grid, Typography } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import { RouteComponentProps } from "@reach/router";
import QuestionEditor from "./QuestionEditor/QuestionEditor";
import { getQuestionsByQuestId, Question, questActions, Quest, changeOrderOnDB } from "../../../redux/Quest";
import axios from 'axios';
import { debounce } from 'lodash';
import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DroppableProvided, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { Reorder } from '@mui/icons-material';
import { format } from 'date-fns';



const QuestionController: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
    const questionsList = useSelector((state: RootState) => state.quest.questionList);
    const currentQuestId = useSelector((state: RootState) => state.quest.currentQuestId);
    const [openDialog, setOpenDialog] = useState(false);
    const [questId, setQuestId] = useState('');
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
        handleChangeQuestId(questId);
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

    const handleDragEnd = useCallback((result: DropResult, provided?: ResponderProvided) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const fromId = questionsList[result.source.index]?.id;
        const toId = questionsList[result.destination.index]?.id;
        if (fromId && toId) {
            dispatch(changeOrderOnDB(result, fromId, toId));
        }

    }, [dispatch, questionsList])

    const handleChangeQuestId = (val: string | undefined) => {
        if (val) {
            setQuestId(val);
            handleFetchQuestionsByQuestId(val);
        }
    }
    return (
        <>
            <QuestionEditor
                nextQuestionOrder={questionsList.length}
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
                    onChange={(e, value) => handleChangeQuestId(value?.id)}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            onChange={(e) => debouncedEventHandler(e.target.value)}
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
                    onClick={handleClickOpen}>Add question</Button>
            </Stack>
            <Paper>
                <TableContainer>
                    <Table stickyHeader>
                        <colgroup>
                            <col style={{ width: "5%" }} />
                            <col style={{ width: "55%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "20%" }} />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">&nbsp;</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell align="right">Quest name</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="droppable" direction="vertical">
                                {(droppableProvided: DroppableProvided) => (
                                    <TableBody
                                        ref={droppableProvided.innerRef}
                                        {...droppableProvided.droppableProps}
                                    >
                                        {questionsList.map((item, index: number) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id!}
                                                index={index}
                                            >
                                                {(
                                                    draggableProvided: DraggableProvided,
                                                    snapshot: DraggableStateSnapshot
                                                ) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            onClick={() => handleEdit(item)}
                                                            ref={draggableProvided.innerRef}
                                                            {...draggableProvided.draggableProps}
                                                            style={{
                                                                ...draggableProvided.draggableProps.style,
                                                                opacity: snapshot.isDragging ? .5 : 1

                                                            }}

                                                        >
                                                            {/* note: `snapshot.isDragging` is useful to style or modify behaviour of dragged cells */}
                                                            <TableCell align="left">
                                                                <div {...draggableProvided.dragHandleProps}>
                                                                    <Reorder />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell  sx={{ background: `url(${item.imgUrl})` }}>
                                                                <Typography variant="body1" color="initial">{item.text}</Typography>
                                                                 </TableCell>
                                                            <TableCell align="right">{item.quest?.name}</TableCell>
                                                            <TableCell align="right">{format(new Date(item.quest?.date || ''), 'dd.MM.yyyy/HH:mm')}</TableCell>
                                                        </TableRow>
                                                    );
                                                }}
                                            </Draggable>
                                        ))}
                                        {droppableProvided.placeholder}
                                    </TableBody>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Table>
                </TableContainer>
                {/* <DragDropContext
                    onDragEnd={(e) => onDragEnd(e.source.index, e.destination?.index)}
                >
                    <Grid container>
                        <Grid sx={{ minHeight: '500px' }} item xs={6}>
                            <Droppable droppableId="droppable-1">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {
                                            questionsList.map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id!} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div

                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                width: 300,
                                                                height: 40,
                                                                background: 'red',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                ...provided.draggableProps.style
                                                            }}
                                                        >
                                                            {item.text}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                    </div>
                                )}
                            </Droppable>
                        </Grid>

                    </Grid>
                </DragDropContext> */}
                {/* <TableContainer >
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
                </TableContainer> */}
            </Paper>
        </>
    )

}
export default QuestionController;