import { Paper, TableRow, TableBody, TableContainer, Table, TableHead, TableCell, TableFooter } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNews, News } from "../../../redux/News";
import { RootState } from "../../../redux/store";

import { RouteComponentProps } from "@reach/router";
import TablePagination from '@material-ui/core/TablePagination';
import NewsEditor from "./NewsEditor/NewsEditor";
interface Column {
    id: 'title';
    label: string;
    minWidth?: number;
}

const columns: Column[] = [
    { id: 'title', label: 'Title', minWidth: 170 },
];

const NewsController: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [activeNews, setActiveNews] = useState<News | null>(null);
    const newsList = useSelector((state: RootState) => state.news.list);
    const totalItems = useSelector((state: RootState) => state.news.totalItems);
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        dispatch(getNews({ page, perPage }));
    }, [dispatch, page, perPage]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value + 1);
    }

    const handleEdit = (item: News) => {
        setActiveNews(item);
        handleClickOpen();
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = (refresh: boolean) => {
        if (refresh) {
            dispatch(getNews({ page, perPage }));
        }
        setOpenDialog(false);
    };
    return (
        <>
            <NewsEditor activeNews={activeNews} open={openDialog} handleClose={handleClose} />

            <Paper  >
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
                            {newsList.map((row) => {
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
export default NewsController;