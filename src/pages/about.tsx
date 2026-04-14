import React from 'react';

import { Content } from '../content/Content';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';

import { ReactElement } from 'react';

const About = () => (
  <Content>
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione fuga
      recusandae quidem. Quaerat molestiae blanditiis doloremque possimus
      labore voluptatibus distinctio recusandae autem esse explicabo molestias
      officia placeat, accusamus aut saepe.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione fuga
      recusandae quidem. Quaerat molestiae blanditiis doloremque possimus
      labore voluptatibus distinctio recusandae autem esse explicabo molestias
      officia placeat, accusamus aut saepe.
    </p>
  </Content>
);

About.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main meta={<Meta title="About" description="About Kanocs" />}>
      {page}
    </Main>
  );
};

export default About;
