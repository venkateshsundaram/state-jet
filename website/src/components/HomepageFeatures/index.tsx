import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Ultra Minimal and Reactish',
    Svg: require('@site/static/img/icon-reactish.svg').default,
    description: (
      <>
       StateJet works and thinks like React. Add it to your app and get ultra fast and flexible global state.
      </>
    ),
  },
  {
    title: 'Advanced State Management',
    Svg: require('@site/static/img/advanced-concepts.svg').default,
    description: (
      <>
       StateJet supports advanced state management concepts such as CRDT / Derived State, Optimistic update
      </>
    ),
  },
  {
    title: 'Cross-App Observation',
    Svg: require('@site/static/img/cross-app-observation.svg').default,
    description: (
      <>
        StateJet supports persistence, encryption, redo/undo by observing all state changes across your app.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
