import { Paper, TableRow, TableBody, TableContainer, Table, TableHead, TableCell, Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import { RouteComponentProps } from "@reach/router";
import QuestionEditor from "./QuestionEditor/QuestionEditor";
import { getQuestionsByQuestId, Question, questActions } from "../../../redux/Quest";

interface Column {
    id: 'text';
    label: string;
    minWidth?: number;
}

const columns: Column[] = [
    { id: 'text', label: 'Question', minWidth: 170 },
];

const QuestionController: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
    const questionsList = useSelector((state: RootState) => state.quest.questionList);
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        if (!openDialog) {
            // dispatch(getQuestionsByQuestId());
        }
    }, [dispatch, openDialog]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(questActions.changePage(value + 1))
    }

    const handleEdit = (item: Question) => {
        setActiveQuestion(item);
        handleClickOpen();
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        dispatch(questActions.changePerPage(parseInt(event.target.value, 10)));
        dispatch(questActions.changePage(1));
    };
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setActiveQuestion(null);
        setOpenDialog(false);
    };
    return <>
        <QuestionEditor activeQuestion={activeQuestion} open={openDialog} handleClose={handleClose} />
        <Button style={{ marginBottom: 20 }} color="primary" variant="contained" onClick={handleClickOpen}>Create new</Button>
        <Paper>
            <TableContainer >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questionsList.map((row) => {
                            return (
                                <TableRow hover onClick={() => handleEdit(row)} role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} >
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    </>;
}
export default QuestionController;