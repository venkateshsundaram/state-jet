import React from 'react';
import Container from '../core/Container';
import GridBlock from '../core/GridBlock';
import Layout from '@theme/Layout';

function HelpFeatures() {
  const supportLinks = [
    {
      content: (
        <span>
          We often around and available for questions.
        </span>
      ),
      title: 'Need help?',
    },
    {
      content: (
        <span>
          Many members of the community use Stack Overflow to ask questions.
          Read through the{' '}
          <a target='_blank' href="https://stackoverflow.com/questions/tagged/state-jet?sort=active">
            existing questions
          </a>{' '}
          tagged with <b>#state-jet</b> or{' '}
          <a target='_blank' href="https://stackoverflow.com/questions/ask?tags=state-jet">
            ask your own
          </a>
          !
        </span>
      ),
      title: 'Stack Overflow',
    },
    {
      content: (
        <span>
          Many developers and users idle in our{' '}
          <a target='_blank' href="https://discord.gg/fxjXrHBVNH">Discord server</a>.
        </span>
      ),
      title: 'Discord',
    },
    {
      content: (
        <span>
          We are on Twitter as{' '}
          <a target='_blank' href="https://x.com/statejet/">@StateJet</a>.
        </span>
      ),
      title: 'X(Twitter)',
    },
  ];
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="help-wrapper">
          <GridBlock contents={supportLinks} />
        </div>
      </Container>
    </div>
  );
}

export default function Help() {
  return (
    <Layout>
      <HelpFeatures />
    </Layout>
  );
}