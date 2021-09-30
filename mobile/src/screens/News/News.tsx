import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getNews, newsActions, refreshNews } from '../../redux/News';
import { RootState } from '../../redux/store';
import NewsCard from './components/NewsCard/NewsCard';

const News = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.news.loading);
  const perPage = useSelector((state: RootState) => state.news.perPage);
  const page = useSelector((state: RootState) => state.news.page);
  const newsList = useSelector((state: RootState) => state.news.list);
  const totalPages = useSelector((state: RootState) => state.news.totalPages);
  useEffect(() => {
    dispatch(getNews({ page, perPage }));
  }, [dispatch, page, perPage]);

  const onRefresh = () => {
    dispatch(refreshNews({ page: 1, perPage }));
  };

  const onLoadMore = () => {
    if (totalPages > page) {
      dispatch(newsActions.changePage(page + 1));
    }
  };

  return (<>

    <SafeAreaView style={styles.container}>
      <FlatList
        data={newsList}
        renderItem={NewsCard}
        keyExtractor={item => item.id}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.2}
        refreshing={loading}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  </>);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default News;
