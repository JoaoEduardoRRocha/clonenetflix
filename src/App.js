import React, { useEffect, useState } from 'react';
import './App.css'
import Tmdb from './API/Tmdb';
import MovieRow from './Components/MovieRow/MovieRow'
import FeaturedMovie from './Components/FeaturedMovie/FeaturedMovie'
import Header from './Components/Header/Header'



export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);


  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeatureData(chosenInfo)
    } 
    
    loadAll()
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    
    window.addEventListener('scroll', scrollListener)

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }

  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
        <MovieRow key={key}  title={item.title}  items={item.items} />
        ))}
      </section>

      <footer>
          Feito com muita dedicação! <br/>
          Direitos de imagem para <strong>Netflix</strong>! <br/>
          Dados Retirados do site Themoviedb.org
      </footer>


      {movieList.length <= 0 &&
        <div className='loading'>
          <img src='https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2560%2Cc_limit/Netflix_LoadTime.gif' />
        </div>
      }
    </div>
  )
}