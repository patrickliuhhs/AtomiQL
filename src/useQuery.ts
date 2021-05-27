import { atom, useAtom } from 'jotai';
import { request } from 'graphql-request';
import { useEffect, useContext } from 'react';
import { AppContext } from './atomiContext';

export interface AtomData {
  loading: boolean;
  data: null | { [key: string]: any };
  hasError: boolean;
}

type AtomDataArray = [null | { [key: string]: any }, boolean, boolean];

const initialAtomData: AtomData = {
  loading: true,
  data: null,
  hasError: false,
}

const newAtom = atom(initialAtomData);


const useQuery = (query: string): AtomDataArray => {
  // pull cache from context
    // check if query is an object on context.cache
    // if yes, do something
    // if not, then proceed as normal
  // const [atomData, setAtom] etc.
    // useEffect...
    // return [data, loading, hasErrror]
    // write to cache {'querytext': atomData}

  const { url, cache, setCache } = useContext(AppContext);
  console.log('url', url);
  // console.log('cache', cache);

  const cacheResponse = cache[query];

  if (cacheResponse) {
    console.log('you did it!');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cachedAtomData] = useAtom(cacheResponse);
    const { loading, hasError, data } = cachedAtomData;
    // const { loading, hasError, data } = useAtom(cache[query]);
    console.log('cachedAtomData after successful cache', cachedAtomData);
    return [data, loading, hasError];
    
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [atomData, setAtom] = useAtom(newAtom);
  console.log('atomData inside usequery', atomData);
  const { loading, hasError, data } = atomData;
  console.log('newAtom inside usequery', newAtom);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    (async () => {
      try {
        const result = await request(url, query)
        console.log('result inside setAtom useEffect', result);
        setAtom({
          data: result,
          loading: false,
          hasError: false
        });
      } catch {
        console.log('catch');
        setAtom({
          data: null,
          loading: false,
          hasError: true
        })
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log('newAtom inside setcache useeffect: ', newAtom);
    if (!loading) {
      setCache(query, newAtom);
      console.log('not loading in setcache useeffect');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atomData]);

  return [data, loading, hasError];
};

export const getAtom = (): AtomData => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [atomData] = useAtom(newAtom)
  return atomData
}

export default useQuery;
