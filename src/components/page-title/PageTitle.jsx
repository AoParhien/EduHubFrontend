import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'AoParhein';

// Sets the browser tab title for the current page.
const PageTitle = ({ title }) => (
  <Helmet>
    <title>{title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Find a tuition institute and book your seat`}</title>
  </Helmet>
);

export default PageTitle;
