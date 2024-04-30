import { Link } from 'react-router-dom'; // Import Link component from react-router-dom

const ErrorPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#f0f0f0', // Light gray background for contrast
        color: '#333', // Dark text for readability
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>404</h1>
      <p style={{ fontSize: '1.5rem' }}>
        Oops! We can't seem to find the page you're looking for.
      </p>
      <Link
        to="/"
        style={{
          marginTop: '20px',
          fontSize: '1.2rem',
          padding: '10px 20px',
          borderRadius: '5px',
          color: '#fff',
          backgroundColor: 'green',
          textDecoration: 'none',
          border: 'none',
        }}
      >
        Go Back
      </Link>
    </div>
  );
};

export default ErrorPage;
