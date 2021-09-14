import { RouteComponentProps } from "@reach/router"
import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getSignleNews } from "../../../../redux/News";
import { RootState } from "../../../../redux/store";


const SingleNews: FC<RouteComponentProps> = (props: any) => {
    const singleNews = useSelector((state: RootState) => state.news.singleNews);
    const dispatch = useDispatch();
    const id = props?.id;
    useEffect(() => {
        dispatch(getSignleNews(id));
    }, [dispatch, id])
    return (
        <div className="wrapper">
            <h3>{singleNews?.title}</h3>
            <p>{singleNews?.text}</p>
            <img src={singleNews?.imgUrl} alt={singleNews?.title} />
        </div>
    )
}

export default SingleNews
