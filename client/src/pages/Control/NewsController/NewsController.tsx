import { Paper, TableRow, TableBody, TableContainer, Table, TableHead, TableCell, TableFooter, Button } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNews, News, newsActions } from "../../../redux/News";
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
    const perPage = useSelector((state: RootState) => state.news.perPage);
    const page = useSelector((state: RootState) => state.news.page);
    const [activeNews, setActiveNews] = useState<News | null>(null);
    const newsList = useSelector((state: RootState) => state.news.list);
    const totalItems = useSelector((state: RootState) => state.news.totalItems);
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        dispatch(getNews({ page, perPage }));
    }, [dispatch, page, perPage]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(newsActions.changePage(value + 1))
    }

    const handleEdit = (item: News) => {
        setActiveNews(item);
        handleClickOpen();
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        dispatch(newsActions.changePerPage(parseInt(event.target.value, 10)));
        dispatch(newsActions.changePage(1));
    };
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = (refresh: boolean) => {
        setActiveNews(null);
        setOpenDialog(false);
    };
    return (
        <>
            <NewsEditor activeNews={activeNews} page={page} perPage={perPage} open={openDialog} handleClose={handleClose} />
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