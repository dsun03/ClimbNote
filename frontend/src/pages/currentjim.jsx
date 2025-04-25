<div className={`container ${currentGym ? currentGym.toLowerCase().replace(/\s/g, '-') : ''}`}>
        <div className="currentGymDiv">
          <h1>{currentGym || 'Loading gym...'}</h1>
        </div>

        <div className="buttonColumn">
          {[
            'Brooklyn Boulders',
            'CRG Riverside',
            'CRG Chelsea',
            'Movement LIC',
            'Vital LES',
          ].map((gymName) => (
            <button
              key={gymName}
              onClick={() => updateGym(gymName)}
              className={currentGym === gymName ? `active ${gymName.toLowerCase().replace(/\s/g, '-')}` : ''}
            >
              {gymName}
            </button>
          ))}
        </div>
      </div>



useEffect(() => {
  const fetchClimbCount = async () => {
    try {
      const response = await axios.get('/api/climbs/count', {
        params: { username }
      });
      setTotalClimbs(response.data.total);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
          setError('User not found.');
        } else {
          setError('Something went wrong. Please try again later.');
        }
      console.error('Error fetching climb count:', err);
    }
  };

  if (username) fetchClimbCount();
}, [username]);