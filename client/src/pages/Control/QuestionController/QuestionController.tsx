import { Paper, TableRow, TableBody, TableContainer, Table, TableHead, TableCell, TableFooter, Button } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import { RouteComponentProps } from "@reach/router";
import TablePagination from '@material-ui/core/TablePagination';
import QuestionEditor from "./QuestionEditor/QuestionEditor";
import { getQuestion, Question, questionActions } from "../../../redux/Questions";

interface Column {
    id: 'question';
    label: string;
    minWidth?: number;
}

const columns: Column[] = [
    { id: 'question', label: 'Question', minWidth: 170 },
];

const QuestionController: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
    const perPage = useSelector((state: RootState) => state.question.perPage);
    const page = useSelector((state: RootState) => state.question.page);
    const questionsList = useSelector((state: RootState) => state.question.list);
    const totalItems = useSelector((state: RootState) => state.question.totalItems);
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        dispatch(getQuestion({ page, perPage }));
    }, [dispatch, page, perPage]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(questionActions.changePage(value + 1))
    }

    const handleEdit = (item: Question) => {
        setActiveQuestion(item);
        handleClickOpen();
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        dispatch(questionActions.changePerPage(parseInt(event.target.value, 10)));
        dispatch(questionActions.changePage(1));
    };
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setActiveQuestion(null);
        setOpenDialog(false);
    };
    return (
        <>
            <QuestionEditor activeQuestion={activeQuestion} page={page} perPage={perPage} open={openDialog} handleClose={handleClose} />
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
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={3}
                                    count={totalItems}
                                    rowsPerPage={perPage}
                                    page={page - 1}
                                    onChangePage={(e, page) => handleChangePage(e!, page)}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}

                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
}
export default QuestionController;