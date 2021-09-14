import { Button, Card, CardActions, CardMedia } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { navigate, RouteComponentProps } from '@reach/router'
import { useState } from 'react';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getNews } from '../../redux/News'
import { RootState } from '../../redux/store'
import classes from './Home.module.css';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';


const HomePage: FC<RouteComponentProps> = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const newsList = useSelector((state: RootState) => state.news.list);
    const totalPages = useSelector((state: RootState) => state.news.totalPages);

    useEffect(() => {
        dispatch(getNews({ page, perPage }));
    }, [dispatch, page, perPage]);

    useEffect(() => {
        document.title = 'Quest news';
    }, []);

     

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }


    const handleDetailsClick = (id: string) => {
        navigate(`/news/${id}`);
    }

    return (
        <div className={classes.main_wrapper}>

            <div className={classes.news_wrapper}>
                {newsList?.map(item =>
                (
                    <Card key={item.id} className={classes.news_item}>
                        <CardMedia

                            className={classes.media}
                            image={item.imgUrl}
                        />
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {item.title}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                tags
                            </Typography>
                            <Typography variant="body2" component="p">
                                {item.text.substring(0, 80)}...
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => handleDetailsClick(item.id!)} size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                )
                )}
            </div>
            {newsList?.length ? <Pagination count={totalPages} onChange={handleChangePage} color="primary" /> : null}
        </div>
    )
}
export default HomePage;