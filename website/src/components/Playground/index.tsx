/* eslint-disable global-require */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
//@ts-ignore
import Image from '@theme/IdealImage';
import Heading from '@theme/Heading';

interface Props {
  name: string;
  image: string;
  url: string;
  urlTS: string;
  description: ReactNode;
}

const TodoPlaygrounds = [
  {
    name: '📦 CodeSandbox',
    image: require('@site/static/img/playgrounds/codesandbox.png'),
    url: 'https://codesandbox.io/p/sandbox/github/venkateshsundaram/state-jet/tree/main/examples/todo-list-app/classic-javascript?file=%2FREADME.md&privacy=public',
    urlTS: 'https://codesandbox.io/p/sandbox/github/venkateshsundaram/state-jet/tree/main/examples/todo-list-app/classic-typescript?file=%2FREADME.md&privacy=public',
    description: (
      <Translate id="playground.codesandbox.description">
        CodeSandbox is an online code editor and development environment that
        allows developers to create, share and collaborate on web development
        projects in a browser-based environment
      </Translate>
    ),
  }
];

const EcommercePlaygrounds = [
  {
    name: '📦 CodeSandbox',
    image: require('@site/static/img/playgrounds/codesandbox.png'),
    url: 'https://codesandbox.io/p/sandbox/github/venkateshsundaram/state-jet/tree/main/examples/ecommerce-app/classic-javascript?file=%2FREADME.md&privacy=public',
    urlTS: 'https://codesandbox.io/p/sandbox/github/venkateshsundaram/state-jet/tree/main/examples/ecommerce-app/classic-typescript?file=%2FREADME.md&privacy=public',
    description: (
      <Translate id="playground.codesandbox.description">
        CodeSandbox is an online code editor and development environment that
        allows developers to create, share and collaborate on web development
        projects in a browser-based environment
      </Translate>
    ),
  }
];

function PlaygroundCard({name, image, url, urlTS, description}: Props) {
  return (
    <div className="col col--6 margin-bottom--lg">
      <div className={clsx('card')}>
        <div className={clsx('card__image')}>
          <Link to={url}>
            <Image img={image} alt={`${name}'s image`} />
          </Link>
        </div>
        <div className="card__body">
          <Heading as="h3">{name}</Heading>
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <div style={{textAlign: 'center'}}>
            <b>
              <Translate id="playground.tryItButton">Try it now!</Translate>
            </b>
          </div>
          <div className="button-group button-group--block">
            <Link className="button button--secondary" to={url}>
              JavaScript
            </Link>
            <Link className="button button--secondary" to={urlTS}>
              TypeScript
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TodoPlayground(): ReactNode {
  return (
    <div className="row">
      {TodoPlaygrounds.map((playground: Props) => (
        <PlaygroundCard key={playground.name} {...playground} />
      ))}
    </div>
  );
}

export function EcommercePlayground(): ReactNode {
  return (
    <div className="row">
      {EcommercePlaygrounds.map((playground: Props) => (
        <PlaygroundCard key={playground.name} {...playground} />
      ))}
    </div>
  );
}