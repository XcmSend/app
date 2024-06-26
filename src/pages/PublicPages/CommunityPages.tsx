import React, { useState, useEffect, useRef, useContext } from 'react';
import ThemeContext from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import './CommunityPages.scss';
import { Community } from './types';
import { communities } from './data/communitiesData';

const CommunityPages: React.FC = () => {    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleNavigate = (communityName) => {
        navigate(`/pages/${communityName}`);
      };
    

    return (
    <div className={`${theme} community-pages lab-container p-8 h-full`}>

      <h1>Communities</h1>
      <div className="community-list">
        {communities.map((community) => (
          <div key={community.name} className="community-card" onClick={() => handleNavigate(community.name)}>
            <img src={community.logo} alt={community.name} className="community-logo" />  
            <h2>{community.name}</h2>
            <p>{community.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityPages;


