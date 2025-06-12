
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const Admin2 = () => {
  useEffect(() => {
    // Redirect to main admin portal
    window.location.href = '/admin';
  }, []);

  return (
    <>
      <Helmet>
        <title>Redirecting... | Ballito Baby Gear</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl mb-4">Redirecting to Admin Portal...</h1>
        <p>If you are not redirected automatically, <a href="/admin" className="text-accent underline">click here</a>.</p>
      </div>
    </>
  );
};

export default Admin2;
