import { Paper, TableRow, TableBody, TableContainer, Table, TableHead, TableCell, TableFooter, Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import { RouteComponentProps } from "@reach/router";
import TablePagination from '@mui/material/TablePagination';
import QuestEditor from "./QuestEditor/QuestEditor";
import { getQuestList, Quest, questActions } from '../../../redux/Quest';

interface Column {
    id: 'name';
    label: string;
    minWidth?: number;
}

const columns: Column[] = [
    { id: 'name', label: 'Quest Name', minWidth: 170 },
];

const QuestController: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
    const perPage = useSelector((state: RootState) => state.quest.perQuestPage);
    const page = useSelector((state: RootState) => state.quest.questPage);
    const questionsList = useSelector((state: RootState) => state.quest.questList);
    const totalItems = useSelector((state: RootState) => state.quest.totalQuests);
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        if (!openDialog) {
            dispatch(getQuestList({ page, perPage }));
        }
    }, [dispatch, page, perPage, openDialog]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(questActions.changePage(value + 1))
    }

    const handleEdit = (item: Quest) => {
        setActiveQuest(item);
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
        setActiveQuest(null);
        setOpenDialog(false);
    };
    return <>
        <QuestEditor activeQuest={activeQuest} open={openDialog} handleClose={handleClose} />
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
                                onPageChange={(e, page) => handleChangePage(e!, page)}
                                onRowsPerPageChange={handleChangeRowsPerPage}

                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    </>;
}
export default QuestController;