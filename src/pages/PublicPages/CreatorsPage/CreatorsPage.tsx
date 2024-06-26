import React, { useContext } from 'react';
import ThemeContext from '../../../contexts/ThemeContext';
import './CreatorsPage.scss';
import { creators } from '../data/creatorsData';
import { Creator } from '../types';
import { Link } from 'react-router-dom';

const CreatorsPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${theme} creators-page`}>
      <header className="creators-header">
        <h1>Top Creators</h1>
      </header>
      <main className="creators-main">
        <ul className="creators-list">
          {creators.map((creator) => (
            <li key={creator.id} className="creator-box box">
              <img src={creator.image} alt={creator.name} className="creator-image" />
              <div>
                <h2>{creator.name}</h2>
                <p className="creator-username">@{creator.username}</p>
                <h3>{creator.title}</h3>
                <p>{creator.description}</p>
                <Link to={`/creators/${creator.id}`} className="view-profile">View Profile</Link>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default CreatorsPage;
