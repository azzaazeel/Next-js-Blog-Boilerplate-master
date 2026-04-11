import React, { ReactNode } from 'react';

type INavbarProps = {
  children: ReactNode;
};

const Navbar = (props: INavbarProps) => (
  <ul className="navbar flex flex-wrap text-xl font-bold">
    {props.children}

    <style jsx>
      {`
        .navbar :global(a) {
          @apply transition-all duration-200;
        }

        .navbar :global(a:hover),
        .navbar :global(a.active) {
          text-decoration: underline;
          text-decoration-color: #f7b731;
          text-decoration-thickness: 2px;
          text-underline-offset: 6px;
        }
      `}
    </style>
  </ul>
);

export { Navbar };
