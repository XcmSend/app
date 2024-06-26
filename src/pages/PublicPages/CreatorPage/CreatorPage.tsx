import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ThemeContext from '../../../contexts/ThemeContext';
import './CreatorPage.scss';
import { creators } from '../data/creatorsData';
import { Community, Creator, Template } from '../types';
import { communities } from '../data/communitiesData';

const creatorRecord: Record<string, Creator> = creators.reduce((acc, creator) => {
  acc[creator.id] = creator;
  return acc;
}, {} as Record<string, Creator>);

const templateRecord: Record<string, Template> = communities.flatMap(community => 
  [...community.templates.bagpipes, ...community.templates.ui]
).reduce((acc, template) => {
  acc[template.id] = template;
  return acc;
}, {} as Record<string, Template>);

const CreatorPage = () => {
  const { theme } = useContext(ThemeContext);
  const { creatorId } = useParams<{ creatorId: string }>();
  const creator = creatorRecord[creatorId];

  if (!creator) {
    return <div className={`${theme} creator-page`}>Creator not found</div>;
  }

  return (
    <div className={`${theme} creator-page`}>
      <header className="creator-header">
        <img src={creator.image} alt={creator.name} className="creator-image-large" />
        <div>
          <h1>{creator.name}</h1>
          <p className="creator-username">@{creator.username}</p>
          <h2>{creator.title}</h2>
          <p>{creator.description}</p>
        </div>
      </header>
      <main>
        <section className="creator-section">
          <h2>Templates Linked</h2>
          <ul className="templates-list">
            {creator.templates.map(templateId => {
              const template = templateRecord[templateId];
              console.log("template", template);
              return template ? (
                <li key={template.id} className="template-box">
                  <strong>{template.title}</strong>
                  <p>{template.description}</p>
                </li>
              ) : (
                <li key={templateId} className="template-box">
                  <strong>Template not found</strong>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default CreatorPage;
