import React, { useState, useEffect } from 'react';

import { fetchSynonyms } from '../fetchData';
import { Container } from '../components/SharedComponents';
import { Header, Word, WordGroup, Speech } from '../components/MainComponents';
import SynonymGroups from '../components/SynonymGroups';

const Main = (props) => {
  const word = props.location.pathname.substr(1);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [partsOfSpeech, setPartsOfSpeech] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    // get data
    const getSynonyms = async (word) => {
      const data = await fetchSynonyms(word);
      setData(data);
      setFilteredData(data);
    };

    getSynonyms(word);
  }, [word]);

  useEffect(() => {
    // get parts of speech
    const parts = [];
    if (data) {
      data.forEach((word) => {
        if (Array.isArray(word)) {
          parts.push(word[0].type);
        } else {
          parts.push(word.type);
        }
      });

      setPartsOfSpeech(parts);
    }
  }, [data]);

  useEffect(() => {
    // filter data
    if (data) {
      let fData = [...data];
      // reset filter
      if (filter === '') {
        setFilteredData(fData);
      } else {
        // filter data
        fData = fData.filter((g) => {
          if (Array.isArray(g)) {
            return g[0].type === filter;
          } else {
            return g.type === filter;
          }
        });
        setFilteredData(fData);
      }
      setLoading(false);
    }
  }, [filter, data]);

  //useEffect(() => {
  //return () => {
  //setLoading(true);
  //};
  //}, []);

  const changeFilterHandler = (word) => {
    if (filter === word) {
      setFilter('');
    } else {
      setFilter(word);
    }
  };

  if (loading) {
    return <h3>Loading....</h3>;
  }

  return (
    <Container>
      <Header>Synonyms for {word}</Header>
      <WordGroup>
        <Word>{word}</Word>
        {partsOfSpeech.map((part) => (
          <Speech
            key={part}
            onClick={() => changeFilterHandler(part)}
            current={filter}
            self={part}
          >
            {part.length > 4 ? part.slice(0, 3) + '.' : part + '.'}
          </Speech>
        ))}
      </WordGroup>
      <SynonymGroups data={filteredData} />
    </Container>
  );
};

export default Main;